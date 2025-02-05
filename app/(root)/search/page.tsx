import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllProducts,
  getAllSkinTypes,
  getAllDrumDimensions,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const sortOrders = [
  { query: "newest", label: "Récent" },
  { query: "lowest", label: "Prix + bas" },
  { query: "highest", label: "Prix + haut" },
];

export async function generateMetadata(props: {
  searchParams: Promise<{
    q: string;
    category: string;
    price: string;
    rating: string;
  }>;
}) {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
  } = await props.searchParams;

  const isQuerySet = q && q !== "all" && q.trim() !== "";
  const isCategorySet =
    category && category !== "all" && category.trim() !== "";
  const isPriceSet = price && price !== "all" && price.trim() !== "";
  const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

  if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
    return {
      title: `
        Search ${isQuerySet ? q : ""}
        ${isCategorySet ? `: Category ${category}` : ""}
        ${isPriceSet ? `: Price ${price}` : ""}
        ${isRatingSet ? `: Rating ${rating}` : ""}
      `,
    };
  } else {
    return {
      title: "Search Products",
    };
  }
}

const SearchPage = async (props: {
  searchParams: Promise<{
    category?: string;
    skin?: string;
    dimension?: string;
    sort?: "newest" | "highest" | "lowest";
    page?: string;
  }>;
}) => {
  const {
    category = "all",
    skin = "all",
    dimension = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const getFilterUrl = ({
    c,
    sk,
    d,
    s,
    pg,
  }: {
    c?: string;
    sk?: string;
    d?: string;
    s?: string;
    pg?: string;
  }) => {
    const params = { category, skin, dimension, sort, page };

    if (c) {
      params.category = c;
      params.page = "1";
      if (c === "all") {
        params.skin = "all";
        params.dimension = "all";
      }
    }
    if (sk) {
      params.skin = sk;
      params.page = "1";
    }
    if (d) {
      params.dimension = d;
      params.page = "1";
    }
    if (s) {
      params.sort = s;
      params.page = "1";
    }
    if (pg) {
      params.page = pg;
    }

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    category,
    skinType: skin,
    dimensions: dimension,
    sort,
    page: Number(page),
  });

  const skinTypes = await getAllSkinTypes();
  const dimensions = await getAllDrumDimensions();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className="text-xl mb-4 mt-3">Catégories</div>
        <ul className="space-y-1">
          <li>
            <Link
              className={`${category === "all" && "font-bold"}`}
              href={getFilterUrl({ c: "all" })}
            >
              Tous
            </Link>
          </li>
          <li>
            <Link
              className={`${category === "Drum" && "font-bold"}`}
              href={getFilterUrl({ c: "Drum" })}
            >
              Tambours
            </Link>
          </li>
          <li>
            <Link
              className={`${category === "Other" && "font-bold"}`}
              href={getFilterUrl({ c: "Other" })}
            >
              Autre
            </Link>
          </li>
        </ul>

        {category === "Drum" && (
          <>
            <div className="text-xl mb-2 mt-8">Type de peau</div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${skin === "all" && "font-bold"}`}
                  href={getFilterUrl({ sk: "all" })}
                >
                  Tous
                </Link>
              </li>
              {skinTypes.map((sk) => (
                <li key={sk.id}>
                  <Link
                    href={getFilterUrl({ sk: sk.material })}
                    className={`${skin === sk.material && "font-bold"}`}
                  >
                    {sk.material}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="text-xl mb-2 mt-8">Dimensions</div>
            <ul className="space-y-1">
              <li>
                <Link
                  className={`${dimension === "all" && "font-bold"}`}
                  href={getFilterUrl({ d: "all" })}
                >
                  Tous
                </Link>
              </li>
              {dimensions.map((dim) => (
                <li key={dim.id}>
                  <Link
                    href={getFilterUrl({ d: dim.size })}
                    className={`${dimension === dim.size && "font-bold"}`}
                  >
                    {dim.size}
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center space-x-4">
            <div>
              {products.data.length > 0
                ? `${products.totalCount} produit${products.totalCount > 1 ? "s" : ""} trouvé${products.totalCount > 1 ? "s" : ""}`
                : "Aucun produit trouvé"}
            </div>

            {(category !== "all" && category !== "") ||
            dimension !== "all" ||
            skin !== "all" ? (
              <Button variant="link" asChild>
                <Link href="/search">Effacer</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Trier par{" "}
            {sortOrders
              .filter((el) => category !== "Other" || el.query === "newest")
              .map((el) => (
                <Link
                  key={el.query}
                  className={`mx-2 ${sort === el.query && "font-bold"}`}
                  href={getFilterUrl({ s: el.query })}
                >
                  {el.label}
                </Link>
              ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 ? (
            <div>Aucun produit</div>
          ) : (
            products.data.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
        <div className="w-full flex justify-end">
          {products.totalPages > 1 ? (
            <Pagination
              page={Number(page) || 1}
              totalPages={products?.totalPages}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
