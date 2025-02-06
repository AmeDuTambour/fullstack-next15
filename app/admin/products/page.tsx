import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteProduct, getAllProducts } from "@/lib/actions/product.actions";
import { formatId } from "@/lib/utils";
import Link from "next/link";

type AdminProductsPageProps = {
  page?: string;
  query?: string;
  category?: string;
};

const AdminProductsPage = async (props: {
  searchParams: Promise<AdminProductsPageProps>;
}) => {
  const { page = "1", query = "", category = "" } = await props.searchParams;

  const products = await getAllProducts({
    query,
    page: Number(page),
    category,
  });

  return (
    <div className="space-y-2">
      <div className="flex-between">
        <div className="flex items-center gap-3">
          <h1 className="h2-bold">Products</h1>
          {query && (
            <div>
              Filtered by <i>&quot;{query}&quot;</i>{" "}
              <Link href="/admin/products">
                <Button variant="outline" size="sm">
                  Remove filter
                </Button>
              </Link>
            </div>
          )}
        </div>
        <Button asChild variant="default">
          <Link href="/admin/products/editor/new/base-product">
            Create Product
          </Link>
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>NAME</TableHead>
            <TableHead className="text-right">PRICE</TableHead>
            <TableHead>CATEGORY</TableHead>
            <TableHead>STOCK</TableHead>
            <TableHead>ACTIONS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.data.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{formatId(product.id)}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell className="text-right">
                {product.price.toFixed(2)} €
              </TableCell>
              <TableCell>{product.category?.name || "N/A"}</TableCell>
              <TableCell>{product.stock}</TableCell>
              <TableCell className="flex gap-1">
                <Button asChild size="sm" variant="outline">
                  <Link
                    href={`/admin/products/editor/${product.id}/base-product`}
                  >
                    Edit
                  </Link>
                </Button>
                <DeleteDialog id={product.id} action={deleteProduct} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {products.totalPages > 1 && (
        <Pagination page={Number(page)} totalPages={products.totalPages} />
      )}
    </div>
  );
};

export default AdminProductsPage;
