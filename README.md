# Système de Gestion de Café
réalisé par HAFIANE Houssam-Eddine   - Sounni Abderrahmane 
## 1. Introduction

Ce système de gestion de café est une application en ligne de commande (CLI) développée en TypeScript qui permet de gérer les commandes de café, les stocks d'ingrédients et les personnalisations. Le système utilise des patterns de conception modernes et des opérations asynchrones pour une gestion efficace des données.

## 2. Architecture

### 2.1 Structure du Projet
```
src/
├── models/
│   └── Coffee.ts          # Classes de base pour les cafés
├── services/
│   └── InventoryManager.ts # Gestion des stocks
├── dao/
│   └── CoffeeDAO.ts       # Accès aux données
├── utils/
│   └── colors.ts          # Configuration des couleurs et symboles
└── index.ts               # Point d'entrée de l'application
```

### 2.2 Patterns de Conception Utilisés
- **Singleton** : Pour `InventoryManager` et `CoffeeDAO`
- **Factory** : Pour la création des différents types de café
- **DAO (Data Access Object)** : Pour l'abstraction de l'accès aux données
- **Async/Await** : Pour la gestion des opérations asynchrones

## 3. Fonctionnalités

### 3.1 Types de Café Disponibles
- **Espresso** (2.50€)
  - Ingrédients : 20g de grains de café, 30ml d'eau
- **Latte** (3.50€)
  - Ingrédients : 20g de grains de café, 30ml d'eau, 100ml de lait
- **Cappuccino** (3.00€)
  - Ingrédients : 20g de grains de café, 30ml d'eau, 80ml de lait

### 3.2 Personnalisations
- **Sucre** (+0.50€)
  - Consomme 10g de sucre
- **Lait supplémentaire** (+0.75€)
  - Consomme 50ml de lait supplémentaire

### 3.3 Réductions Disponibles
- **Réduction Étudiant** : 10%
- **Réduction Fidélité** : 15%
- **Réduction Spéciale** : 20%

### 3.4 Gestion des Stocks
- Suivi en temps réel des ingrédients
- Vérification automatique des stocks avant chaque commande
- Mise à jour automatique des stocks après chaque commande
- Indicateurs visuels de niveau de stock :
  - 🟢 Vert : Stock suffisant (> 500 unités)
  - 🟡 Jaune : Stock moyen (200-500 unités)
  - 🔴 Rouge : Stock faible (< 200 unités)

## 4. Utilisation

### 4.1 Menu Principal
```
=== Menu Principal ===
1. 🔵 Passer une commande
2. 🔵 Voir les commandes récentes
3. 🔵 Vérifier les stocks
4. 🔴 Quitter
```

### 4.2 Processus de Commande
1. Sélection du type de café
2. Ajout des personnalisations
3. Application d'une réduction
4. Vérification des stocks
5. Confirmation de la commande

### 4.3 Affichage des Stocks
```
=== 📊 État des Stocks ===
Grains de café (g): 1000 🟢 Stock suffisant
Lait (ml): 500 🟢 Stock suffisant
Sucre (g): 200 🟡 Stock moyen
Eau (ml): 2000 🟢 Stock suffisant
```

### 4.4 Récapitulatif de Commande
```
=== ☕ Récapitulatif de la Commande ===
Type: Espresso

Ingrédients nécessaires:
- coffee_beans: 20
- water: 30
- sugar: 10

Personnalisations:
- Sucre (💰+0.50€)

Prix de base: 💰 3.00€
Réduction: -10% (💰-0.30€)
Prix final: 💰 2.70€
```

## 5. Stockage des Données

### 5.1 Stocks d'Ingrédients
- Grains de café : 1000g
- Lait : 500ml
- Sucre : 200g
- Eau : 2000ml

### 5.2 Commandes
- Stockage en mémoire des commandes
- Historique avec date et heure
- Détails des personnalisations
- Réductions appliquées

## 6. Dépendances

```json
{
  "dependencies": {
    "typescript": "^5.0.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0"
  }
}
```

## 7. Installation et Exécution

1. Installation des dépendances :
```bash
npm install
```

2. Compilation et exécution :
```bash
npm start
```

## 8. Gestion des Erreurs

Le système gère plusieurs types d'erreurs :
- Stocks insuffisants
- Types de café invalides
- Personnalisations invalides
- Réductions invalides
- Erreurs de saisie

## 9. Extensions Possibles

1. **Persistance des données** :
   - Implémentation d'une base de données
   - Sauvegarde des commandes
   - Historique des stocks

2. **Fonctionnalités supplémentaires** :
   - Statistiques de vente
   - Gestion des prix
   - Interface graphique
   - Système de réapprovisionnement automatique

3. **Améliorations** :
   - Plus de types de café
   - Plus de personnalisations
   - Système de fidélité
   - Gestion des promotions

## 10. Bonnes Pratiques

1. **Code** :
   - Utilisation de TypeScript pour le typage fort
   - Pattern Singleton pour la gestion des ressources
   - Opérations asynchrones avec async/await
   - Gestion des erreurs avec try/catch

2. **Architecture** :
   - Séparation des responsabilités
   - Modularité du code
   - Facilement extensible
   - Tests unitaires

3. **Gestion des données** :
   - Vérification des stocks avant chaque opération
   - Mise à jour atomique des données
   - Historique des opérations
   - Validation des entrées

## 11. Limitations

1. **Stockage** :
   - Données en mémoire (non persistantes)
   - Limité aux ingrédients de base
   - Pas de sauvegarde automatique

2. **Fonctionnalités** :
   - Pas de gestion des paiements
   - Pas de système de facturation
   - Pas de gestion des utilisateurs
   - Pas de statistiques avancées

## 12. Conclusion

Ce système de gestion de café offre une base solide pour la gestion des commandes et des stocks. Il est conçu pour être facilement extensible et maintenable, avec une architecture modulaire et des patterns de conception modernes. Le système inclut des fonctionnalités avancées comme la gestion des stocks en temps réel, les réductions et un affichage amélioré avec des couleurs et des symboles. 