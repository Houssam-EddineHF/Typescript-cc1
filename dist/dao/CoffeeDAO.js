"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoffeeDAO = void 0;
const Coffee_1 = require("../models/Coffee");
class CoffeeDAO {
    constructor() {
        this.orders = [];
    }
    static getInstance() {
        if (!CoffeeDAO.instance) {
            CoffeeDAO.instance = new CoffeeDAO();
        }
        return CoffeeDAO.instance;
    }
    async initialize() {
        // Initialisation de la base de données en mémoire
        this.orders = [];
    }
    async saveCoffee(coffee) {
        const savedCoffee = new Coffee_1.Coffee(coffee.type, coffee.basePrice);
        savedCoffee.customizations = [...coffee.customizations];
        savedCoffee.discount = coffee.discount;
        savedCoffee.timestamp = new Date();
        this.orders.push(savedCoffee);
    }
    async getAllOrders() {
        return [...this.orders];
    }
    async deleteOrder(index) {
        if (index >= 0 && index < this.orders.length) {
            this.orders.splice(index, 1);
        }
    }
}
exports.CoffeeDAO = CoffeeDAO;
