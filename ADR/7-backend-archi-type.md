ADR 0007 : Type d'architecture Backend

Statut : Acceptée

Contexte :
Le backend de notre application de réservation de parking doit gérer plusieurs responsabilités : 
- l’authentification
- les réservations 
- la gestion des utilisateurs 
- le reporting pour les managers
- l’interface d’administration pour les secrétaires.

Décision :

Nous avons choisi une architecture monomodulaire (monolithique) pour le backend en Node.js (Express).

L’application contient tous les modules dans un seul service déployé dans un conteneur unique.

Justification :

Cohérence avec les objectifs pédagogiques et les contraintes du projet :
- Simplicité de mise en place et de compréhension,
- Permet de prototyper rapidement, ce qui correspond bien aux itérations courtes prévues.

Conséquences :
- Développement plus rapide et plus simple.
- Facilité de gestion des dépendances et de la configuration.
- Possibilité d’évoluer vers une architecture plus complexe (microservices) si nécessaire à l’avenir.
- Réduction de la complexité initiale(chaque implémentation de module est isolé), facilitant la maintenance et les évolutions futures.

