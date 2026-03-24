"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Ban, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  LayoutList, 
  LayoutGrid, 
  Columns,
  MessageSquare,
  History,
  ShieldAlert,
  Bot
} from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ModActions } from "@/components/mod-actions";
import {
  bulkResolveReports,
  bulkDismissReports,
} from "@/lib/actions/moderation.actions";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface Report {
  id: number;
  contentType: string;
  contentId: number;
  reason: string;
  reportedAt: Date;
  content: string;
  author: string;
  ipAddress?: string | null;
  status: string;
  isLocked?: boolean;
  isPinned?: boolean;
  isBanned?: boolean;
  boardCode?: string;
  parentThreadId?: number;
  postNumber?: number;
  image?: string;
  imageMetadata?: any;
}

interface ModerationDashboardProps {
  initialPendingReports: Report[];
  pendingTotal: number;
  currentPage: number;
  totalPages: number;
}

export function ModerationDashboard({
  initialPendingReports,
  pendingTotal,
  currentPage,
  totalPages,
}: ModerationDashboardProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isCompact, setIsCompact] = useState(false);
  const [activeReportId, setActiveReportId] = useState<number | null>(null);
  
  const { toast } = useToast();
  const router = useRouter();

  const activeReport = useMemo(() => 
    initialPendingReports.find(r => r.id === activeReportId),
    [activeReportId, initialPendingReports]
  );

  const toggleSelect = (id: number, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (selectedIds.length === initialPendingReports.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(initialPendingReports.map((r) => r.id));
    }
  };

  async function handleBulkAction(action: "resolve" | "dismiss") {
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    try {
      const result = action === "resolve" 
        ? await bulkResolveReports(selectedIds)
        : await bulkDismissReports(selectedIds);

      if (result?.success) {
        toast({
          title: "Sukses",
          description: `${selectedIds.length} laporan berhasil diperbarui`,
        });
        setSelectedIds([]);
        setActiveReportId(null);
        router.refresh();
      } else {
        toast({
          title: "Kesalahan",
          description: result?.error || "Gagal melakukan tindakan masal",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Bulk action error:", error);
    } finally {
      setIsProcessing(false);
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Utility Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between sticky top-0 z-20 bg-background/95 backdrop-blur py-4 border-b gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
                id="select-all" 
                checked={selectedIds.length === initialPendingReports.length && initialPendingReports.length > 0}
                onCheckedChange={selectAll}
            />
            <label htmlFor="select-all" className="text-sm font-medium cursor-pointer select-none">
              Pilih ({selectedIds.length})
            </label>
          </div>
          
          <div className="h-4 w-px bg-border hidden md:block" />

          <div className="flex items-center bg-muted rounded-md p-0.5">
             <Button 
                variant={isCompact ? "ghost" : "secondary"} 
                size="icon-sm" 
                onClick={() => setIsCompact(false)}
                className="h-7 w-7"
                title="Tampilan Detail"
             >
                <LayoutGrid className="h-3.5 w-3.5" />
             </Button>
             <Button 
                variant={isCompact ? "secondary" : "ghost"} 
                size="icon-sm" 
                onClick={() => setIsCompact(true)}
                className="h-7 w-7"
                title="Tampilan Kompak"
             >
                <LayoutList className="h-3.5 w-3.5" />
             </Button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-green-500/50 text-green-600 hover:bg-green-50 dark:hover:bg-green-950/20"
                onClick={() => handleBulkAction("resolve")}
                disabled={isProcessing}
              >
                <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                Selesaikan
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-8 border-orange-500/50 text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-950/20"
                onClick={() => handleBulkAction("dismiss")}
                disabled={isProcessing}
              >
                <XCircle className="h-3.5 w-3.5 mr-1.5" />
                Abaikan
              </Button>
            </div>
          )}
          <Badge variant="outline" className="ml-2 font-mono">
             {pendingTotal} Laporan
          </Badge>
        </div>
      </div>

      <div className={cn(
        "grid gap-6 transition-all duration-300",
        activeReportId ? "grid-cols-1 lg:grid-cols-[1fr_400px]" : "grid-cols-1"
      )}>
        {/* Reports List */}
        <div className="space-y-3">
          {initialPendingReports.map((report) => (
            <div 
              key={report.id}
              onClick={() => setActiveReportId(activeReportId === report.id ? null : report.id)}
              className={cn(
                "group relative border rounded-lg transition-all cursor-pointer overflow-hidden",
                selectedIds.includes(report.id) ? "border-primary ring-1 ring-primary/20" : "hover:border-muted-foreground/30",
                activeReportId === report.id ? "bg-primary/5 border-primary/50 shadow-sm" : 
                report.reason.includes("[AI DETECTION]") ? "bg-orange-500/5 dark:bg-orange-500/10 border-orange-500/20" : "bg-card",
                isCompact ? "p-2" : "p-4"
              )}

            >
              <div className="flex gap-4 items-start">
                 <div className="pt-1" onClick={(e) => e.stopPropagation()}>
                    <Checkbox 
                      checked={selectedIds.includes(report.id)}
                      onCheckedChange={() => toggleSelect(report.id)}
                    />
                 </div>

                 <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                       <div className="flex items-center gap-2 overflow-hidden">
                          <Badge 
                            variant="outline" 
                            className={cn(
                              "text-[9px] uppercase font-black px-1 h-4 border-muted-foreground/30",
                              activeReportId === report.id ? "text-primary border-primary/30" : "text-muted-foreground"
                            )}
                          >
                            {report.contentType}
                          </Badge>
                          <span className={cn(
                            "text-[11px] font-mono",
                            activeReportId === report.id ? "text-primary/70" : "text-muted-foreground"
                          )}>
                            #{report.contentId}
                          </span>
                          {report.reason.includes("[AI DETECTION]") && (
                            <Badge variant="outline" className="text-[9px] h-4 bg-orange-500/10 text-orange-600 border-orange-500/30 gap-1 px-1">
                              <Bot className="h-2.5 w-2.5" /> AI
                            </Badge>
                          )}
                          {report.boardCode && (

                            <Badge variant="secondary" className="text-[10px] h-4 bg-primary/10 text-primary border-none">/{report.boardCode}/</Badge>
                          )}
                       </div>
                       <span className={cn(
                         "text-[10px] whitespace-nowrap",
                         activeReportId === report.id ? "text-primary/70" : "text-muted-foreground"
                       )}>
                         {new Date(report.reportedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </span>
                    </div>


                    <div className="flex gap-3">
                       {!isCompact && report.image && (
                         <div className="relative h-14 w-14 rounded overflow-hidden flex-shrink-0 border bg-muted">
                            <Image src={report.image} alt="Preview" fill className="object-cover" unoptimized />
                         </div>
                       )}
                       <div className="flex-1 min-w-0">
                          <p className={cn(
                            "font-bold text-sm leading-tight text-balance mb-1",
                            isCompact ? "line-clamp-1" : "line-clamp-2"
                          )}>
                             {report.reason}
                          </p>
                          {!isCompact && (
                             <p className="text-xs text-muted-foreground line-clamp-2 italic">
                               "{report.content}"
                             </p>
                          )}
                       </div>
                    </div>
                 </div>
              </div>
              
              {/* Active Indicator */}
              {activeReportId === report.id && (
                <div className="absolute right-0 top-0 bottom-0 w-1 bg-primary" />
              )}
            </div>
          ))}

          {initialPendingReports.length === 0 && (
            <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl">
              <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-20" />
              <p className="text-lg font-medium opacity-50">Antrian Bersih!</p>
              <p className="text-sm opacity-40">Tidak ada laporan yang perlu ditangani saat ini.</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8 py-4 border-t">
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage <= 1}
                asChild={currentPage > 1}
              >
                {currentPage > 1 ? (
                  <Link href={`/mod?page=${currentPage - 1}`}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Prev
                  </Link>
                ) : (
                  <span><ChevronLeft className="h-4 w-4 mr-1" /> Prev</span>
                )}
              </Button>
              <span className="text-xs font-mono text-muted-foreground">{currentPage} / {totalPages}</span>
              <Button
                variant="ghost"
                size="sm"
                disabled={currentPage >= totalPages}
                asChild={currentPage < totalPages}
              >
                {currentPage < totalPages ? (
                  <Link href={`/mod?page=${currentPage + 1}`}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                ) : (
                  <span>Next <ChevronRight className="h-4 w-4 ml-1" /></span>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Action Panel (Split View) */}
        {activeReportId && activeReport && (
          <div className="sticky top-24 h-[calc(100vh-120px)] animate-in slide-in-from-right-4 duration-300">
             <Card className="h-full flex flex-col shadow-2xl border-primary/20">
                <CardHeader className="pb-3 border-b bg-muted/30">
                   <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                         Detail Laporan
                         <Badge variant="outline">#{activeReport.id}</Badge>
                      </CardTitle>
                      <Button variant="ghost" size="icon-sm" onClick={() => setActiveReportId(null)}>
                         <XCircle className="h-4 w-4" />
                      </Button>
                   </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto pt-6 space-y-6">
                   {/* Context & Content */}
                   <section>
                      <h4 className="text-[10px] uppercase font-black text-muted-foreground mb-3 flex items-center">
                        <MessageSquare className="h-3 w-3 mr-1" /> Konten Dilaporkan
                      </h4>
                      <div className="rounded-lg border bg-muted/20 p-4 space-y-4">
                         {activeReport.image && (
                           <div className="relative aspect-video w-full rounded-md overflow-hidden border shadow-sm group">
                              <Image src={activeReport.image} alt="Report context" fill className="object-contain bg-black/5" unoptimized />
                              <Link 
                                href={activeReport.image} 
                                target="_blank"
                                className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-bold"
                              >
                                Buka Gambar Penuh
                              </Link>
                           </div>
                         )}
                         <div className="prose prose-sm dark:prose-invert max-w-none">
                            <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">
                              {activeReport.content}
                            </p>
                         </div>
                         <div className="pt-2 flex items-center justify-between border-t border-muted-foreground/10 text-[10px] text-muted-foreground italic">
                            <span>Author: {activeReport.author}</span>
                            <span>ID Post: {activeReport.postNumber}</span>
                         </div>
                      </div>
                      <Link 
                        href={`/${activeReport.boardCode || 'all'}/thread/${activeReport.parentThreadId}#p${activeReport.postNumber}`}
                        target="_blank"
                        className="mt-2 text-[11px] text-primary hover:underline flex items-center justify-end"
                      >
                         <ExternalLink className="h-3 w-3 mr-1" /> Lihat di Thread Asli (Konteks Lengkap)
                      </Link>
                   </section>

                   {/* User Info */}
                   <section>
                      <h4 className="text-[10px] uppercase font-black text-muted-foreground mb-2 flex items-center">
                        <History className="h-3 w-3 mr-1" /> Metadata Pelaku
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                         <div className="bg-muted/50 p-2 rounded border border-muted-foreground/10">
                            <span className="block text-[9px] text-muted-foreground uppercase">IP Address</span>
                            <span className="text-xs font-mono font-bold">{activeReport.ipAddress || "Unknown"}</span>
                         </div>
                         <div className="bg-muted/50 p-2 rounded border border-muted-foreground/10">
                            <span className="block text-[9px] text-muted-foreground uppercase">Status Ban</span>
                            <Badge variant={activeReport.isBanned ? "destructive" : "secondary"} className="text-[10px] h-4 mt-0.5">
                              {activeReport.isBanned ? "Sedang Diblokir" : "Aktif"}
                            </Badge>
                         </div>
                      </div>
                   </section>

                   {/* Quick Actions Integration */}
                   <section className="pt-4 border-t sticky bottom-0 bg-card pb-4">
                      <h4 className="text-[10px] uppercase font-black text-muted-foreground mb-3 flex items-center">
                        <ShieldAlert className="h-3 w-3 mr-1" /> Kendali Moderasi
                      </h4>
                      <ModActions
                        reportId={activeReport.id}
                        contentType={activeReport.contentType}
                        contentId={activeReport.contentId}
                        ipAddress={activeReport.ipAddress}
                        isLocked={activeReport.isLocked}
                        isPinned={activeReport.isPinned}
                        isBanned={activeReport.isBanned}
                      />
                   </section>
                </CardContent>
             </Card>
          </div>
        )}
      </div>
    </div>
  );
}
