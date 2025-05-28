ADR 0008: Type d'architecture Frontend

Statut : Acceptée

Contexte :Le code du frontend doit pouvoir être simple de compréhension pour les développeurs
afin de pouvoir être développé rapidement dans le peu de temps imparti.

Décision :

Nous avons choisi une architecture feature-based pour le frontend en Angular.
L'idée est de regrouper tout ce qui concerne une fonctionnalité métier au même endroit:
- employee/, manager/, secretary/, shared/: contient les composants, services, guards et autres ressources liés à chaque rôle.
- /pages : contient les pages principales de l'application, regroupant les fonctionnalités par contexte métier.

Justification :
- Compréhension rapide pour les développeurs, organisation claire facilitant le développement.
-  Scalabilité : facile à maintenir quand l'app grandit.


Conséquences :
- Permet une séparation claire(chacun travaille sur sa propre feature), facilitant la maintenance et l'évolution du code.
- Facilite la collaboration entre les développeurs en réduisant les conflits de code.
- Réduit la complexité initiale, permettant une montée en charge progressive.