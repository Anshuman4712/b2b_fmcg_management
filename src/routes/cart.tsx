import { useState } from "react";
import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Check, ChevronRight, Clock3, Minus, Plus, ShieldCheck, Smartphone, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BottomNav } from "@/routes/index";
import { formatMoney, shopProducts, useShopCart } from "@/lib/shop-cart";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Cart — Apni Dukan" },
      { name: "description", content: "Review your Apni Dukan wholesale cart, choose payment, and place an order above the ₹2,000 minimum." },
      { property: "og:title", content: "Cart — Apni Dukan" },
      { property: "og:description", content: "Review wholesale items, payment options, delivery slot, and the minimum order check." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const { cart, cartCount, cartTotal, changeQuantity, clearCart } = useShopCart();
  const [payment, setPayment] = useState("UPI at delivery");
  const [slot, setSlot] = useState("Morning · 8–11 AM");
  const [notice, setNotice] = useState("");
  const minimumRemaining = Math.max(0, 2001 - cartTotal);
  const canCheckout = cartTotal > 2000;
  const items = shopProducts.filter((product) => (cart[product.id] ?? 0) > 0);

  const placeOrder = () => {
    if (!canCheckout) return;
    setNotice(`Order placed with ${payment}. GST invoice will be ready after dispatch.`);
    clearCart();
  };

  return <main className="min-h-screen bg-app-paper font-body text-app-ink"><div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-app-paper shadow-xl sm:my-6 sm:min-h-[calc(100vh-48px)] sm:rounded-[28px] sm:ring-1 sm:ring-app-line">
    <header className="flex items-center gap-3 px-4 pb-3 pt-4"><Link to="/" aria-label="Back to home" className="grid size-9 shrink-0 place-items-center rounded-md bg-app-surface text-app-ink ring-1 ring-app-line hover:bg-app-red-soft hover:text-app-red"><ArrowLeft className="size-4" /></Link><div className="min-w-0"><div className="font-display text-xl leading-none">YOUR CART</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-app-muted">apni dukan · thakurganj, lucknow</div></div></header>
    {notice && <div role="status" className="mx-4 mb-3 flex items-start gap-2 rounded-md bg-app-green-soft px-3 py-2 text-xs font-semibold text-app-green"><Check className="mt-0.5 size-4 shrink-0" />{notice}</div>}
    {items.length === 0 && !notice ? <EmptyCart /> : <section className="flex-1 px-4 pb-32"><div className="flex items-end justify-between"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-red">ORDER SUMMARY</div><h1 className="mt-2 font-display text-3xl leading-none">Check, then pay.</h1></div><span className="font-mono text-xs text-app-muted">{cartCount} items</span></div>
      <div className="mt-4 space-y-2">{items.map((product) => <CartRow key={product.id} product={product} quantity={cart[product.id] ?? 0} onAdd={() => changeQuantity(product.id, 1)} onRemove={() => changeQuantity(product.id, -1)} />)}</div>
      <div className={`mt-4 rounded-xl p-3 ring-1 ${canCheckout ? "bg-app-green-soft text-app-green ring-app-green/20" : "bg-app-red-soft text-app-red ring-app-red/20"}`}><div className="flex items-start gap-2"><ShieldCheck className="mt-0.5 size-5 shrink-0" /><div className="min-w-0"><div className="text-sm font-semibold">Minimum order value: more than ₹2,000</div><div className="mt-1 text-xs">{canCheckout ? "Minimum order complete. You can place this order." : `Add ${formatMoney(minimumRemaining)} more to unlock checkout.`}</div></div></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-app-surface/70"><div className={`h-full rounded-full ${canCheckout ? "w-full bg-app-green" : "bg-app-red"}`} style={{ width: `${Math.min(100, (cartTotal / 2001) * 100)}%` }} /></div></div>
      <div className="mt-4 rounded-xl bg-app-surface p-3 ring-1 ring-app-line"><div className="flex items-center justify-between text-sm"><span className="text-app-muted">Items total</span><span className="font-mono">{formatMoney(cartTotal)}</span></div><div className="mt-2 flex items-center justify-between text-sm text-app-green"><span>Scheme savings</span><span className="font-mono">−₹0</span></div><div className="mt-2 flex items-center justify-between border-t border-app-line pt-2 font-semibold"><span>Payable</span><span className="font-mono text-lg">{formatMoney(cartTotal)}</span></div></div>
      <ChoiceSection title="Payment option" icon={<Smartphone className="size-4" />} options={["UPI at delivery", "COD", "Pay later"]} selected={payment} onSelect={setPayment} />
      <ChoiceSection title="Delivery slot" icon={<Truck className="size-4" />} options={["Morning · 8–11 AM", "Evening · 4–7 PM"]} selected={slot} onSelect={setSlot} />
      <div className="mt-3 flex items-center gap-2 rounded-lg bg-app-green-soft px-3 py-2 text-xs text-app-green"><Clock3 className="size-4 shrink-0" />Free delivery · GST invoice after dispatch</div>
      <Button onClick={placeOrder} disabled={!canCheckout} className="mt-4 h-12 w-full bg-app-red text-app-surface shadow-none hover:bg-app-red/90 disabled:bg-app-line disabled:text-app-muted">{canCheckout ? "Place order" : `Add ${formatMoney(minimumRemaining)} more`} <ArrowRight className="size-4" /></Button>
    </section>}
    <BottomNav active="cart" cartCount={cartCount} />
  </div></main>;
}

