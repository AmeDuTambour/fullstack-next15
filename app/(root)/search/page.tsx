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
  /**
   * Les vingt filtres étaient des liens sans soulignement, sans cadre et sans
   * état de survol : rien n'indiquait qu'ils étaient cliquables, et seule la
   * graisse du texte signalait l'actif.
   */
  const FilterLink = ({
    href,
    active,
    children,
  }: {
    href: string;
    active: boolean;
    children: React.ReactNode;
  }) => (
    <Link
      href={href}
      aria-current={active ? "true" : undefined}
      className={
        active
          ? "inline-flex rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
          : "inline-flex rounded-full border px-3 py-1 text-sm text-muted-foreground transition-colors hover:border-foreground hover:text-foreground"
      }
    >
      {children}
    </Link>
  );

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
        <h2 className="section-title mb-3">{t.categories}</h2>
        <ul className="flex flex-col items-start gap-2">
          <li>
            <FilterLink active={category === "all"} href={getFilterUrl({ c: "all" })}>{t.allFilter}</FilterLink>
          </li>
          <li>
            <FilterLink active={category === "Drum"} href={getFilterUrl({ c: "Drum" })}>{t.drums}</FilterLink>
          </li>
          <li>
            <FilterLink active={category === "Other"} href={getFilterUrl({ c: "Other" })}>{t.accessories}</FilterLink>
          </li>
        </ul>

        {category === "Drum" && (
          <>
            <h2 className="section-title mb-3 mt-8">{t.skinType}</h2>
            <ul className="flex flex-col items-start gap-2">
              <li>
                <FilterLink active={skin === "all"} href={getFilterUrl({ sk: "all" })}>{t.allFilter}</FilterLink>
              </li>
              {skinTypes.map((sk) => (
                <li key={sk.id}>
                  <FilterLink active={skin === sk.material} href={getFilterUrl({ sk: sk.material })}>{sk.material}</FilterLink>
                </li>
              ))}
            </ul>

            <h2 className="section-title mb-3 mt-8">{t.dimensions}</h2>
            <ul className="flex flex-col items-start gap-2">
              <li>
                <FilterLink active={dimension === "all"} href={getFilterUrl({ d: "all" })}>{t.allFilter}</FilterLink>
              </li>
              {dimensions.map((dim) => (
                <li key={dim.id}>
                  <FilterLink active={dimension === dim.size} href={getFilterUrl({ d: dim.size })}>{dim.size}</FilterLink>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <div className="md:hidden mb-8">
        <ul className="mb-2 flex flex-row flex-wrap gap-2">
          <li>
            <FilterLink active={category === "all"} href={getFilterUrl({ c: "all" })}>{t.allFilter}</FilterLink>
          </li>
          <li>
            <FilterLink active={category === "Drum"} href={getFilterUrl({ c: "Drum" })}>{t.drums}</FilterLink>
          </li>
          <li>
            <FilterLink active={category === "Other"} href={getFilterUrl({ c: "Other" })}>{t.accessories}</FilterLink>
          </li>
        </ul>
        {category === "Drum" && (
          <>
            <ul className="mb-2 flex flex-row flex-wrap gap-2">
              <li>
                <FilterLink active={skin === "all"} href={getFilterUrl({ sk: "all" })}>{t.allFilter}</FilterLink>
              </li>
              {skinTypes.map((sk) => (
                <li key={sk.id}>
                  <FilterLink active={skin === sk.material} href={getFilterUrl({ sk: sk.material })}>{sk.material}</FilterLink>
                </li>
              ))}
            </ul>

            <ul className="flex flex-row flex-wrap gap-2">
              <li>
                <FilterLink active={dimension === "all"} href={getFilterUrl({ d: "all" })}>{t.allFilter}</FilterLink>
              </li>
              {dimensions.map((dim) => (
                <li key={dim.id}>
                  <FilterLink active={dimension === dim.size} href={getFilterUrl({ d: dim.size })}>{dim.size}</FilterLink>
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
                <Link href="/search">{t.clearFilters}</Link>
              </Button>
            ) : null}
          </div>
          <div>
            Trier par{" "}
            {sortOrders
              .filter((el) => category !== "Other" || el.query === "newest")
              .map((el) => (
                <FilterLink
                  key={el.query}
                  active={sort === el.query}
                  href={getFilterUrl({ s: el.query })}
                >
                  {el.label}
                </FilterLink>
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
