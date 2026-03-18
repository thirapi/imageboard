import Link from "next/link";
import { Plus, Settings, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getAllBoards, deleteBoard } from "@/lib/actions/board.actions";

export default async function BoardsPage() {
  const boards = await getAllBoards();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Board</h1>
          <p className="text-muted-foreground">
            Kelola daftar board yang tersedia di situs.
          </p>
        </div>
        <Link href="/mod/boards/new">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Board Baru
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Board</CardTitle>
          <CardDescription>
            Menampilkan {boards.length} board yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Kode</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {boards.map((board) => (
                <TableRow key={board.id}>
                  <TableCell className="font-bold text-accent">
                    /{board.code}/
                  </TableCell>
                  <TableCell>{board.name}</TableCell>
                  <TableCell className="max-w-md truncate text-muted-foreground">
                    {board.description || "-"}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/mod/boards/${board.id}`}>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </Link>
                    {/* Delete functionality would ideally have a confirmation dialog */}
                    {/* For now, keeping it simple as per user request to have CRUD working */}
                  </TableCell>
                </TableRow>
              ))}
              {boards.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    Belum ada board yang terdaftar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
