import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import foamBathSoap from "@/assets/foam-bath-soap.png";
import riceOilBottle from "@/assets/rice-oil-bottle.png";

export type ProductCategory = "Popular" | "Grocery" | "Personal care" | "Home care";

export type ShopProduct = {
  id: string;
  name: string;
  category: ProductCategory;
  sku: string;
  mrp: number;
  buy: number;
  margin: number;
  pack: string;
  slab: string;
  image: string;
};

export const shopProducts: ShopProduct[] = [
  { id: "soap", name: "Foam Bath Soap", category: "Personal care", sku: "APD-100G", mrp: 1200, buy: 450, margin: 14, pack: "Case of 12", slab: "6+ cases ₹425", image: foamBathSoap },
  { id: "oil", name: "Rice Bran Oil", category: "Grocery", sku: "APD-1L", mrp: 1320, buy: 840, margin: 16, pack: "Case of 12", slab: "5+ cases ₹800", image: riceOilBottle },
  { id: "tea", name: "Chai Gold 250g", category: "Grocery", sku: "APD-TEA250", mrp: 1140, buy: 980, margin: 14, pack: "Case of 12", slab: "10+ cases ₹950", image: riceOilBottle },
  { id: "detergent", name: "FreshWash Powder", category: "Home care", sku: "APD-FW1K", mrp: 1880, buy: 1480, margin: 13, pack: "Case of 6", slab: "8+ cases ₹1,420", image: foamBathSoap },
  { id: "salt", name: "Daily Salt 1kg", category: "Grocery", sku: "APD-SALT1", mrp: 420, buy: 300, margin: 15, pack: "Case of 24", slab: "10+ cases ₹285", image: riceOilBottle },
  { id: "biscuits", name: "GoodDay Biscuits", category: "Popular", sku: "APD-BISC24", mrp: 960, buy: 720, margin: 18, pack: "Case of 24", slab: "12+ cases ₹690", image: foamBathSoap },
];

type ShopCartContextValue = {
  cart: Record<string, number>;
  cartCount: number;
  cartTotal: number;
  changeQuantity: (productId: string, amount: number) => void;
  clearCart: () => void;
};

const ShopCartContext = createContext<ShopCartContextValue | null>(null);

export function ShopCartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Record<string, number>>({});
  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const cartTotal = shopProducts.reduce((total, product) => total + product.buy * (cart[product.id] ?? 0), 0);
  const value = useMemo(() => ({
    cart,
    cartCount,
    cartTotal,
    changeQuantity: (productId: string, amount: number) => setCart((current) => ({ ...current, [productId]: Math.max(0, (current[productId] ?? 0) + amount) })),
    clearCart: () => setCart({}),
  }), [cart, cartCount, cartTotal]);

  return <ShopCartContext.Provider value={value}>{children}</ShopCartContext.Provider>;
}

export function useShopCart() {
  const context = useContext(ShopCartContext);
  if (!context) throw new Error("useShopCart must be used inside ShopCartProvider");
  return context;
}

export function formatMoney(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}