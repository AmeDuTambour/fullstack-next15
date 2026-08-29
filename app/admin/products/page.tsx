import AdminList from "@/components/admin/admin-list";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import {
  deleteProduct,
  getAllProductCategories,
  getAllProducts,
} from "@/lib/actions/product.actions";
import { admin as t, common } from "@/lib/labels";
import { formatCurrency, formatId, getProductCategory } from "@/lib/utils";
import StatusBadge from "@/components/shared/status-badge";
import { Eye, EyeClosed } from "lucide-react";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Produits" };

const AdminProductsPage = async (props: {
  searchParams: Promise<{ page?: string; query?: string; category?: string }>;
}) => {
  const { page = "1", query = "", category = "" } = await props.searchParams;

  const categories = await getAllProductCategories();
  const products = await getAllProducts({
    query,
    page: Number(page),
    category,
  });

  return (
    <AdminList
      title={t.productsTitle}
      basePath="/admin/products"
      query={query}
      action={
        <Button asChild>
          <Link href="/admin/products/editor/new/base-product">
            {t.createProduct}
          </Link>
        </Button>
      }
      headers={[
        t.reference,
        common.name,
        common.price,
        t.category,
        t.stock,
        t.published,
        common.actions,
      ]}
      page={Number(page) || 1}
      totalPages={products.totalPages}
      isEmpty={products.data.length === 0}
      emptyMessage={t.noProducts}
    >
      {products.data.map((product) => {
        const productCategory = getProductCategory(
          product.categoryId,
          categories
        );

        return (
          <TableRow key={product.id}>
            <TableCell>{formatId(product.id)}</TableCell>
            <TableCell>{product.name}</TableCell>
            <TableCell>{formatCurrency(product.price)}</TableCell>
            <TableCell>{productCategory?.name}</TableCell>
            <TableCell>{product.stock}</TableCell>
            <TableCell>
              <StatusBadge
                tone={product.isPublished ? "done" : "muted"}
                icon={product.isPublished ? <Eye /> : <EyeClosed />}
                label={product.isPublished ? t.published : t.draft}
              />
            </TableCell>
            <TableCell className="flex gap-1">
              <Button asChild size="sm" variant="outline">
                <Link
                  href={`/admin/products/editor/${product.id}/base-product`}
                >
                  {common.edit}
                </Link>
              </Button>
              <DeleteDialog id={product.id} action={deleteProduct} />
            </TableCell>
          </TableRow>
        );
      })}
    </AdminList>
  );
};

export default AdminProductsPage;
