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
   DATABASE_URL="file:./db.sqlite"
   JWT_ACC_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
   JWT_REF_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c



3. Lancez les conteneurs avec Docker Compose :
   ```bash
   docker-compose up 
   ```

4. Compte manager :     
               email : manager@admin.com
               password : test2

5. Compte secretary :
                  email : secretary@admin.com
                  password : admin123
6. Compte employee : 
                  email : yassine@test.com
                  password : yassine

L'application sera disponible à l'adresse suivante: http://localhost:4300



## Rôles et Accès

L'application gère trois types d'utilisateurs :
- Employés : peuvent réserver des places de parking
- Managers : peuvent gérer les réservations et voir les statistiques
- Secrétaires : peuvent gérer les employés et les réservations


