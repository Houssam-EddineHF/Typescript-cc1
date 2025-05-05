"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryManager = void 0;
class InventoryManager {
    constructor() {
        this.inventory = new Map();
    }
    static getInstance() {
        if (!InventoryManager.instance) {
            InventoryManager.instance = new InventoryManager();
        }
        return InventoryManager.instance;
    }
    async initialize() {
        // Pas besoin d'initialisation pour le stockage en mémoire
    }
    async addIngredient(name, quantity) {
        this.inventory.set(name, quantity);
    }
    async getIngredientQuantity(name) {
        return this.inventory.get(name) || 0;
    }
    async updateIngredientQuantity(name, quantity) {
        this.inventory.set(name, quantity);
    }
}
exports.InventoryManager = InventoryManager;
