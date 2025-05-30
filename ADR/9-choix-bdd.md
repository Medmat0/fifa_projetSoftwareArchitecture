ADR-0009 : Choix de la base de données (SQLite)

Statut : Acceptée

Contexte :

Le projet de parking est un prototype destiné à démontrer les fonctionnalités de réservation et de gestion en quelques jours.
Il sera principalement exécuté en local (localhost) et sur de courtes périodes.
L’objectif est de simplifier la mise en place et de se concentrer sur la logique métier, pas sur la configuration de la base de données.

Décision :

Nous avons choisi SQLite comme SGBD pour ce projet.

Justification :

Simplicité de mise en place : pas besoin d’installer ou configurer un serveur de base de données (PostgreSQL, MySQL…).

Pas de dépendance réseau : fichier .sqlite local, parfait pour des démonstrations ou des tests rapides.

Très léger pour les cas de test en local.