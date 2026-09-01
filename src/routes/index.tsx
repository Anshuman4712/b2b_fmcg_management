import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Barcode, Bell, Check, ChevronRight, CircleHelp, Home, Plus, Search, ShoppingBag, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatMoney, shopProducts, useShopCart, type ProductCategory, type ShopProduct } from "@/lib/shop-cart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Apni Dukan — Wholesale ordering for Thakurganj, Lucknow" },
      { name: "description", content: "Apni Dukan helps shopkeepers in Thakurganj, Lucknow order wholesale FMCG stock with clear margins and simple payment." },
      { property: "og:title", content: "Apni Dukan — Wholesale ordering for Thakurganj, Lucknow" },
      { property: "og:description", content: "Wholesale FMCG ordering with category search, clear margins, and an easy cart for local dukandars." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: HomePage,
});

const categories: Array<"All" | ProductCategory> = ["All", "Popular", "Grocery", "Personal care", "Home care"];

function HomePage() {
  const { cart, cartCount, cartTotal, changeQuantity } = useShopCart();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<(typeof categories)[number]>("All");
  const [notice, setNotice] = useState("");
  const filteredProducts = shopProducts.filter((product) => {
    const matchesCategory = category === "All" || product.category === category;
    const matchesSearch = `${product.name} ${product.sku}`.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2200);
  };

  return <main className="min-h-screen bg-app-paper font-body text-app-ink">
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-app-paper shadow-xl sm:my-6 sm:min-h-[calc(100vh-48px)] sm:rounded-[28px] sm:ring-1 sm:ring-app-line">
      <header className="flex items-center justify-between px-4 pb-3 pt-4">
        <div className="flex min-w-0 items-center gap-2">
          <div className="grid size-9 shrink-0 place-items-center bg-app-red text-lg leading-none text-app-surface font-display">A</div>
          <div className="min-w-0"><div className="truncate font-display text-lg leading-none tracking-wide">APNI DUKAN</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-app-muted">thakurganj, lucknow</div></div>
        </div>
        <div className="flex shrink-0 items-center gap-1.5"><Button aria-label="Notifications" variant="outline" size="icon" className="size-8 border-app-line bg-app-surface text-app-ink shadow-none hover:bg-app-red-soft hover:text-app-red"><Bell /></Button><Button aria-label="Help" variant="outline" size="icon" className="size-8 border-app-line bg-app-surface text-app-ink shadow-none hover:bg-app-red-soft hover:text-app-red"><CircleHelp /></Button></div>
      </header>

      {notice && <div role="status" className="mx-4 mb-2 flex items-center gap-2 rounded-md bg-app-green-soft px-3 py-2 text-xs font-semibold text-app-green"><Check className="size-4" />{notice}</div>}

      <section className="px-4 pb-3"><div className="rounded-xl bg-app-red px-4 py-3 text-app-surface shadow-lg shadow-app-red/20"><div className="flex items-center justify-between gap-3"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-surface/70">Aaj ka wholesale rate</div><div className="mt-1 font-display text-2xl leading-none">Sasta stock, seedha munafa</div></div><Barcode className="size-8 shrink-0 text-app-surface/80" /></div><div className="mt-2 text-xs text-app-surface/80">MRP, buying rate aur profit har item par clearly dikhega.</div></div></section>

      <section className="px-4 pb-3"><label className="flex items-center gap-2 rounded-md bg-app-surface px-3 py-2.5 ring-1 ring-app-line focus-within:ring-app-red"><Search className="size-4 shrink-0 text-app-muted" /><input aria-label="Search products" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Product naam ya SKU search karein" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-app-muted" /><SlidersHorizontal className="size-4 shrink-0 text-app-red" /></label></section>

      <section className="px-4 pb-3"><div className="mb-2 flex items-center justify-between"><div className="font-display text-base tracking-wide">CATEGORY SE CHUNEIN</div><span className="font-mono text-[10px] text-app-muted">{filteredProducts.length} products</span></div><div className="app-scrollbar flex gap-2 overflow-x-auto pb-1">{categories.map((item) => <Button key={item} onClick={() => setCategory(item)} variant="outline" className={`h-8 shrink-0 rounded-full border-app-line px-3 text-xs shadow-none ${category === item ? "border-app-red bg-app-red text-app-surface hover:bg-app-red/90" : "bg-app-surface text-app-ink hover:border-app-red hover:bg-app-red-soft"}`}>{item}</Button>)}</div></section>

      <section className="flex items-center justify-between px-4 pb-2"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Available stock</span><span className="font-mono text-[10px] text-app-green">Live rates · in stock</span></section>
      <section className="app-scrollbar flex-1 space-y-2 overflow-y-auto px-4 pb-32">{filteredProducts.map((product, index) => <HomeProductCard key={product.id} product={product} quantity={cart[product.id] ?? 0} onAdd={() => { changeQuantity(product.id, 1); announce(`${product.name} cart mein add hua`); }} delay={index * 40} />)}{filteredProducts.length === 0 && <div className="rounded-xl bg-app-surface p-6 text-center text-sm text-app-muted ring-1 ring-app-line">Is category mein product nahi mila. Search badal kar dekhein.</div>}</section>

      {cartCount > 0 && <div className="fixed inset-x-0 bottom-[72px] z-10 mx-auto w-full max-w-[430px] px-4"><Link to="/cart" className="flex items-center justify-between rounded-xl bg-app-ink px-4 py-3 text-app-surface shadow-xl"><span><span className="block font-mono text-[10px] uppercase tracking-widest text-app-surface/60">Cart ready</span><span className="mt-0.5 block text-sm font-semibold">{cartCount} items · {formatMoney(cartTotal)}</span></span><span className="flex items-center gap-1 text-xs font-semibold text-app-surface">View cart <ChevronRight className="size-4" /></span></Link></div>}
      <BottomNav active="home" cartCount={cartCount} />
    </div>
  </main>;
}

