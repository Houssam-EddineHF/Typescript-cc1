export interface Customization {
    name: string;
    price: number;
}

export interface Ingredients {
    [key: string]: number;
}

export class Coffee {
    type: string;
    basePrice: number;
    customizations: Customization[];
    discount: number;
    timestamp?: Date;

    constructor(type: string, basePrice: number) {
        this.type = type;
        this.basePrice = basePrice;
        this.customizations = [];
        this.discount = 0;
    }

    addCustomization(customization: Customization) {
        this.customizations.push(customization);
        // Mettre à jour les ingrédients requis en fonction des personnalisations
        if (customization.name === 'Sucre') {
            const ingredients = this.getRequiredIngredients();
            ingredients['sugar'] = (ingredients['sugar'] || 0) + 10;
        } else if (customization.name === 'Lait supplémentaire') {
            const ingredients = this.getRequiredIngredients();
            ingredients['milk'] = (ingredients['milk'] || 0) + 50;
        }
    }

    setDiscount(percentage: number) {
        if (percentage >= 0 && percentage <= 100) {
            this.discount = percentage;
        }
    }

    calculateTotalPrice(): number {
        const customizationsTotal = this.customizations.reduce((total, c) => total + c.price, 0);
        const totalBeforeDiscount = this.basePrice + customizationsTotal;
        return Number((totalBeforeDiscount * (1 - this.discount / 100)).toFixed(2));
    }

    getRequiredIngredients(): Ingredients {
        const ingredients: Ingredients = {};
        // Ajouter les ingrédients des personnalisations
        this.customizations.forEach(customization => {
            if (customization.name === 'Sucre') {
                ingredients['sugar'] = (ingredients['sugar'] || 0) + 10;
            } else if (customization.name === 'Lait supplémentaire') {
                ingredients['milk'] = (ingredients['milk'] || 0) + 50;
            }
        });
        return ingredients;
    }
}

export class Espresso extends Coffee {
    constructor() {
        super('Espresso', 2.50);
    }

    getRequiredIngredients(): Ingredients {
        const baseIngredients: Ingredients = {
            coffee_beans: 20,
            water: 30
        };
        // Ajouter les ingrédients des personnalisations
        const customIngredients = super.getRequiredIngredients();
        return { ...baseIngredients, ...customIngredients };
    }
}

export class Latte extends Coffee {
    constructor() {
        super('Latte', 3.50);
    }

    getRequiredIngredients(): Ingredients {
        const baseIngredients: Ingredients = {
            coffee_beans: 20,
            water: 30,
            milk: 100
        };
        // Ajouter les ingrédients des personnalisations
        const customIngredients = super.getRequiredIngredients();
        // Fusionner les ingrédients en additionnant les quantités de lait si nécessaire
        const result = { ...baseIngredients };
        Object.entries(customIngredients).forEach(([key, value]) => {
            result[key] = (result[key] || 0) + value;
        });
        return result;
    }
}

export class Cappuccino extends Coffee {
    constructor() {
        super('Cappuccino', 3.00);
    }

    getRequiredIngredients(): Ingredients {
        const baseIngredients: Ingredients = {
            coffee_beans: 20,
            water: 30,
            milk: 80
        };
        // Ajouter les ingrédients des personnalisations
        const customIngredients = super.getRequiredIngredients();
        // Fusionner les ingrédients en additionnant les quantités de lait si nécessaire
        const result = { ...baseIngredients };
        Object.entries(customIngredients).forEach(([key, value]) => {
            result[key] = (result[key] || 0) + value;
        });
        return result;
    }
}

export class CoffeeFactory {
    static createCoffee(type: 'espresso' | 'latte' | 'cappuccino'): Coffee {
        switch (type) {
            case 'espresso':
                return new Espresso();
            case 'latte':
                return new Latte();
            case 'cappuccino':
                return new Cappuccino();
            default:
                throw new Error('Invalid coffee type');
        }
    }
} 