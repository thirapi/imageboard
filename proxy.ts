import { lucia } from "@/lib/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
	// 1. Baca sessionId dari cookies pada request yang masuk
	const sessionId = request.cookies.get(lucia.sessionCookieName)?.value ?? null;

	// Jika pengguna mencoba mengakses halaman login, kita biarkan saja
	if (request.nextUrl.pathname === "/mod/login") {
		return NextResponse.next();
	}

	// 2. Jika tidak ada session, redirect ke halaman login
	if (!sessionId) {
		return NextResponse.redirect(new URL("/mod/login", request.url));
	}

	const { session, user } = await lucia.validateSession(sessionId);

	// 3. Jika session tidak valid/ada, buat response untuk menghapus cookie di browser
	if (!session) {
		// Buat cookie kosong untuk menimpa cookie yang tidak valid
		const sessionCookie = lucia.createBlankSessionCookie();
		
		// Buat response redirect
		const response = NextResponse.redirect(new URL("/mod/login", request.url));
		
		// Lampirkan perintah "set-cookie" pada response tersebut
		response.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);
		
		// Kembalikan response yang sudah dimodifikasi
		return response;
	}

    // 4. Cek role user, jika tidak sesuai, redirect
    if (user?.role !== "moderator" && user?.role !== "admin") {
        return NextResponse.redirect(new URL("/", request.url));
    }

	// 5. Jika session "fresh" (baru diperbarui), kita perlu mengirim cookie baru ke client
	if (session.fresh) {
        // Buat response untuk melanjutkan navigasi
		const response = NextResponse.next();
        
        // Buat cookie baru dari session yang fresh
		const sessionCookie = lucia.createSessionCookie(session.id);

        // Lampirkan cookie baru pada response
		response.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes
		);
		return response;
	}

	// 6. Jika semua valid dan tidak ada yang perlu diubah, lanjutkan ke halaman tujuan
	return NextResponse.next();
}

// Gunakan matcher untuk menentukan path mana saja yang akan dieksekusi oleh middleware ini
export const config = {
	matcher: "/mod/:path*",
};
