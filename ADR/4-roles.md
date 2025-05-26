ADR 0004 : Rôles Utilisateurs

Statut : Acceptée

Contexte :
L'application doit proposer des fonctionnalités différentes selon le rôle : employé, secrétaire ou manager.

Décision :
Définir trois rôles utilisateurs :

Employé : Peut réserver ou annuler et faire le check-in

Secrétaire : Gère toutes les réservations et les utilisateurs

Manager : Peut réserver pour 30 jours

Conséquences :

Interfaces adaptées par type d’utilisateur

Gestion d’accès basée sur les rôles à implémenter côté frontend et backend