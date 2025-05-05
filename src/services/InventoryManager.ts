export class InventoryManager {
    private static instance: InventoryManager;
    private inventory: Map<string, number> = new Map();

    private constructor() {}

    static getInstance(): InventoryManager {
        if (!InventoryManager.instance) {
            InventoryManager.instance = new InventoryManager();
        }
        return InventoryManager.instance;
    }

    async initialize(): Promise<void> {
        // Pas besoin d'initialisation pour le stockage en mémoire
    }

    async addIngredient(name: string, quantity: number): Promise<void> {
        this.inventory.set(name, quantity);
    }

    async getIngredientQuantity(name: string): Promise<number> {
        return this.inventory.get(name) || 0;
    }

    async updateIngredientQuantity(name: string, quantity: number): Promise<void> {
        this.inventory.set(name, quantity);
    }
} 