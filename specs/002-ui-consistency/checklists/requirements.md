# Specification Quality Checklist: Cohérence de l'interface et du parcours d'achat

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-08-28
**Feature**: [spec.md](../spec.md)

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
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

C'est la spécification la plus large des cinq : dix-huit exigences, cinq histoires. Elle a été
maintenue d'un seul tenant parce que ses parties partagent la même cause — aucun langage de
composants commun — et que les traiter séparément produirait trois fois le même arbitrage.

Les cinq histoires sont néanmoins livrables indépendamment, dans l'ordre de priorité indiqué.
Si le périmètre doit être réduit, les stories 1 et 2 suffisent à répondre à la demande
initiale du propriétaire.

**Correction de fond après retour du propriétaire, le 2026-08-28.** La première rédaction
parlait d'un délai de fabrication, en reprenant une question de l'audit qui supposait une
fabrication à la commande. C'est faux : les tambours vendus sont **déjà fabriqués et existent
en un seul exemplaire**. Seul le délai d'expédition est à annoncer.

Cette correction a ouvert un sujet bien plus important qu'un renommage, devenu la story 2 :
l'interface traite chaque tambour comme une référence de catalogue reproductible. Le panier
propose d'augmenter la quantité, la fiche annonce « En stock », et un tambour vendu s'affiche
« Stock épuisé » — formule qui promet un réassort qui n'arrivera jamais. FR-003b et SC-009
rendent la règle vérifiable.

**Question tranchée par le propriétaire le 2026-08-28 : les accessoires existent bien en
plusieurs exemplaires.** La nature du produit est donc portée par sa catégorie — tambour, pièce
unique ; accessoire, article reproductible — et non par une propriété saisie produit par
produit. FR-003b, FR-003c et FR-003d couvrent les deux cas, y compris la contrainte que
l'administration ne puisse pas saisir deux exemplaires d'un tambour.

**Point de vigilance pour le plan.** Lier une règle métier à une catégorie suppose que les
catégories soient stables. Le catalogue n'en compte que deux aujourd'hui ; une troisième devra
déclarer sa nature, faute de quoi elle héritera d'un comportement arbitraire.

**Collision assumée avec la spécification 004.** Cette spécification déplace et fusionne des
composants que la 004 doit ensuite reteinter. L'ordre 002 puis 004 est délibéré et documenté
dans les hypothèses des deux.
