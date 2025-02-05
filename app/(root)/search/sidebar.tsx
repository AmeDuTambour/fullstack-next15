import Link from "next/link";

const Sidebar = ({
  category,
  skin,
  dimension,
  getFilterUrl,
  categories,
  skinTypes,
  dimensions,
}) => {
  return (
    <div className="filter-links">
      <div className="text-xl mb-4 mt-3">Catégories</div>
      <ul className="space-y-1">
        <li>
          <Link
            className={`${(category === "all" || category === "") && "font-bold"}`}
            href={getFilterUrl({ c: "all" })}
          >
            Tous
          </Link>
        </li>
        {categories.map((cat) => (
          <li key={cat.name}>
            <Link
              href={getFilterUrl({ c: cat.name })}
              className={`${category === cat.name && "font-bold"}`}
            >
              {cat.name === "Drum" ? "Tambours" : "Autre"}
            </Link>
          </li>
        ))}
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
                  href={getFilterUrl({ d: `${dim.size}` })}
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
  );
};

export default Sidebar;
