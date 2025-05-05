import { Coffee } from '../models/Coffee';

export class CoffeeDAO {
    private static instance: CoffeeDAO;
    private orders: Coffee[] = [];

    private constructor() {}

    static getInstance(): CoffeeDAO {
        if (!CoffeeDAO.instance) {
            CoffeeDAO.instance = new CoffeeDAO();
        }
        return CoffeeDAO.instance;
    }

    async initialize(): Promise<void> {
        // Initialisation de la base de données en mémoire
        this.orders = [];
    }

    async saveCoffee(coffee: Coffee): Promise<void> {
        const savedCoffee = new Coffee(coffee.type, coffee.basePrice);
        savedCoffee.customizations = [...coffee.customizations];
        savedCoffee.discount = coffee.discount;
        savedCoffee.timestamp = new Date();
        this.orders.push(savedCoffee);
    }

    async getAllOrders(): Promise<Coffee[]> {
        return [...this.orders];
    }

    async deleteOrder(index: number): Promise<void> {
        if (index >= 0 && index < this.orders.length) {
            this.orders.splice(index, 1);
        }
    }
} 