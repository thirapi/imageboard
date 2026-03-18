import { Plus, Settings, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
import { deleteCategory, getAllCategories } from "@/lib/actions/category.actions";
import { CategoryFormDialog } from "@/components/mod/category-form-dialog";
import { CategoryDeleteButton } from "@/components/mod/category-delete-button";
import { CategoryReorderButtons } from "@/components/mod/category-reorder-buttons";

export default async function CategoriesPage() {
  const categories = await getAllCategories();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Manajemen Kategori</h1>
          <p className="text-muted-foreground">
            Kelola pengelompokan board.
          </p>
        </div>
        <CategoryFormDialog mode="create">
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Kategori Baru
          </Button>
        </CategoryFormDialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori</CardTitle>
          <CardDescription>
            Menampilkan {categories.length} kategori yang terdaftar.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Urutan Tampilan</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((cat, index) => (
                <TableRow key={cat.id}>
                  <TableCell className="font-bold">{cat.name}</TableCell>
                  <TableCell>{cat.displayOrder}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <CategoryReorderButtons 
                      categoryId={cat.id} 
                      isFirst={index === 0} 
                      isLast={index === categories.length - 1} 
                    />
                    <CategoryFormDialog mode="edit" initialCategory={cat}>
                      <Button variant="ghost" size="icon">
                        <Settings className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                    </CategoryFormDialog>
                    <CategoryDeleteButton categoryId={cat.id} categoryName={cat.name} />
                  </TableCell>
                </TableRow>
              ))}
              {categories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                    Belum ada kategori yang terdaftar.
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
