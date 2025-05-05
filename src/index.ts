import { Coffee, Espresso, Latte, Cappuccino, Customization } from './models/Coffee';
import { InventoryManager } from './services/InventoryManager';
import { CoffeeDAO } from './dao/CoffeeDAO';
import readline from 'readline';
import { colors, symbols } from './utils/colors';

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

async function initializeApp() {
    const inventoryManager = InventoryManager.getInstance();
    const coffeeDAO = CoffeeDAO.getInstance();
    
    await inventoryManager.initialize();
    await coffeeDAO.initialize();

    // Ajouter des ingrédients initiaux
    await inventoryManager.addIngredient('coffee_beans', 1000);
    await inventoryManager.addIngredient('milk', 500);
    await inventoryManager.addIngredient('sugar', 200);
    await inventoryManager.addIngredient('water', 2000);

    console.log('Système de gestion de café !');
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

async function checkIngredientAvailability(coffee: any): Promise<boolean> {
    const inventoryManager = InventoryManager.getInstance();
    const requiredIngredients = coffee.getRequiredIngredients();

    for (const [ingredient, quantity] of Object.entries(requiredIngredients) as [string, number][]) {
        const available = await inventoryManager.getIngredientQuantity(ingredient);
        if (available < quantity) {
            console.log(`\nDésolé, stock insuffisant de ${ingredient}.`);
            console.log(`Requis: ${quantity}, Disponible: ${available}`);
            return false;
        }
    }
    return true;
}

async function updateIngredientStock(coffee: any): Promise<void> {
    const inventoryManager = InventoryManager.getInstance();
    const requiredIngredients = coffee.getRequiredIngredients();

    for (const [ingredient, quantity] of Object.entries(requiredIngredients) as [string, number][]) {
        const currentQuantity = await inventoryManager.getIngredientQuantity(ingredient);
        await inventoryManager.updateIngredientQuantity(ingredient, currentQuantity - quantity);
    }
}

async function displayDiscountMenu() {
    console.clear();
    console.log(`${colors.blue}${colors.bold}=== 💰 Réductions Disponibles ===${colors.reset}\n`);
    console.log(`${colors.blue}1.${colors.reset} Aucune réduction`);
    console.log(`${colors.blue}2.${colors.reset} Réduction Étudiant (10%)`);
    console.log(`${colors.blue}3.${colors.reset} Réduction Fidélité (15%)`);
    console.log(`${colors.blue}4.${colors.reset} Réduction Spéciale (20%)\n`);
    console.log(`${colors.underline}Veuillez choisir une réduction :${colors.reset} `);
}

async function applyDiscount(coffee: Coffee): Promise<void> {
    await displayDiscountMenu();
    const choice = await new Promise<string>(resolve => rl.question('', resolve));
    
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
            console.log(`${colors.red}${symbols.error} Option invalide${colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return applyDiscount(coffee);
    }
}

async function checkInventory() {
    const inventoryManager = InventoryManager.getInstance();
    
    console.clear();
    console.log(`${colors.blue}${colors.bold}=== ${symbols.stock} État des Stocks ===${colors.reset}\n`);
    
    const ingredients = {
        coffee_beans: 'Grains de café (g)',
        milk: 'Lait (ml)',
        sugar: 'Sucre (g)',
        water: 'Eau (ml)'
    };

    for (const [key, label] of Object.entries(ingredients)) {
        const quantity = await inventoryManager.getIngredientQuantity(key);
        const status = quantity > 500 ? colors.green : quantity > 200 ? colors.yellow : colors.red;
        console.log(`${label}: ${status}${quantity}${colors.reset} ${getStockIndicator(quantity)}`);
    }

    console.log(`\n${colors.underline}Appuyez sur Entrée pour continuer...${colors.reset}`);
    await new Promise(resolve => rl.once('line', resolve));
    showMenu();
}

function getStockIndicator(quantity: number): string {
    if (quantity > 500) return `${symbols.success} Stock suffisant`;
    if (quantity > 200) return `${symbols.warning} Stock moyen`;
    return `${symbols.error} Stock faible`;
}

async function displayOrderConfirmation(coffee: Coffee) {
    console.clear();
    console.log(`${colors.blue}${colors.bold}=== ${symbols.coffee} Récapitulatif de la Commande ===${colors.reset}\n`);
    console.log(`Type: ${colors.bold}${coffee.type}${colors.reset}`);
    
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
    } else {
        coffee.customizations.forEach(c => {
            console.log(`- ${c.name} (${symbols.price}+${c.price}€)`);
        });
    }
    
    // Afficher le prix et la réduction
    const totalBeforeDiscount = coffee.calculateTotalPrice() / (1 - coffee.discount / 100);
    console.log(`\nPrix de base: ${colors.white}${symbols.price} ${totalBeforeDiscount.toFixed(2)}€${colors.reset}`);
    if (coffee.discount > 0) {
        console.log(`Réduction: ${colors.green}-${coffee.discount}% (${symbols.price}-${(totalBeforeDiscount * coffee.discount / 100).toFixed(2)}€)${colors.reset}`);
    }
    console.log(`Prix final: ${colors.green}${symbols.price} ${coffee.calculateTotalPrice()}€${colors.reset}\n`);
    
    console.log(`${colors.underline}Confirmer la commande ? (o/n) :${colors.reset} `);
}

async function placeOrder() {
    let coffee: Coffee | null = null;
    let customizations: Customization[] = [];

    // Choix du type de café
    await displayCoffeeMenu();
    const coffeeType = await new Promise<string>(resolve => rl.question('', resolve));
    
    switch (coffeeType) {
        case '1':
            coffee = new Espresso();
            break;
        case '2':
            coffee = new Latte();
            break;
        case '3':
            coffee = new Cappuccino();
            break;
        case '4':
            return;
        default:
            console.log(`${colors.red}${symbols.error} Option invalide${colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return placeOrder();
    }

    // Personnalisations
    while (true) {
        await displayCustomizationMenu();
        const choice = await new Promise<string>(resolve => rl.question('', resolve));
        
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
                console.log(`${colors.red}${symbols.error} Option invalide${colors.reset}`);
                await new Promise(resolve => setTimeout(resolve, 2000));
                continue;
        }
        
        if (choice === '3') break;
    }

    if (coffee) {
        coffee.customizations = customizations;
        
        // Application de la réduction
        await applyDiscount(coffee);
        
        // Vérification des stocks
        if (!await checkIngredientAvailability(coffee)) {
            console.log(`${colors.red}${symbols.error} Stocks insuffisants pour cette commande${colors.reset}`);
            await new Promise(resolve => setTimeout(resolve, 2000));
            return;
        }

        // Confirmation
        await displayOrderConfirmation(coffee);
        const confirm = await new Promise<string>(resolve => rl.question('', resolve));
        
        if (confirm.toLowerCase() === 'o') {
            await updateIngredientStock(coffee);
            await saveOrder(coffee);
            console.log(`${colors.green}${symbols.success} Commande enregistrée avec succès${colors.reset}`);
        } else {
            console.log(`${colors.yellow}${symbols.warning} Commande annulée${colors.reset}`);
        }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

async function saveOrder(coffee: Coffee) {
    const coffeeDAO = CoffeeDAO.getInstance();
    await coffeeDAO.saveCoffee(coffee);
    
    console.clear();
    console.log(`${colors.green}${symbols.success} Commande enregistrée avec succès !${colors.reset}\n`);
    console.log(`Type: ${colors.bold}${coffee.type}${colors.reset}`);
    console.log(`Personnalisations: ${coffee.customizations.map(c => c.name).join(', ') || 'Aucune'}`);
    if (coffee.discount > 0) {
        console.log(`Réduction appliquée: ${colors.green}${coffee.discount}%${colors.reset}`);
    }
    console.log(`Prix total: ${colors.green}${symbols.price} ${coffee.calculateTotalPrice()}€${colors.reset}\n`);
    
    console.log(`${colors.underline}Appuyez sur Entrée pour continuer...${colors.reset}`);
    await new Promise(resolve => rl.once('line', resolve));
    showMenu();
}

async function showRecentOrders() {
    const coffeeDAO = CoffeeDAO.getInstance();
    const orders = await coffeeDAO.getAllOrders();
    
    console.log(`${colors.blue}${colors.bold}=== ${symbols.menu} Commandes Récentes ===${colors.reset}\n`);
    if (orders.length === 0) {
        console.log(`${colors.yellow}${symbols.warning} Aucune commande enregistrée${colors.reset}`);
    } else {
        orders.forEach(order => {
            console.log(`${symbols.coffee} ${order.type}`);
            console.log(`Personnalisations: ${order.customizations.map(c => c.name).join(', ') || 'Aucune'}`);
            if (order.discount > 0) {
                console.log(`Réduction: ${colors.green}${order.discount}%${colors.reset}`);
            }
            console.log(`Prix total: ${colors.green}${symbols.price} ${order.calculateTotalPrice()}€${colors.reset}`);
            console.log(`Date: ${order.timestamp?.toLocaleString()}\n`);
        });
    }
    console.log(`${colors.underline}Appuyez sur Entrée pour continuer...${colors.reset}`);
    await new Promise(resolve => rl.once('line', resolve));
    showMenu();
}

async function displayCoffeeMenu() {
    console.clear();
    console.log(`${colors.blue}${colors.bold}=== ${symbols.coffee} Types de Café Disponibles ===${colors.reset}\n`);
    console.log(`${colors.blue}1.${colors.reset} Espresso ${symbols.price} 2.50€`);
    console.log(`${colors.blue}2.${colors.reset} Latte ${symbols.price} 3.50€`);
    console.log(`${colors.blue}3.${colors.reset} Cappuccino ${symbols.price} 3.00€`);
    console.log(`${colors.red}4.${colors.reset} Retour\n`);
    console.log(`${colors.underline}Veuillez choisir un type de café :${colors.reset} `);
}

async function displayCustomizationMenu() {
    console.clear();
    console.log(`${colors.blue}${colors.bold}=== Personnalisations Disponibles ===${colors.reset}\n`);
    console.log(`${colors.blue}1.${colors.reset} Sucre ${symbols.price} +0.50€`);
    console.log(`${colors.blue}2.${colors.reset} Lait supplémentaire ${symbols.price} +0.75€`);
    console.log(`${colors.blue}3.${colors.reset} Terminer les personnalisations\n`);
    console.log(`${colors.underline}Veuillez choisir une option :${colors.reset} `);
}

// Démarrer l'application
initializeApp().catch(console.error); 