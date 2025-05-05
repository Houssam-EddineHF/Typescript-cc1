"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Coffee_1 = require("./models/Coffee");
const InventoryManager_1 = require("./services/InventoryManager");
const CoffeeDAO_1 = require("./dao/CoffeeDAO");
const readline_1 = __importDefault(require("readline"));
const colors_1 = require("./utils/colors");
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function initializeApp() {
    const inventoryManager = InventoryManager_1.InventoryManager.getInstance();
    const coffeeDAO = CoffeeDAO_1.CoffeeDAO.getInstance();
    await inventoryManager.initialize();
    await coffeeDAO.initialize();
    // Ajouter des ingrédients initiaux
    await inventoryManager.addIngredient('coffee_beans', 1000);
    await inventoryManager.addIngredient('milk', 500);
    await inventoryManager.addIngredient('sugar', 200);
    await inventoryManager.addIngredient('water', 2000);
    console.log('Système de gestion de café initialisé !');
    showMenu();
}
function showMenu() {
    console.log('\n=== Menu Principal ===');
    console.log('1. Passer une commande');
    console.log('2. Voir les commandes récentes');
    console.log('3. Vérifier les stocks');
    console.log('4. Quitter');
    rl.question('Choisissez une option (1-4): ', async (answer) => {
        switch (answer) {
            case '1':
                await placeOrder();
                break;
            case '2':
                await showRecentOrders();
                break;
            case '3':
                await checkInventory();
                break;
            case '4':
                console.log('Au revoir !');
                rl.close();
                return;
            default:
                console.log('Option invalide. Veuillez réessayer.');
                showMenu();
        }
    });
}
async function checkIngredientAvailability(coffee) {
    const inventoryManager = InventoryManager_1.InventoryManager.getInstance();
    const requiredIngredients = coffee.getRequiredIngredients();
    for (const [ingredient, quantity] of Object.entries(requiredIngredients)) {
        const available = await inventoryManager.getIngredientQuantity(ingredient);
        if (available < quantity) {
            console.log(`\nDésolé, stock insuffisant de ${ingredient}.`);
            console.log(`Requis: ${quantity}, Disponible: ${available}`);
            return false;
        }
    }
    return true;
}
async function updateIngredientStock(coffee) {
    const inventoryManager = InventoryManager_1.InventoryManager.getInstance();
    const requiredIngredients = coffee.getRequiredIngredients();
    for (const [ingredient, quantity] of Object.entries(requiredIngredients)) {
        const currentQuantity = await inventoryManager.getIngredientQuantity(ingredient);
        await inventoryManager.updateIngredientQuantity(ingredient, currentQuantity - quantity);
    }
}
async function displayDiscountMenu() {
    console.clear();
    console.log(`${colors_1.colors.blue}${colors_1.colors.bold}=== 💰 Réductions Disponibles ===${colors_1.colors.reset}\n`);
    console.log(`${colors_1.colors.blue}1.${colors_1.colors.reset} Aucune réduction`);
    console.log(`${colors_1.colors.blue}2.${colors_1.colors.reset} Réduction Étudiant (10%)`);
    console.log(`${colors_1.colors.blue}3.${colors_1.colors.reset} Réduction Fidélité (15%)`);
    console.log(`${colors_1.colors.blue}4.${colors_1.colors.reset} Réduction Spéciale (20%)\n`);
    console.log(`${colors_1.colors.underline}Veuillez choisir une réduction :${colors_1.colors.reset} `);
}
async function applyDiscount(coffee) {
    await displayDiscountMenu();
    const choice = await new Promise(resolve => rl.question('', resolve));
    switch (choice) {
        case '1':
            coffee.setDiscount(0);
            break;
        case '2':
            coffee.setDiscount(10);
            break;
        case '3':
            coffee.setDiscount(15);
            break;
        case '4':
            coffee.setDiscount(20);
            break;
        default:
            console.log(`${colors_1.colors.red}${colors_1.symbols.error} Option invalide${colors_1.colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return applyDiscount(coffee);
    }
}
async function checkInventory() {
    const inventoryManager = InventoryManager_1.InventoryManager.getInstance();
    console.clear();
    console.log(`${colors_1.colors.blue}${colors_1.colors.bold}=== ${colors_1.symbols.stock} État des Stocks ===${colors_1.colors.reset}\n`);
    const ingredients = {
        coffee_beans: 'Grains de café (g)',
        milk: 'Lait (ml)',
        sugar: 'Sucre (g)',
        water: 'Eau (ml)'
    };
    for (const [key, label] of Object.entries(ingredients)) {
        const quantity = await inventoryManager.getIngredientQuantity(key);
        const status = quantity > 500 ? colors_1.colors.green : quantity > 200 ? colors_1.colors.yellow : colors_1.colors.red;
        console.log(`${label}: ${status}${quantity}${colors_1.colors.reset} ${getStockIndicator(quantity)}`);
    }
    console.log(`\n${colors_1.colors.underline}Appuyez sur Entrée pour continuer...${colors_1.colors.reset}`);
    await new Promise(resolve => rl.once('line', resolve));
    showMenu();
}
function getStockIndicator(quantity) {
    if (quantity > 500)
        return `${colors_1.symbols.success} Stock suffisant`;
    if (quantity > 200)
        return `${colors_1.symbols.warning} Stock moyen`;
    return `${colors_1.symbols.error} Stock faible`;
}
async function displayOrderConfirmation(coffee) {
    console.clear();
    console.log(`${colors_1.colors.blue}${colors_1.colors.bold}=== ${colors_1.symbols.coffee} Récapitulatif de la Commande ===${colors_1.colors.reset}\n`);
    console.log(`Type: ${colors_1.colors.bold}${coffee.type}${colors_1.colors.reset}`);
    // Afficher les ingrédients requis
    console.log('\nIngrédients nécessaires:');
    const ingredients = coffee.getRequiredIngredients();
    for (const [ingredient, quantity] of Object.entries(ingredients)) {
        console.log(`- ${ingredient}: ${quantity}`);
    }
    // Afficher les personnalisations
    console.log('\nPersonnalisations:');
    if (coffee.customizations.length === 0) {
        console.log('Aucune');
    }
    else {
        coffee.customizations.forEach(c => {
            console.log(`- ${c.name} (${colors_1.symbols.price}+${c.price}€)`);
        });
    }
    // Afficher le prix et la réduction
    const totalBeforeDiscount = coffee.calculateTotalPrice() / (1 - coffee.discount / 100);
    console.log(`\nPrix de base: ${colors_1.colors.white}${colors_1.symbols.price} ${totalBeforeDiscount.toFixed(2)}€${colors_1.colors.reset}`);
    if (coffee.discount > 0) {
        console.log(`Réduction: ${colors_1.colors.green}-${coffee.discount}% (${colors_1.symbols.price}-${(totalBeforeDiscount * coffee.discount / 100).toFixed(2)}€)${colors_1.colors.reset}`);
    }
    console.log(`Prix final: ${colors_1.colors.green}${colors_1.symbols.price} ${coffee.calculateTotalPrice()}€${colors_1.colors.reset}\n`);
    console.log(`${colors_1.colors.underline}Confirmer la commande ? (o/n) :${colors_1.colors.reset} `);
}
async function placeOrder() {
    let coffee = null;
    let customizations = [];
    // Choix du type de café
    await displayCoffeeMenu();
    const coffeeType = await new Promise(resolve => rl.question('', resolve));
    switch (coffeeType) {
        case '1':
            coffee = new Coffee_1.Espresso();
            break;
        case '2':
            coffee = new Coffee_1.Latte();
            break;
        case '3':
            coffee = new Coffee_1.Cappuccino();
            break;
        case '4':
            return;
        default:
            console.log(`${colors_1.colors.red}${colors_1.symbols.error} Option invalide${colors_1.colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return placeOrder();
    }
    // Personnalisations
    while (true) {
        await displayCustomizationMenu();
        const choice = await new Promise(resolve => rl.question('', resolve));
        switch (choice) {
            case '1':
                customizations.push({ name: 'Sucre', price: 0.50 });
                break;
            case '2':
                customizations.push({ name: 'Lait supplémentaire', price: 0.75 });
                break;
            case '3':
                break;
            default:
                console.log(`${colors_1.colors.red}${colors_1.symbols.error} Option invalide${colors_1.colors.reset}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
        }
        if (choice === '3')
            break;
    }
    if (coffee) {
        coffee.customizations = customizations;
        // Application de la réduction
        await applyDiscount(coffee);
        // Vérification des stocks
        if (!await checkIngredientAvailability(coffee)) {
            console.log(`${colors_1.colors.red}${colors_1.symbols.error} Stocks insuffisants pour cette commande${colors_1.colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return;
        }
        // Confirmation
        await displayOrderConfirmation(coffee);
        const confirm = await new Promise(resolve => rl.question('', resolve));
        if (confirm.toLowerCase() === 'o') {
            await updateIngredientStock(coffee);
            await saveOrder(coffee);
            console.log(`${colors_1.colors.green}${colors_1.symbols.success} Commande enregistrée avec succès${colors_1.colors.reset}`);
        }
        else {
            console.log(`${colors_1.colors.yellow}${colors_1.symbols.warning} Commande annulée${colors_1.colors.reset}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}
async function saveOrder(coffee) {
    const coffeeDAO = CoffeeDAO_1.CoffeeDAO.getInstance();
    await coffeeDAO.saveCoffee(coffee);
    console.clear();
    console.log(`${colors_1.colors.green}${colors_1.symbols.success} Commande enregistrée avec succès !${colors_1.colors.reset}\n`);
    console.log(`Type: ${colors_1.colors.bold}${coffee.type}${colors_1.colors.reset}`);
    console.log(`Personnalisations: ${coffee.customizations.map(c => c.name).join(', ') || 'Aucune'}`);
    if (coffee.discount > 0) {
        console.log(`Réduction appliquée: ${colors_1.colors.green}${coffee.discount}%${colors_1.colors.reset}`);
    }
    console.log(`Prix total: ${colors_1.colors.green}${colors_1.symbols.price} ${coffee.calculateTotalPrice()}€${colors_1.colors.reset}\n`);
    console.log(`${colors_1.colors.underline}Appuyez sur Entrée pour continuer...${colors_1.colors.reset}`);
    await new Promise(resolve => rl.once('line', resolve));
    showMenu();
}
async function showRecentOrders() {
    const coffeeDAO = CoffeeDAO_1.CoffeeDAO.getInstance();
    const orders = await coffeeDAO.getAllOrders();
    console.log(`${colors_1.colors.blue}${colors_1.colors.bold}=== ${colors_1.symbols.menu} Commandes Récentes ===${colors_1.colors.reset}\n`);
    if (orders.length === 0) {
        console.log(`${colors_1.colors.yellow}${colors_1.symbols.warning} Aucune commande enregistrée${colors_1.colors.reset}`);
    }
    else {
        orders.forEach(order => {
            console.log(`${colors_1.symbols.coffee} ${order.type}`);
            console.log(`Personnalisations: ${order.customizations.map(c => c.name).join(', ') || 'Aucune'}`);
            if (order.discount > 0) {
                console.log(`Réduction: ${colors_1.colors.green}${order.discount}%${colors_1.colors.reset}`);
            }
            console.log(`Prix total: ${colors_1.colors.green}${colors_1.symbols.price} ${order.calculateTotalPrice()}€${colors_1.colors.reset}`);
            console.log(`Date: ${order.timestamp?.toLocaleString()}\n`);
        });
    }
    console.log(`${colors_1.colors.underline}Appuyez sur Entrée pour continuer...${colors_1.colors.reset}`);
    await new Promise(resolve => rl.once('line', resolve));
    showMenu();
}
async function displayCoffeeMenu() {
    console.clear();
    console.log(`${colors_1.colors.blue}${colors_1.colors.bold}=== ${colors_1.symbols.coffee} Types de Café Disponibles ===${colors_1.colors.reset}\n`);
    console.log(`${colors_1.colors.blue}1.${colors_1.colors.reset} Espresso ${colors_1.symbols.price} 2.50€`);
    console.log(`${colors_1.colors.blue}2.${colors_1.colors.reset} Latte ${colors_1.symbols.price} 3.50€`);
    console.log(`${colors_1.colors.blue}3.${colors_1.colors.reset} Cappuccino ${colors_1.symbols.price} 3.00€`);
    console.log(`${colors_1.colors.red}4.${colors_1.colors.reset} Retour\n`);
    console.log(`${colors_1.colors.underline}Veuillez choisir un type de café :${colors_1.colors.reset} `);
}
async function displayCustomizationMenu() {
    console.clear();
    console.log(`${colors_1.colors.blue}${colors_1.colors.bold}=== Personnalisations Disponibles ===${colors_1.colors.reset}\n`);
    console.log(`${colors_1.colors.blue}1.${colors_1.colors.reset} Sucre ${colors_1.symbols.price} +0.50€`);
    console.log(`${colors_1.colors.blue}2.${colors_1.colors.reset} Lait supplémentaire ${colors_1.symbols.price} +0.75€`);
    console.log(`${colors_1.colors.blue}3.${colors_1.colors.reset} Terminer les personnalisations\n`);
    console.log(`${colors_1.colors.underline}Veuillez choisir une option :${colors_1.colors.reset} `);
}
// Démarrer l'application
initializeApp().catch(console.error);
