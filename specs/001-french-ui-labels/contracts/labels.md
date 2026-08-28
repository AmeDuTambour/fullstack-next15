# Contrat — Référentiel de libellés

Ce document décrit le contrat d'usage du référentiel, pas son implémentation. Il fixe ce sur
quoi les écrans peuvent s'appuyer et ce qui doit rester vrai après le travail.

## Ce que le référentiel garantit

1. **Accès par clé, vérifié avant exécution.** Demander une clé inexistante empêche la
   compilation. Aucun écran ne peut afficher une chaîne vide ou une clé technique par accident.
2. **Une valeur, un endroit.** Un même libellé n'est jamais défini deux fois. Réviser une
   formulation se fait à un seul endroit et s'applique partout.
3. **Paramètres explicites.** Un libellé comportant une valeur variable — un nombre, un nom, un
   montant — déclare ce paramètre. Les points d'appel ne concatènent pas de fragments.
4. **Français uniquement.** Le référentiel ne contient aucune valeur anglaise. C'est ce qui
   rend l'interdiction des chaînes littérales suffisante pour empêcher l'anglais de revenir.

## Ce que le référentiel ne couvre pas

- Le contenu saisi par l'administrateur — noms de produits, titres d'articles, descriptions.
  Il transite tel quel.
- Les chemins d'URL et les identifiants stockés en base.
- Les messages destinés aux développeurs : journaux, erreurs internes, commentaires.

## Règle de nommage des clés

Les clés sont en anglais, comme le reste du code. Elles décrivent le **rôle** du texte, pas sa
formulation : une clé nommée d'après le texte français devrait changer à chaque révision de
rédaction, ce qui annulerait la garantie 2.

## Correspondance d'erreurs

| Situation | Ce que le visiteur reçoit |
|---|---|
| Validation d'un champ | Le message français du champ concerné |
| Contrainte d'unicité | Un message français nommant le champ en clair, sans son nom technique |
| Accès refusé | Un message français d'autorisation |
| Toute autre erreur | Un message générique français, identique quelle que soit la cause |

Dans tous les cas, le message technique d'origine est journalisé côté serveur et n'atteint
jamais le visiteur.

## Vérification

Le contrat est tenu si :

- aucune chaîne littérale visible ne subsiste dans le balisage des surfaces couvertes ;
- la vérification de types passe, ce qui prouve qu'aucune clé n'est absente ;
- provoquer chaque famille d'erreur produit un message français, et le message technique
  n'apparaît que dans les journaux serveur.