function HomeProductCard({ product, quantity, onAdd, delay }: { product: ShopProduct; quantity: number; onAdd: () => void; delay: number }) {
  return <article className="rise-in rounded-xl bg-app-surface p-3 ring-1 ring-app-line" style={{ animationDelay: `${delay}ms` }}><div className="flex gap-3"><img src={product.image} alt={`${product.name} product`} width={512} height={512} loading="lazy" className="size-16 shrink-0 rounded-md object-cover ring-1 ring-app-line" /><div className="min-w-0 flex-1"><div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2"><div className="min-w-0"><div className="truncate text-sm font-semibold">{product.name}</div><div className="mt-1 font-mono text-[10px] text-app-muted">{product.pack} · {product.sku}</div></div><div className="text-right"><div className="font-mono text-sm font-semibold">{formatMoney(product.buy)}</div><div className="font-mono text-[10px] text-app-green">+{product.margin}% profit</div></div></div><div className="mt-2 flex items-center justify-between gap-2"><span className="truncate text-[11px] text-app-muted">MRP {formatMoney(product.mrp)}</span><span className="shrink-0 rounded bg-app-red-soft px-1.5 py-0.5 font-mono text-[10px] text-app-red">{product.slab}</span></div></div></div><div className="mt-3 flex items-center justify-between border-t border-app-line pt-2"><span className="text-xs font-medium text-app-green">Seedha munafa {formatMoney(product.mrp - product.buy)}</span><Button onClick={onAdd} className="h-8 bg-app-red px-3 text-xs text-app-surface shadow-none hover:bg-app-red/90"><Plus className="size-4" /> {quantity > 0 ? `Add more · ${quantity}` : "Add to cart"}</Button></div></article>;
}

export function BottomNav({ active, cartCount }: { active: "home" | "cart"; cartCount: number }) {
  return <nav aria-label="Main navigation" className="fixed inset-x-0 bottom-0 z-20 mx-auto grid w-full max-w-[430px] grid-cols-2 border-t border-app-line bg-app-paper/95 px-4 pb-3 pt-2 backdrop-blur sm:rounded-b-[28px]"><Link to="/" className={`flex flex-col items-center gap-0.5 py-1.5 text-[10px] ${active === "home" ? "text-app-red" : "text-app-muted"}`}><Home className="size-4" /><span>Home</span></Link><Link to="/cart" className={`relative flex flex-col items-center gap-0.5 py-1.5 text-[10px] ${active === "cart" ? "text-app-red" : "text-app-muted"}`}><ShoppingBag className="size-4" /><span>Cart</span>{cartCount > 0 && <span className="absolute right-[38%] top-0 grid min-w-4 place-items-center rounded-full bg-app-red px-1 font-mono text-[8px] text-app-surface">{cartCount}</span>}</Link></nav>;
}