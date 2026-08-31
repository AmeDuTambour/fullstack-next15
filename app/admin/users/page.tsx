import AdminList from "@/components/admin/admin-list";
import DeleteDialog from "@/components/shared/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { admin as t, common } from "@/lib/labels";
import { formatId } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Utilisateurs" };

const AdminUsersPage = async (props: {
  searchParams: Promise<{ page: string; query: string }>;
}) => {
  const { page = "1", query: searchText } = await props.searchParams;
  const users = await getAllUsers({ page: Number(page), query: searchText });

  return (
    <AdminList
      title={t.usersTitle}
      basePath="/admin/users"
      query={searchText}
      headers={[t.reference, common.name, common.email, common.role, common.actions]}
      page={Number(page) || 1}
      totalPages={users.totalPages}
      isEmpty={users.data.length === 0}
      emptyMessage={t.noUsers}
    >
      {users.data.map((user) => (
        <TableRow key={user.id}>
          <TableCell>{formatId(user.id)}</TableCell>
          <TableCell>{user.name}</TableCell>
          <TableCell>{user.email}</TableCell>
          <TableCell>
            <Badge variant={user.role === "user" ? "secondary" : "default"}>
              {user.role === "user" ? t.roleUser : t.roleAdmin}
            </Badge>
          </TableCell>
          <TableCell className="flex gap-1">
            <Button asChild variant="outline" size="sm">
              <Link href={`/admin/users/${user.id}`}>{common.edit}</Link>
            </Button>
            <DeleteDialog id={user.id} action={deleteUser} />
          </TableCell>
        </TableRow>
      ))}
    </AdminList>
  );
};

export default AdminUsersPage;
