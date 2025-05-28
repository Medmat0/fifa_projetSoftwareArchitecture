ADR 0006 : Type d'Authentification

Statut : Acceptée

Contexte :

Le système d’authentification de notre application de réservation de parking doit garantir
la sécurité des utilisateurs tout en restant simple à utiliser. L’application est divisée en deux parties :

- Frontend en Angular

- Backend en Node.js

Le système d'authentification et de réservation de parking doit être accessible à tous les employés, tout en assurant une connexion sécurisée.

Décision :

Nous avons opté pour une authentification basée sur JWT (JSON Web Token) avec la stratégie suivante :

- À la connexion, le serveur Node.js génère un JWT signé, envoyé dans un cookie httpOnly.
- Le cookie est automatiquement renvoyé par le navigateur avec chaque requête vers l’API.
- Le frontend Angular ne stocke ni lit le token (car il est inaccessible côté JS grâce à httpOnly), réduisant les risques d’attaque XSS.
- Une route de vérification sur le backend permet d’authentifier et identifier l’utilisateur au chargement de l’application.
- En cas d'expiration ou d’absence de session, l’utilisateur est redirigé vers l'écran d'accueil.
Conséquences :

- Pas de token dans le localStorage, ce qui réduit les risques de XSS
- Le Front ne s'occupe pas de la gestion du token, ce qui simplifie le code Angular
