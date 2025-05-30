ADR-0010 : Choix de la sécurité Frontend

Statut : Acceptée

Contexte :

Le projet de parking doit garantir la sécurité des données et des utilisateurs, notamment en ce qui concerne
qui peut accéder à quelles fonctionnalités/pages.

Décision :
Nous avons choisi d'utiliser des guards dans Angular pour gérer la sécurité au niveau du frontend.
2 guards principaux seront mis en place :
- ConnectedGuard : pour protéger les routes nécessitant une authentification.
- RoleGuard : pour restreindre l'accès aux routes en fonction du rôle de l'utilisateur (employé, manager, secrétaire).

Justification :
- Les guards Angular permettent de gérer facilement l'accès aux routes en fonction de l'état d'authentification et des rôles.
- Les personnes n'ayant pas les droits d'accès appropriés seront redirigées vers la page de connexion ou une page d'erreur.


Bien entendu, les guards ne remplacent pas la sécurité côté serveur, c'est pourquoi nous implémenterons également des vérifications côté backend pour valider les permissions avant d'exécuter les actions sensibles.