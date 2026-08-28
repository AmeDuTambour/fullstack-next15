import DeleteDialog from "@/components/shared/delete-dialog";
import Pagination from "@/components/shared/pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";
import { admin as t, common } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Utilisateurs",
};

const AdminUsersPage = async (props: {
  searchParams: Promise<{
    page: string;
    query: string;
  }>;
}) => {
  const { page = "1", query: searchText } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page), query: searchText });

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <h1 className="h2-bold">{t.usersTitle}</h1>
        {searchText && (
          <div>
            {t.filteredBy(searchText)}{" "}
            <Link href="/admin/users">
              <Button variant="outline" size="sm">
                {t.clearFilter}
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.reference}</TableHead>
              <TableHead>{common.name}</TableHead>
              <TableHead>{common.email}</TableHead>
              <TableHead>{common.role}</TableHead>
              <TableHead>{common.actions}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.data.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{formatId(user.id)}</TableCell>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  {user.role === "user" ? (
                    <Badge variant="secondary">{t.roleUser}</Badge>
                  ) : (
                    <Badge variant="default">{t.roleAdmin}</Badge>
                  )}
                </TableCell>
                <TableCell>
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/admin/users/${user.id}`}>{common.edit}</Link>
                  </Button>
                  <DeleteDialog id={user.id} action={deleteUser} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {users.totalPages > 1 ? (
          <Pagination page={Number(page) || 1} totalPages={users?.totalPages} />
        ) : null}
      </div>
    </div>
  );
};

export default AdminUsersPage;
