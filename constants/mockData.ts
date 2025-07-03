import { CategoryType, ExpenseCategoriesType } from '@/types';
import * as Icons from 'phosphor-react-native';

export const expenseCategories: ExpenseCategoriesType = {
    groceries: {
        label : "Groceries",
        value: "groceries",
        icon: Icons.ShoppingCart,
        bgColor: "#4b5563"
    },
    rent: {
        label : "Rent",
        value: "rent",
        icon: Icons.House,
        bgColor: "#075563"
    },
    utilities: {
        label : "Utilities",
        value: "utilities",
        icon: Icons.Lightbulb,
        bgColor: "#ca8a04"
    },
    transportation: {
        label : "Transportation",
        value: "transportation",
        icon: Icons.Car,
        bgColor: "#b45509"
    }
}

export const incomeCategory: CategoryType = {
    label: "Income",
    value: "income",
    icon: Icons.CurrencyDollarSimple,
    bgColor: "#16a34a"
}

export const transactionType = [
    {Label: "Expense", value: "expense"},
    {Label: "Income", value: "income"},
]