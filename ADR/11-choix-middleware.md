ADR-0011 : Choix de la sécurité Backend

Statut : Acceptée

Contexte :

Le projet de parking doit garantir la sécurité des données et des utilisateurs,
notamment en ce qui concerne l'authentification et l'autorisation des actions.

Décision :
Nous avons choisis d'implémenter des middlewares pour gérer qui peut accéder à quelles ressources/créer des ressources.

Nous allons mettre en place les middlewares suivants :
- authMiddleware : pour vérifier si l'utilisateur est authentifié avant d'accéder aux routes protégées.
- roleMiddleware : pour restreindre l'accès aux routes en fonction du rôle de l'utilisateur (employé, manager, secrétaire).

Justification :

- Les middlewares Express permettent de gérer facilement l'authentification et l'autorisation au niveau du backend.
- Il suffit de les appeler juste avant les routes concernées pour que la vérification  des permissions se fassent.
