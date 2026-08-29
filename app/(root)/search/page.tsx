import Pagination from "@/components/shared/pagination";
import ProductCard from "@/components/shared/product/product-card";
import { Button } from "@/components/ui/button";
import {
  getAllProducts,
  getAllSkinTypes,
  getAllDrumDimensions,
} from "@/lib/actions/product.actions";
import Link from "next/link";
import EmptyState from "@/components/shared/empty-state";
import { catalog as t } from "@/lib/labels";

const sortOrders = [
  { query: "newest", label: "Récent" },
  { query: "lowest", label: "Prix + bas" },
  { query: "highest", label: "Prix + haut" },
];

/**
 * Titre de la page boutique.
 *
 * L'ancienne version construisait « Search : Category Drum » et s'appuyait sur
 * des paramètres `price` et `rating` que la boutique n'expose pas — ils ne
 * pouvaient donc jamais apparaître.
 */
export async function generateMetadata(props: {
  searchParams: Promise<{
    category?: string;
    skin?: string;
    dimension?: string;
  }>;
}) {
  const { category = "all", skin = "all", dimension = "all" } =
    await props.searchParams;

  const precisions = [
    category !== "all" && category !== ""
      ? category === "Drum"
        ? "Tambours"
        : "Accessoires"
      : null,
    skin !== "all" ? `peau de ${skin.toLowerCase()}` : null,
    dimension !== "all" ? dimension : null,
  ].filter(Boolean);

  return {
    title: precisions.length
      ? `Boutique — ${precisions.join(", ")}`
      : "Boutique",
  };
}

const SearchPage = async (props: {
  searchParams: Promise<{
    category?: string;
    skin?: string;
    dimension?: string;
    sort?: string;
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

      if (c === "all" || c !== "Drum") {
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
    publishedOnly: true,
    sort,
    page: Number(page),
  });

  const skinTypes = await getAllSkinTypes();
  const dimensions = await getAllDrumDimensions();

  return (
    <div className="space-y-6">
      <h1 className="page-title">{t.shopTitle}</h1>

      <div className="grid md:grid-cols-5 md:gap-5">
      <div className="filter-links hidden md:block">
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

      <div className="md:hidden mb-8">
        <ul className="space-x-4 flex flex-row mb-2">
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
            <ul className="space-x-4 flex flex-row mb-2">
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

            <ul className="space-x-4 flex flex-row">
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
            <div className="text-muted-foreground">
              {products.data.length > 0 ? t.productCount(products.totalCount) : null}
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

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {products.data.length === 0 ? (
          <EmptyState
            message={t.noProducts}
            action={{ label: t.clearFilters, href: "/search" }}
          />
        ) : null}
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
    </div>
  );
};

export default SearchPage;
