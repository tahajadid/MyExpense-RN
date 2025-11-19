import { CategoryType, ExpenseCategoriesType } from '@/types';
import * as Icons from 'phosphor-react-native';

export const expenseCategories: ExpenseCategoriesType = {
    groceries: {
        label: "Groceries",
        value: "groceries",
        icon: Icons.ShoppingCart,
        bgColor: "#4b5563"
    },
    rent: {
        label: "Rent",
        value: "rent",
        icon: Icons.HouseLine,
        bgColor: "#075563"
    },
    utilities: {
        label: "Utilities",
        value: "utilities",
        icon: Icons.Lightbulb,
        bgColor: "#ca8a04"
    },
    transportation: {
        label: "Transportation",
        value: "transportation",
        icon: Icons.Car,
        bgColor: "#b45509"
    },
    dining: {
        label: "Dining Out",
        value: "dining",
        icon: Icons.BowlFood,
        bgColor: "#d97706"
    },
    entertainment: {
        label: "Entertainment",
        value: "entertainment",
        icon: Icons.FilmSlate,
        bgColor: "#8b5cf6"
    },
    healthcare: {
        label: "Healthcare",
        value: "healthcare",
        icon: Icons.Heart,
        bgColor: "#dc2626"
    },
    insurance: {
        label: "Insurance",
        value: "insurance",
        icon: Icons.Anchor,
        bgColor: "#2563eb"
    },
    education: {
        label: "Education",
        value: "education",
        icon: Icons.BookOpen,
        bgColor: "#69b57d"
    },
    travel: {
        label: "Travel",
        value: "travel",
        icon: Icons.Airplane,
        bgColor: "#0284c7"
    },
    gifts: {
        label: "Gifts & Donations",
        value: "gifts",
        icon: Icons.Gift,
        bgColor: "#f97316"
    },
    other: {
        label: "Other",
        value: "other",
        icon: Icons.ArrowsClockwise,
        bgColor: "#6b7280"
    }
};


export const incomeCategory: CategoryType = {
    label: "Income",
    value: "income",
    icon: Icons.CurrencyDollar,
    bgColor: "#16a34a"
}

export const transactionTypes = [
    {label: "Expense", value: "expense"},
    {label: "Income", value: "income"},
]