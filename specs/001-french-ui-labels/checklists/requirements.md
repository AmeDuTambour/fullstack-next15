# Specification Quality Checklist: Interface entièrement en français

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

Deux itérations de validation ont été nécessaires.

**Première passe — trois échecs, tous corrigés :**

1. *No implementation details* — la rédaction initiale nommait des fichiers
   (`order-details-table.tsx`, `lib/utils.ts:formatError`) et un mécanisme existant
   (`PAYMENT_METHOD_LABELS`). Ces éléments viennent du rapport d'audit et sont utiles au
   plan, pas à la spécification. Ils ont été remplacés par la description du comportement
   observable. Les chemins précis restent disponibles dans
   `.impeccable/critique/2026-08-28T17-12-55Z__app.md`.

2. *Success criteria are technology-agnostic* — un critère mentionnait un attribut HTML
   nommé. Reformulé en résultat observable : « un lecteur d'écran annonce le contenu en
   français ».

3. *Scope is clearly bounded* — l'exclusion des routes et du code était affirmée sans
   contrepartie testable. FR-008 la rend vérifiable, et l'entité « Clé technique » nomme ce
   qui ne doit jamais être traduit.

**Point de vigilance pour le plan, non bloquant ici.** L'hypothèse d'une langue unique est
explicite et assumée. Si le propriétaire envisageait un jour une seconde langue, ce n'est pas
la spécification qui changerait mais le plan : le référentiel central est compatible avec
cette évolution sans la préparer.

**Périmètre volontairement laissé ouvert.** L'inventaire des trois surfaces vient de l'audit
et est réputé exhaustif, sans garantie. Toute occurrence supplémentaire découverte pendant la
mise en œuvre entre dans le périmètre sans nouvelle spécification.