function CartRow({ product, quantity, onAdd, onRemove }: { product: (typeof shopProducts)[number]; quantity: number; onAdd: () => void; onRemove: () => void }) {
  return <div className="flex gap-3 rounded-xl bg-app-surface p-3 ring-1 ring-app-line"><img src={product.image} alt={`${product.name} product`} width={512} height={512} loading="lazy" className="size-14 shrink-0 rounded-md object-cover ring-1 ring-app-line" /><div className="min-w-0 flex-1"><div className="flex items-start justify-between gap-2"><div className="min-w-0"><div className="truncate text-sm font-semibold">{product.name}</div><div className="mt-1 text-[11px] text-app-muted">{product.pack} · {formatMoney(product.buy)} each</div></div><div className="font-mono text-sm font-semibold">{formatMoney(product.buy * quantity)}</div></div><div className="mt-3 flex items-center justify-between"><span className="text-xs text-app-green">{product.margin}% margin</span><div className="flex items-center gap-1"><Button onClick={onRemove} aria-label={`Remove one ${product.name}`} variant="outline" size="icon" className="size-7 border-app-line shadow-none"><Minus className="size-3" /></Button><span className="w-7 text-center font-mono text-xs">{quantity}</span><Button onClick={onAdd} aria-label={`Add one ${product.name}`} size="icon" className="size-7 bg-app-red text-app-surface shadow-none hover:bg-app-red/90"><Plus className="size-3" /></Button></div></div></div></div>;
}

function ChoiceSection({ title, icon, options, selected, onSelect }: { title: string; icon: React.ReactNode; options: string[]; selected: string; onSelect: (option: string) => void }) {
  return <div className="mt-4"><div className="mb-2 flex items-center gap-2 text-xs font-semibold">{icon}{title}</div><div className="grid grid-cols-2 gap-2">{options.map((option) => <Button key={option} onClick={() => onSelect(option)} variant="outline" className={`h-11 border-app-line px-2 text-[11px] shadow-none ${selected === option ? "border-app-red bg-app-red-soft text-app-red" : "bg-app-surface text-app-ink"}`}>{option}</Button>)}</div></div>;
}

function EmptyCart() {
  return <section className="flex flex-1 flex-col items-center justify-center px-8 pb-32 text-center"><div className="grid size-16 place-items-center rounded-full bg-app-red-soft text-app-red"><ShoppingBagIcon /></div><h1 className="mt-4 font-display text-3xl">Cart abhi khaali hai</h1><p className="mt-2 text-sm leading-relaxed text-app-muted">Home se category choose karke apna wholesale stock cart mein add karein.</p><Button asChild className="mt-5 bg-app-red text-app-surface shadow-none hover:bg-app-red/90"><Link to="/">Shop products <ChevronRight className="size-4" /></Link></Button></section>;
}

function ShoppingBagIcon() { return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-7"><path d="M6 8h12l1 12H5L6 8Z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" /></svg>; }