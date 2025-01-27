import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllProducts,
  getAllCategories,
} from "@/lib/actions/product.actions";
import Link from "next/link";

const prices = [
  {
    name: "€1 to €50",
    value: "1-50",
  },
  {
    name: "€51 to €100",
    value: "51-100",
  },
  {
    name: "€101 to €200",
    value: "101-200",
  },
  {
    name: "€201 to €500",
    value: "201-500",
  },
  {
    name: "€501 to €1000",
    value: "501-1000",
  },
];

const ratings = [4, 3, 2, 1];

const sortOrders = ["newest", "lowest", "highest", "rating"];

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
    q?: string;
    category?: string;
    price?: string;
    rating?: string;
    sort?: string;
    page?: string;
  }>;
}) => {
  const {
    q = "all",
    category = "all",
    price = "all",
    rating = "all",
    sort = "newest",
    page = "1",
  } = await props.searchParams;

  const getFilterUrl = ({
    c,
    p,
    r,
    s,
    pg,
  }: {
    c?: string;
    p?: string;
    r?: string;
    s?: string;
    pg?: string;
  }) => {
    const params = { q, category, price, rating, sort, page };
    if (c) params.category = c;
    if (p) params.price = p;
    if (r) params.rating = r;
    if (s) params.sort = s;
    if (pg) params.page = pg;

    return `/search?${new URLSearchParams(params).toString()}`;
  };

  const products = await getAllProducts({
    query: q,
    category,
    price,
    rating,
    sort,
    page: Number(page),
  });

  const categories = await getAllCategories();

  return (
    <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links">
        <div className="text-xl mb-2 mt-3">Categorie</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${
                  (category === "all" || category === "") && "font-bold"
                }`}
                href={getFilterUrl({ c: "all" })}
              >
                Tous
              </Link>
            </li>
            {categories.map((el) => (
              <li key={el.category}>
                <Link
                  href={getFilterUrl({ c: el.category })}
                  className={`${category === el.category && "font-bold"}`}
                >
                  {el.category}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-8">Prix</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ p: "all" })}
              >
                Tous
              </Link>
            </li>
            {prices.map((el) => (
              <li key={el.value}>
                <Link
                  href={getFilterUrl({ p: el.value })}
                  className={`${price === el.value && "font-bold"}`}
                >
                  {el.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="text-xl mb-2 mt-8">Avis clients</div>
        <div>
          <ul className="space-y-1">
            <li>
              <Link
                className={`${price === "all" && "font-bold"}`}
                href={getFilterUrl({ r: "all" })}
              >
                Tous
              </Link>
            </li>
            {ratings.map((el) => (
              <li key={el}>
                <Link
                  href={getFilterUrl({ r: `${el}` })}
                  className={`${rating === el.toString() && "font-bold"}`}
                >
                  {`${el} étoiles & plus`}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="md:col-span-4 space-y-4">
        <div className="flex-between flex-col md:flex-row my-4">
          <div className="flex items-center">
            {q !== "all" && q !== "" && "Query: " + q}
            {category !== "all" && category !== "" && " Category: " + category}
            {price !== "all" && " Prix: " + price}
            {rating !== "all" && " Note: " + rating + " étoiles & plus"}
            &nbsp;
            {(q !== "all" && q !== "") ||
            (category !== "all" && category !== "") ||
            rating !== "all" ||
            price !== "all" ? (
              <Button variant="link" asChild>
                <Link href="/search">Effacer</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Trier par{" "}
            {sortOrders.map((el) => (
              <Link
                key={el}
                className={`mx-2 ${sort == el && "font-bold"}`}
                href={getFilterUrl({ s: el })}
              >
                {el}
              </Link>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {products.data.length === 0 ? <div>Aucun produit</div> : null}
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
