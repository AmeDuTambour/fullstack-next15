# Feature Specification: Suivi de colis

**Feature Branch**: `refacto/foundation`

**Created**: 2026-08-28

**Status**: Draft

**Input**: Demande du propriétaire le 2026-08-28, formulée en marge de la spécification 002 :
« ce serait super de pouvoir renseigner le numéro de tracking avec le lien vers le site du
transporteur pour le suivi de colis ».

## Contexte

Aujourd'hui, marquer une commande comme expédiée est un simple basculement : l'artisan clique,
la commande passe à « expédiée », et l'acheteur voit une date. Rien ne lui dit où est son colis.
Pour un objet unique à 290 € expédié par un artisan seul, l'attente entre le paiement et la
réception est le moment le plus silencieux du parcours — et celui qui génère le plus de
sollicitations directes.

C'est une fonctionnalité nouvelle, distincte des cinq spécifications issues de l'audit. Elle
n'y figure pas parce qu'elle ne corrige aucun défaut existant : elle en ajoute une capacité.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Marie suit son colis sans écrire à l'atelier (Priority: P1)

Marie a payé son tambour et reçoit un e-mail lui disant qu'il est parti. Elle ouvre sa commande
sur le site : elle y voit la date d'expédition et rien d'autre. Pour savoir où en est le colis,
elle doit écrire à l'atelier — ou attendre.

Après ce travail, sa page de commande porte le numéro de suivi et un lien qui l'emmène
directement sur le suivi du transporteur.

**Why this priority**: C'est le motif de sollicitation le plus prévisible de tout le parcours,
et le seul que l'acheteuse peut résoudre elle-même si on le lui permet.

**Independent Test**: Renseigner un numéro de suivi sur une commande, puis consulter cette
commande en tant qu'acheteuse.

**Acceptance Scenarios**:

1. **Given** une commande expédiée avec un numéro de suivi, **When** l'acheteuse consulte sa
   commande, **Then** le numéro lui est affiché avec un lien vers le suivi du transporteur.
2. **Given** une commande expédiée sans numéro de suivi, **When** l'acheteuse la consulte,
   **Then** la date d'expédition est affichée sans zone de suivi vide ni lien mort.
3. **Given** une commande non expédiée, **When** l'acheteuse la consulte, **Then** aucune
   information de suivi n'apparaît.
4. **Given** un numéro de suivi affiché, **When** l'acheteuse veut le communiquer par téléphone,
   **Then** il est lisible et copiable en entier.

---

### User Story 2 - Julien renseigne le suivi au moment où il expédie (Priority: P1)

Julien colle l'étiquette, dépose le colis, et revient marquer la commande comme expédiée. C'est
le seul moment où il a le numéro sous les yeux. Si l'interface ne le lui demande pas à cet
instant, il ne le saisira jamais.

**Why this priority**: Sans saisie, la story 1 n'a aucune donnée à afficher. Et le moment de
saisie est contraint par le geste réel, pas par la structure de l'application.

**Independent Test**: Marquer une commande comme expédiée et constater que le transporteur et
le numéro sont demandés dans le même geste.

**Acceptance Scenarios**:

1. **Given** une commande payée non expédiée, **When** l'artisan la marque comme expédiée,
   **Then** il peut renseigner le transporteur et le numéro de suivi dans le même geste.
2. **Given** l'artisan qui n'a pas encore le numéro, **When** il marque la commande comme
   expédiée, **Then** il peut le faire sans renseigner de suivi, et l'ajouter plus tard.
3. **Given** une commande avec un numéro erroné, **When** l'artisan le corrige, **Then** la
   correction est prise en compte et visible par l'acheteuse.
4. **Given** un transporteur sélectionné, **When** le numéro est enregistré, **Then** le lien
   construit mène à la page de suivi de ce transporteur.

---

### User Story 3 - L'acheteuse est prévenue sans avoir à revenir (Priority: P3)

Marie ne consulte pas son compte tous les jours. Si le numéro de suivi n'apparaît que sur le
site, elle ne le verra qu'en y retournant d'elle-même.

**Why this priority**: Nettement moins urgent que les deux précédentes — l'information existe
et reste consultable. Mais elle atteint son destinataire au bon moment, ce qui est l'objet de
la fonctionnalité.

