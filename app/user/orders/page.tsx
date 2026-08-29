import StatusBadge from "@/components/shared/status-badge";
import { CheckCircle2, Clock, PackageCheck } from "lucide-react";
import Pagination from "@/components/shared/pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getUserOrders } from "@/lib/actions/order.actions";
import { formatCurrency, formatDateTime, formatId } from "@/lib/utils";
import { Metadata } from "next";
import { account as t, common } from "@/lib/labels";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Mes commandes",
};

const OrdersPage = async (props: {
  searchParams: Promise<{ page: string }>;
}) => {
  const { page } = await props.searchParams;

  const orders = await getUserOrders({
    page: Number(page) || 1,
    limit: 2,
  });
  return (
    <div className="space-y-2">
      <h2 className="h2-bold">{t.ordersTitle}</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.orderReference}</TableHead>
              <TableHead>{t.orderedOn}</TableHead>
              <TableHead>{common.total}</TableHead>
              <TableHead>{t.paid}</TableHead>
              <TableHead>{t.delivered}</TableHead>
              <TableHead>{common.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{formatId(order.id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt).dateTime}
                </TableCell>
                <TableCell>{formatCurrency(order.totalPrice)}</TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt ? (
                    <StatusBadge
                      tone="done"
                      icon={<CheckCircle2 />}
                      label={formatDateTime(order.paidAt).dateTime}
                    />
                  ) : (
                    <StatusBadge tone="pending" icon={<Clock />} label={t.notPaidShort} />
                  )}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt ? (
                    <StatusBadge
                      tone="done"
                      icon={<PackageCheck />}
                      label={formatDateTime(order.deliveredAt).dateTime}
                    />
                  ) : (
                    <StatusBadge tone="pending" icon={<Clock />} label={t.notDeliveredShort} />
                  )}
                </TableCell>
                <TableCell>
                  <Link href={`/order/${order.id}`}>
                    <span className="px-2">{common.details}</span>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 ? (
          <Pagination
            page={Number(page) || 1}
            totalPages={orders?.totalPages}
          />
        ) : null}
      </div>
    </div>
  );
};

export default OrdersPage;
