import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  LEGAL_PAGES,
  getLegalPage,
  isLegalPageWritten,
} from "@/lib/content/legal";
import { legal as t } from "@/lib/labels";
import { formatDateTime } from "@/lib/utils";

export function generateStaticParams() {
  return LEGAL_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const page = getLegalPage(slug);
  if (!page) return {};

  return {
    title: page.title,
    description: page.description,
    // Une page dont le texte n'est pas écrit n'a rien à faire dans un index.
    robots: isLegalPageWritten(page) ? undefined : { index: false },
  };
}

const LegalPage = async (props: { params: Promise<{ slug: string }> }) => {
  const { slug } = await props.params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <article className="mx-auto max-w-[68ch] space-y-6 py-8">
      <header className="space-y-2">
        <h1 className="page-title">{page.title}</h1>
        {page.updatedAt ? (
          <p className="text-sm text-muted-foreground">
            {t.updatedAt(formatDateTime(new Date(page.updatedAt)).dateOnly)}
          </p>
        ) : null}
      </header>

      {isLegalPageWritten(page) ? (
        page.sections.map((section) => (
          <section key={section.heading} className="space-y-2">
            <h2 className="section-title">{section.heading}</h2>
            <p className="whitespace-pre-line leading-relaxed">
              {section.body}
            </p>
          </section>
        ))
      ) : (
        /* Dire que le texte manque vaut mieux qu'un cadre vide : le visiteur
           sait à quoi s'en tenir, et peut demander l'information. */
        <p className="rounded-lg border bg-muted p-4 leading-relaxed">
          {t.notWrittenYet}
        </p>
      )}
    </article>
  );
};

export default LegalPage;