**Independent Test**: Renseigner un numéro de suivi et vérifier qu'un message parvient à
l'acheteuse.

**Acceptance Scenarios**:

1. **Given** une commande qui vient d'être marquée expédiée avec un suivi, **When**
   l'enregistrement est confirmé, **Then** l'acheteuse reçoit un message contenant le numéro et
   le lien.
2. **Given** un numéro corrigé après coup, **When** la correction est enregistrée, **Then**
   aucun second message n'est envoyé sans action explicite de l'artisan.

---

### Edge Cases

- Un transporteur retiré de la liste ne doit pas casser l'affichage des commandes anciennes qui
  le référencent.
- Un numéro de suivi mal formé pour le transporteur choisi doit être signalé à la saisie, pas
  découvert par l'acheteuse devant un lien mort.
- Une commande marquée expédiée par erreur doit pouvoir revenir en arrière sans laisser un
  numéro orphelin.
- Le numéro de suivi est une donnée personnelle rattachée à une commande : il suit les mêmes
  règles d'accès que le reste de la commande.
- Si le transporteur ne propose pas d'URL de suivi construite à partir du seul numéro, le
  numéro doit rester affiché sans lien plutôt que de mener à une page inutile.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Une commande MUST pouvoir porter un transporteur et un numéro de suivi.
- **FR-002**: L'artisan MUST pouvoir les renseigner dans le même geste que le marquage
  d'expédition, et les corriger ensuite.
- **FR-003**: Le marquage d'expédition MUST rester possible sans suivi.
- **FR-004**: L'acheteuse MUST voir le numéro de suivi et un lien vers le suivi du transporteur
  sur sa commande, lorsqu'ils existent.
- **FR-005**: Le numéro de suivi MUST être lisible et copiable en entier.
- **FR-006**: Aucune zone de suivi vide ni lien mort MUST apparaître lorsqu'il n'y a pas de
  suivi.
- **FR-007**: Le lien de suivi MUST être construit à partir du transporteur et du numéro, sans
  saisie d'URL par l'artisan.
- **FR-008**: Un transporteur sans URL de suivi exploitable MUST afficher le numéro sans lien.
- **FR-009**: Le suivi MUST être soumis aux mêmes règles d'accès que la commande qui le porte.
- **FR-010**: Un numéro manifestement incompatible avec le transporteur choisi MUST être
  signalé à la saisie.
- **FR-011**: L'acheteuse SHOULD être prévenue par message lorsqu'un suivi est renseigné pour
  la première fois.

### Key Entities

- **Suivi de colis** : le rattachement d'un transporteur et d'un numéro à une commande
  expédiée. Facultatif : une commande peut être expédiée sans.
- **Transporteur** : une entreprise de livraison, identifiée par une clé technique stable, un
  nom affiché, et le modèle d'URL permettant de construire un lien de suivi à partir d'un
  numéro. Certains n'en ont pas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Une acheteuse peut connaître la position de son colis depuis sa commande, sans
  contacter l'atelier.
- **SC-002**: L'artisan renseigne le suivi sans quitter l'écran où il marque l'expédition.
- **SC-003**: Aucune commande sans suivi n'affiche de zone vide ou de lien mort.
- **SC-004**: Un lien de suivi mène à la page du transporteur pour le colis concerné.
- **SC-005**: Le nombre de sollicitations directes portant sur « où est mon colis » diminue.

## Assumptions

- L'artisan expédie par un petit nombre de transporteurs connus. La liste est une donnée de
  configuration, pas une table à administrer.
- Le suivi est déclaratif : le site ne consulte aucune interface de transporteur et n'affiche
  pas d'état d'acheminement. Il stocke un numéro et construit un lien.
- Interroger les transporteurs pour afficher un état en direct est hors périmètre : cela
  supposerait un contrat par transporteur, des identifiants, et une gestion de panne.
- Le message d'information à l'acheteuse réutilise le mécanisme d'e-mail déjà en place pour les
  accusés de commande.
- Cette spécification s'exécute après la 002, dont elle réutilise l'indicateur d'état et le
  vocabulaire de la commande.
- Une modification du schéma de données est nécessaire — la première depuis la reprise du
  projet. Elle n'affecte pas le contrat de l'API mobile, qui n'expose pas les commandes.
