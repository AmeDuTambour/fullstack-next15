"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Input } from "../ui/input";

const AdminSearch = () => {
  const searchParams = useSearchParams();
  const pathName = usePathname();
  const [queryValue, setQueryValue] = useState(searchParams.get("query") || "");

  const formActionUrl = pathName.includes("/admin/orders")
    ? "/admin/orders"
    : pathName.includes("/admin/users")
      ? "/admin/users"
      : "/admin/products";

  useEffect(() => {
    setQueryValue(searchParams.get("query") || "");
  }, [searchParams]);

  return (
    <form action={formActionUrl}>
      <Input
        type="search"
        placeholder="Search..."
        name="query"
        value={queryValue}
        onChange={(e) => setQueryValue(e.target.value)}
        className="md:w-[100px] lg:w-[300px]"
      />
      <button className="sr-only" type="submit">
        Search
      </button>
    </form>
  );
};

export default AdminSearch;
