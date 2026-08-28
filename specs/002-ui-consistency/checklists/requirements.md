# Specification Quality Checklist: Cohérence de l'interface et du parcours d'achat

**Created**: 2026-08-28 · **Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

**Deux valeurs manquent et ne peuvent pas être inventées** : le délai d'expédition réel, et
l'explication du jargon métier — ce que change une peau de bison, ce que signifie `45x7`. Le
plan prévoit leur emplacement ; leur contenu doit venir de l'artisan. Sans eux, FR-003 et
FR-016 sont structurellement livrés mais matériellement vides.

**Point de vigilance du plan.** La nature d'un produit est liée à sa catégorie. Une catégorie
renommée, ou une troisième ajoutée, hérite du comportement de repli — « article reproductible ».
C'est le choix le moins destructeur, puisqu'il n'interdit rien et ne promet aucune rareté, mais
il est silencieux : rien ne signalera qu'une nouvelle catégorie de pièces uniques est traitée
comme du stock courant.

**Tension avec l'article IV de la constitution**, résolue en conception. Plusieurs exigences
sont visuelles et ne se testent pas unitairement. Trois règles sont isolées en fonctions pures
— format de prix, nature, disponibilité — et testées ; le reste passe par le guide de
validation, dont la section 7 couvre le défaut qu'une revue statique avait manqué et qu'une
mesure au navigateur avait révélé.
