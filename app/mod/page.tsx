import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ModActions } from "@/components/mod-actions"
import { getReports } from "@/lib/actions/report.actions"

export default async function ModPage() {
  const result = await getReports()
  const reports = result.success ? result.data : []

  const pendingReports = reports?.filter((r) => r.status === "pending")
  const resolvedReports = reports?.filter((r) => r.status !== "pending")

  return (
    <div className="min-h-screen">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-balance">Moderation Panel</h1>
              <p className="text-sm text-muted-foreground">Review and manage reported content</p>
            </div>
            <Link href="/">
              <Button variant="outline">Back to Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">
            Pending Reports <Badge variant="destructive">{pendingReports?.length || 0}</Badge>
          </h2>
          <div className="space-y-4">
            {pendingReports?.map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {report.contentType === "thread" ? "Thread" : "Reply"} #{report.contentId}
                      </CardTitle>
                      <CardDescription>{report.reportedAt.toLocaleString()}</CardDescription>
                    </div>
                    <Badge>{report.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <p className="text-sm font-medium mb-1">Reason:</p>
                    <p className="text-sm text-muted-foreground text-balance">{report.reason}</p>
                  </div>
                  <ModActions reportId={report.id} contentType={report.contentType} contentId={report.contentId} />
                </CardContent>
              </Card>
            ))}

            {pendingReports?.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No pending reports</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Resolved Reports</h2>
          <div className="space-y-4">
            {resolvedReports?.slice(0, 10).map((report) => (
              <Card key={report.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-base">
                        {report.contentType === "thread" ? "Thread" : "Reply"} #{report.contentId}
                      </CardTitle>
                      <CardDescription>{report.reportedAt.toLocaleString()}</CardDescription>
                    </div>
                    <Badge variant="secondary">{report.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground text-balance">{report.reason}</p>
                </CardContent>
              </Card>
            ))}

            {resolvedReports?.length === 0 && (
              <Card>
                <CardContent className="py-8 text-center text-muted-foreground">
                  <p>No resolved reports yet</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
