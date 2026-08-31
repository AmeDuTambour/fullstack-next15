import Link from "next/link";

import ContentImage from "@/components/ui/content-image";
import { formatDateTime } from "@/lib/utils";

/**
 * Carte d'article, telle qu'elle apparaît dans les carrousels du journal.
 *
 * Le visuel passait par une image de fond CSS : pas de chargement différé, pas
 * de redimensionnement selon l'écran, pas de repli quand la vignette manque —
 * le dégradé se posait alors sur du vide. `ContentImage` apporte les trois, et
 * son ossature d'attente avec.
 *
 * La date est affichée parce que l'ordre du carrousel la porte : les articles
 * vont du plus récent au plus ancien, autant que ça se voie.
 */
type ArticleCardProps = {
  title: string;
  slug: string;
  thumbnail?: string | null;
  createdAt: Date | string;
};

const ArticleCard = ({
  title,
  slug,
  thumbnail,
  createdAt,
}: ArticleCardProps) => (
  <Link href={`/blog/${slug}`} className="group block">
    <div className="relative h-48 w-full overflow-hidden rounded-lg shadow-sm">
      <ContentImage
        src={thumbnail}
        alt=""
        width={600}
        height={400}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 80vw"
        className="h-48 w-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      {/* Le dégradé rend le titre lisible quelle que soit la photo. Il est
          au-dessus de l'image, sous le texte. */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/30 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 space-y-1 p-3">
        {/* Pas `section-title` : c'est la taille du titre de catégorie
            au-dessus, et les deux niveaux devenaient indiscernables. */}
        <h3 className="line-clamp-2 text-base font-semibold leading-snug text-background">
          {title}
        </h3>
        <p className="text-xs text-background/80">
          {formatDateTime(new Date(createdAt)).dateOnly}
        </p>
      </div>
    </div>
  </Link>
);

export default ArticleCard;
