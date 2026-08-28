# Specification Quality Checklist: Suivi de colis

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

**Première spécification qui ne vient pas de l'audit.** Les cinq précédentes corrigent des
défauts constatés ; celle-ci ajoute une capacité qui n'a jamais existé. C'est aussi la première
qui **modifie le schéma de données** depuis la reprise du projet.

**Frontière posée explicitement.** Le suivi est déclaratif : le site stocke un numéro et
construit un lien, il n'interroge aucun transporteur et n'affiche aucun état d'acheminement.
Interroger les transporteurs supposerait un contrat par transporteur, des identifiants, et une
gestion de panne — un ordre de grandeur au-dessus, pour un bénéfice marginal quand le lien
suffit.

**Information manquante, à obtenir de l'artisan** : quels transporteurs il utilise réellement.
La liste est une donnée de configuration ; sans elle, la fonctionnalité est structurellement
livrable mais matériellement vide, exactement comme le délai d'expédition de la spécification
002 et les textes d'articles.

**Contrainte de séquencement.** À exécuter après la 002, dont elle réutilise l'indicateur
d'état et le vocabulaire de la commande. La construire avant obligerait à refaire la même
décision deux fois.

**Point de vigilance pour le plan.** FR-011 prévoit de prévenir l'acheteuse. Le mécanisme
d'e-mail existe mais n'a jamais été éprouvé en conditions réelles : aucune clé d'envoi n'est
renseignée dans l'environnement de développement, et l'accusé de commande n'a donc jamais été
vu par personne.
