# Application de Gestion de Parking

Cette application permet de gérer les réservations de places de parking.

## Prérequis

- [Docker](https://www.docker.com/products/docker-desktop/)

## Structure du Projet

- `Backend/` : API Node.js avec Express et Prisma
- `Frontend/` : Application Angular
- `ADR/` : Architecture Decision Records
- `schemas/` : Diagrammes d'architecture

## Installation et Démarrage avec Docker

1. Clonez le repository

2. Créez un fichier `.env` dans le dossier Backend avec les variables d'environnement suivantes :
   ```env
   DATABASE_URL="file:./prisma/sqlite/dev.db"


3. Lancez les conteneurs avec Docker Compose :
   ```bash
   docker-compose up --build
   ```

L'application sera disponible à l'adresse suivante: http://localhost:4300



## Rôles et Accès

L'application gère trois types d'utilisateurs :
- Employés : peuvent réserver des places de parking
- Managers : peuvent gérer les réservations et voir les statistiques
- Secrétaires : peuvent gérer les employés et les réservations


