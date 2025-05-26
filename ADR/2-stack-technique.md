ADR 0002 : Choix du Stack Technologique

Statut : Acceptée

Contexte :
L’application doit gérer l’authentification des utilisateurs, plusieurs rôles dynamiques (3 rôles), la disponibilité des places en temps réel et les check-in via QR code. L’équipe maîtrise Angular et Node.js.

Décision :
Utiliser Angular pour le frontend, Node.js pour le backend, PostgreSQL pour la base de données, JWT pour l’authentification, et Docker 

Conséquences :

Développement rapide avec des outils familiers

Écosystème robuste pour l’authentification et les APIs REST

Déploiement facilité avec Docker