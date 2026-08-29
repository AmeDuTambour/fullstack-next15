import { auth } from "@/auth";
import AdminList from "@/components/admin/admin-list";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteOrder, getAllOrders } from "@/lib/actions/order.actions";
import { admin as t, common } from "@/lib/labels";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Commandes" };

const AdminOrdersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = "1", query: searchText } = await props.searchParams;

  const session = await auth();
  if (session?.user?.role !== "admin") throw new Error("User is not authorized");

  const orders = await getAllOrders({ page: Number(page), query: searchText });

  return (
    <AdminList
      title={t.ordersTitle}
      basePath="/admin/orders"
      query={searchText}
      headers={[
        t.reference,
        common.date,
        t.buyer,
        common.total,
        t.paid,
        t.delivered,
        common.actions,
      ]}
      page={Number(page) || 1}
      totalPages={orders.totalPages}
      isEmpty={orders.data.length === 0}
      emptyMessage={t.noOrders}
    >
      {orders.data.map((order) => (
        <TableRow key={order.id}>
          <TableCell>{formatId(order.id)}</TableCell>
          <TableCell>{formatDateTime(order.createdAt).dateTime}</TableCell>
          <TableCell>{order.user.name}</TableCell>
          <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
          <TableCell>
            {order.isPaid && order.paidAt
              ? formatDateTime(order.paidAt).dateTime
              : t.notPaid}
          </TableCell>
          <TableCell>
            {order.isDelivered && order.deliveredAt
              ? formatDateTime(order.deliveredAt).dateTime
              : t.notDelivered}
          </TableCell>
          <TableCell className="flex gap-1">
            <Button asChild variant="outline" size="sm">
              <Link href={`/order/${order.id}`}>{common.details}</Link>
            </Button>
            <DeleteDialog id={order.id} action={deleteOrder} />
          </TableCell>
        </TableRow>
      ))}
    </AdminList>
  );
};

export default AdminOrdersPage;
