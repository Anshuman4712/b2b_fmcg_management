import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Barcode, Bell, Check, ChevronRight, CircleHelp, Clock3, FileDown, FileText, Home, Minus, MoreHorizontal, PackageCheck, Plus, RefreshCw, Search, ShoppingBag, Smartphone, Truck, WifiOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import foamBathSoap from "@/assets/foam-bath-soap.png";
import riceOilBottle from "@/assets/rice-oil-bottle.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "TallyCart — Wholesale ordering for dukandars" },
      { name: "description", content: "Order FMCG stock faster with visible margins, bulk rates, digital hisaab, and delivery slots." },
      { property: "og:title", content: "TallyCart — Wholesale ordering for dukandars" },
      { property: "og:description", content: "Order FMCG stock faster with visible margins, bulk rates, digital hisaab, and delivery slots." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

type Tab = "home" | "orders" | "ledger" | "more";
type Product = { id: string; name: string; sku: string; mrp: number; buy: number; margin: number; slab: string; image: string; cases: number };

const products: Product[] = [
  { id: "soap", name: "Foam Bath 100g", sku: "HSA-100g", mrp: 50, buy: 45, margin: 10, slab: "6–20 cases · ₹425/case", image: foamBathSoap, cases: 12 },
  { id: "oil", name: "Rice Oil 1L", sku: "HSA-1L", mrp: 120, buy: 105, margin: 14, slab: "5–12 cases · ₹800/case", image: riceOilBottle, cases: 4 },
];

const ledgerRows = [
  { id: "HS-4390", date: "18 Jun 2026", detail: "12 cases · UPI at delivery", amount: "₹18,400", status: "Due in 4 days", tone: "due" },
  { id: "HS-4372", date: "11 Jun 2026", detail: "8 cases · Cash received", amount: "₹9,150", status: "Paid", tone: "paid" },
  { id: "HS-4351", date: "04 Jun 2026", detail: "20 cases · Credit terms", amount: "₹12,720", status: "Overdue", tone: "overdue" },
];

function money(value: number) {
  return `₹${value.toLocaleString("en-IN")}`;
}

function Index() {
  const [tab, setTab] = useState<Tab>("home");
  const [cart, setCart] = useState<Record<string, number>>({ soap: 12, oil: 4 });
  const [search, setSearch] = useState("");
  const [showCheckout, setShowCheckout] = useState(false);
  const [notice, setNotice] = useState("");
  const [isOffline, setIsOffline] = useState(false);

  const cartCount = Object.values(cart).reduce((total, count) => total + count, 0);
  const cartTotal = products.reduce((total, product) => total + product.buy * (cart[product.id] ?? 0), 0);
  const filteredProducts = products.filter((product) => product.name.toLowerCase().includes(search.toLowerCase()) || product.sku.toLowerCase().includes(search.toLowerCase()));

  const changeQuantity = (productId: string, amount: number) => {
    setCart((current) => ({ ...current, [productId]: Math.max(0, (current[productId] ?? 0) + amount) }));
  };

  const announce = (message: string) => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 2400);
  };

  const repeatOrder = () => {
    setCart({ soap: 12, oil: 4 });
    announce("Last week’s order added to cart");
  };

  return (
    <main className="min-h-screen bg-app-paper font-body text-app-ink">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden bg-app-paper shadow-xl sm:my-6 sm:min-h-[calc(100vh-48px)] sm:rounded-[28px] sm:ring-1 sm:ring-app-line">
        <header className="rise-in flex items-center justify-between px-4 pb-2 pt-4" style={{ animationDelay: "30ms" }}>
          <div className="flex min-w-0 items-center gap-2">
            <div className="grid size-9 shrink-0 place-items-center bg-app-red text-lg leading-none text-app-surface font-display">T</div>
            <div className="min-w-0">
              <div className="truncate font-display text-lg leading-none tracking-wide">TALLYCART</div>
              <div className="mt-1 font-mono text-[9px] uppercase tracking-[0.18em] text-app-muted">Sharma General Store · Delhi</div>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <Button aria-label="Notifications" variant="outline" size="icon" className="size-8 border-app-line bg-app-surface text-app-ink shadow-none hover:bg-app-red-soft hover:text-app-red"><Bell /></Button>
            <Button aria-label="Help" variant="outline" size="icon" className="size-8 border-app-line bg-app-surface text-app-ink shadow-none hover:bg-app-red-soft hover:text-app-red"><CircleHelp /></Button>
          </div>
        </header>

        {notice && <div role="status" className="mx-4 mb-2 flex items-center gap-2 rounded-md bg-app-green-soft px-3 py-2 text-xs font-semibold text-app-green"><Check className="size-4" />{notice}</div>}

        {tab === "home" && (
          <>
            <section className="rise-in px-4 pb-3" style={{ animationDelay: "70ms" }}>
              <div className="relative overflow-hidden rounded-xl bg-app-red px-4 py-3 text-app-surface shadow-lg shadow-app-red/20">
                <div className="absolute -right-8 -top-10 size-28 rounded-full border-[14px] border-app-surface/10" />
                <div className="relative grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
                  <div className="min-w-0">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-surface/70">Outstanding udhar</div>
                    <div className="mt-1 flex min-w-0 flex-wrap items-end gap-2">
                      <span className="font-display text-3xl leading-none">₹42,300</span>
                      <span className="pb-1 font-mono text-[10px] text-app-surface/80">due 28 Jun</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-[9px] uppercase tracking-widest text-app-surface/70">Next bill</div>
                    <div className="mt-0.5 text-sm font-semibold">₹18,240</div>
                  </div>
                </div>
                <div className="relative mt-3 grid grid-cols-2 gap-1.5">
                  <Button onClick={() => announce("Payment link ready for UPI") } className="h-9 bg-app-surface text-app-red shadow-none hover:bg-app-surface/90">Pay now</Button>
                  <Button onClick={() => setTab("ledger")} variant="outline" className="h-9 border-app-surface/30 bg-app-surface/10 text-app-surface shadow-none hover:bg-app-surface/20 hover:text-app-surface">View hisaab</Button>
                </div>
              </div>
            </section>

            <section className="rise-in flex items-center gap-2 px-4 pb-2" style={{ animationDelay: "120ms" }}>
              <label className="flex min-w-0 flex-1 items-center gap-2 rounded-md bg-app-surface px-3 py-2 ring-1 ring-app-line focus-within:ring-app-red">
                <Search className="size-4 shrink-0 text-app-muted" />
                <input aria-label="Search products or scan barcode" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search product or scan barcode" className="min-w-0 flex-1 bg-transparent text-xs outline-none placeholder:text-app-muted" />
                <Barcode className="size-4 shrink-0 text-app-red" />
              </label>
              <Button onClick={() => { setSearch("foam"); announce("Barcode scanned · Foam Bath found"); }} aria-label="Scan barcode" size="icon" className="size-9 bg-app-red text-app-surface shadow-none hover:bg-app-red/90"><Barcode /></Button>
            </section>

            <section className="rise-in px-4 pb-3" style={{ animationDelay: "170ms" }}>
              <div className="overflow-hidden rounded-xl bg-app-surface ring-1 ring-app-line">
                <div className="flex items-center justify-between px-3 pt-3">
                  <div className="font-display text-base tracking-wide">QUICK REORDER</div>
                  <span className="font-mono text-[10px] text-app-muted">24 items last week</span>
                </div>
                <div className="grid grid-cols-2 gap-1.5 p-3">
                  {["Soap bath · ×12", "Chai 200g · ×8", "Rice 10kg · ×6", "Oil 1L · ×4"].map((item) => <Button key={item} onClick={() => announce(`${item.split(" · ")[0]} added to cart`)} variant="outline" className="h-9 justify-between border-app-line bg-app-paper px-2.5 text-xs font-medium text-app-ink shadow-none hover:border-app-red hover:bg-app-red-soft"><span className="truncate">{item.split(" · ")[0]}</span><span className="font-mono text-[10px] text-app-red">{item.split(" · ")[1]}</span></Button>)}
                </div>
                <Button onClick={repeatOrder} className="h-10 w-full rounded-none bg-app-ink text-app-surface shadow-none hover:bg-app-ink/90"><RefreshCw className="size-4" /> Repeat last week’s order</Button>
              </div>
            </section>

            <section className="rise-in px-4 pb-2" style={{ animationDelay: "220ms" }}>
              <div className="flex items-center gap-2"><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-muted">Recommended stock</span><div className="h-px flex-1 bg-app-line" /></div>
            </section>

            <section className="app-scrollbar flex-1 space-y-2 overflow-y-auto px-4 pb-32">
              {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} quantity={cart[product.id] ?? 0} onAdd={() => changeQuantity(product.id, 1)} onRemove={() => changeQuantity(product.id, -1)} delay={280 + index * 60} />)}
              {filteredProducts.length === 0 && <div className="rounded-xl bg-app-surface p-6 text-center text-sm text-app-muted ring-1 ring-app-line">No stock found. Try another product name or barcode.</div>}
              <div className="rise-in flex items-center gap-3 rounded-xl bg-app-green-soft p-3 text-app-green ring-1 ring-app-green/20" style={{ animationDelay: "410ms" }}><PackageCheck className="size-5 shrink-0" /><span className="text-xs font-medium">Buy 10 cases Foam Bath, get 1 free — scheme auto-applied</span></div>
              <div className="grid grid-cols-2 gap-2 pt-1">
                <UtilityButton icon={<Clock3 />} label="Delivery slot" value="8–11 AM" onClick={() => announce("Morning slot selected")} />
                <UtilityButton icon={<Smartphone />} label="Pay" value="UPI / COD" onClick={() => announce("Payment options opened")} />
              </div>
            </section>
          </>
        )}

        {tab === "orders" && <OrdersView cartCount={cartCount} onRepeat={repeatOrder} onCheckout={() => setShowCheckout(true)} onDraft={() => { setIsOffline(true); announce("Draft saved for auto-sync"); }} isOffline={isOffline} />}
        {tab === "ledger" && <LedgerView onDownload={() => announce("Invoice PDF prepared") } />}
        {tab === "more" && <MoreView isOffline={isOffline} onOffline={() => { setIsOffline((value) => !value); announce(isOffline ? "Back online" : "Offline draft mode on"); }} onReturn={() => announce("Return claim started · add damaged item photo")} />}

        <div className="fixed inset-x-0 bottom-0 z-20 mx-auto w-full max-w-[430px] border-t border-app-line bg-app-paper/95 pb-3 pt-2 backdrop-blur sm:rounded-b-[28px]">
          <div className="mx-4 mb-2 flex items-center justify-between">
            <div><div className="font-mono text-[10px] uppercase tracking-widest text-app-muted">Cart · {cartCount} items</div><div className="font-display text-xl leading-none">{money(cartTotal)}</div></div>
            <Button onClick={() => setShowCheckout(true)} className="h-11 bg-app-red px-5 text-sm text-app-surface shadow-none hover:bg-app-red/90">Checkout <ArrowRight className="size-4" /></Button>
          </div>
          <nav aria-label="Main navigation" className="grid grid-cols-4 gap-1 px-4">
            <NavButton active={tab === "home"} icon={<Home />} label="Home" onClick={() => setTab("home")} />
            <NavButton active={tab === "orders"} icon={<ShoppingBag />} label="Orders" badge={cartCount > 0 ? String(cartCount) : undefined} onClick={() => setTab("orders")} />
            <NavButton active={tab === "ledger"} icon={<FileText />} label="Ledger" onClick={() => setTab("ledger")} />
            <NavButton active={tab === "more"} icon={<MoreHorizontal />} label="More" onClick={() => setTab("more")} />
          </nav>
        </div>

        {showCheckout && <CheckoutSheet total={cartTotal} onClose={() => setShowCheckout(false)} onDone={() => { setShowCheckout(false); announce("Order placed · GST invoice will be ready after dispatch"); }} />}
      </div>
    </main>
  );
}

function ProductCard({ product, quantity, onAdd, onRemove, delay }: { product: Product; quantity: number; onAdd: () => void; onRemove: () => void; delay: number }) {
  const profit = product.mrp - product.buy;
  return <article className="rise-in rounded-xl bg-app-surface p-3 ring-1 ring-app-line" style={{ animationDelay: `${delay}ms` }}>
    <div className="flex gap-3">
      <img src={product.image} alt={`${product.name} product`} width={512} height={512} loading="lazy" className="size-14 shrink-0 rounded-md object-cover ring-1 ring-app-line" />
      <div className="min-w-0 flex-1">
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-2">
          <div className="min-w-0"><div className="truncate text-sm font-semibold leading-tight">{product.name}</div><div className="mt-1 font-mono text-[10px] text-app-muted">{product.sku} · MRP {money(product.mrp)}</div></div>
          <div className="text-right"><div className="font-mono text-xs font-semibold">Buy {money(product.buy)}</div><div className="font-mono text-[10px] text-app-green">+{money(profit)} · {product.margin}%</div></div>
        </div>
        <div className="mt-2 flex min-w-0 items-center justify-between gap-2"><span className="truncate font-mono text-[10px] text-app-muted">1–5 cases · {money(product.buy * 10)}/case</span><span className="shrink-0 rounded bg-app-red-soft px-1.5 py-0.5 font-mono text-[10px] text-app-red">{product.slab}</span></div>
      </div>
    </div>
    <div className="mt-3 flex items-center justify-between border-t border-app-line pt-2"><span className="text-xs font-medium text-app-green">Seedha munafa: {money(profit)} per piece</span><div className="flex items-center gap-1"><Button onClick={onRemove} aria-label={`Remove ${product.name}`} variant="outline" size="icon" className="size-7 border-app-line shadow-none"><Minus className="size-3" /></Button><span className="w-7 text-center font-mono text-xs">{quantity}</span><Button onClick={onAdd} aria-label={`Add ${product.name}`} size="icon" className="size-7 bg-app-red text-app-surface shadow-none hover:bg-app-red/90"><Plus className="size-3" /></Button></div></div>
  </article>;
}

function OrdersView({ cartCount, onRepeat, onCheckout, onDraft, isOffline }: { cartCount: number; onRepeat: () => void; onCheckout: () => void; onDraft: () => void; isOffline: boolean }) {
  return <section className="flex-1 px-4 pb-32 pt-4"><SectionTitle eyebrow="ORDER DESK" title="Ready when you are." detail="Fast reorder, saved drafts, and delivery planning." />
    <div className="mt-5 space-y-3"><div className="rounded-xl bg-app-surface p-4 ring-1 ring-app-line"><div className="flex items-center justify-between"><div><div className="font-display text-xl">This week’s basket</div><p className="mt-1 text-xs text-app-muted">{cartCount} items ready · rates include your margin view</p></div><ShoppingBag className="size-6 text-app-red" /></div><Button onClick={onCheckout} className="mt-4 h-11 w-full bg-app-red text-app-surface shadow-none hover:bg-app-red/90">Review cart <ArrowRight className="size-4" /></Button></div><Button onClick={onRepeat} variant="outline" className="h-12 w-full justify-between border-app-line bg-app-surface text-app-ink shadow-none hover:border-app-red hover:bg-app-red-soft"><span className="flex items-center gap-2"><RefreshCw className="size-4 text-app-red" /> Repeat last week’s order</span><ChevronRight className="size-4 text-app-muted" /></Button><Button onClick={onDraft} variant="outline" className="h-12 w-full justify-between border-app-line bg-app-surface text-app-ink shadow-none hover:border-app-red hover:bg-app-red-soft"><span className="flex items-center gap-2"><WifiOff className="size-4 text-app-red" /> {isOffline ? "Offline draft saved" : "Save offline draft"}</span><span className="font-mono text-[10px] text-app-green">Auto-sync</span></Button></div>
  </section>;
}

function LedgerView({ onDownload }: { onDownload: () => void }) {
  return <section className="flex-1 px-4 pb-32 pt-4"><SectionTitle eyebrow="DIGITAL HISAAB" title="Your ledger, clear." detail="Outstanding balance, due dates, and invoice history." /><div className="mt-5 rounded-xl bg-app-red p-4 text-app-surface"><div className="font-mono text-[10px] uppercase tracking-widest text-app-surface/70">Total outstanding</div><div className="mt-1 font-display text-4xl">₹42,300</div><div className="mt-2 flex items-center justify-between text-xs text-app-surface/80"><span>Next due · 28 Jun</span><span>Credit limit · ₹75,000</span></div><div className="mt-3 h-1.5 overflow-hidden rounded-full bg-app-surface/20"><div className="h-full w-[56%] rounded-full bg-app-surface" /></div></div><div className="mt-4 flex items-center justify-between"><span className="font-display text-lg">Recent invoices</span><Button onClick={onDownload} variant="link" className="h-auto p-0 text-xs text-app-red"><FileDown className="size-4" /> Download all PDFs</Button></div><div className="mt-2 divide-y divide-app-line rounded-xl bg-app-surface px-3 ring-1 ring-app-line">{ledgerRows.map((row) => <div key={row.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-3"><div className="min-w-0"><div className="truncate text-sm font-semibold">Invoice #{row.id}</div><div className="mt-1 truncate text-[11px] text-app-muted">{row.date} · {row.detail}</div></div><div className="text-right"><div className="font-mono text-xs font-semibold">{row.amount}</div><div className={`mt-1 font-mono text-[10px] ${row.tone === "paid" ? "text-app-green" : "text-app-red"}`}>{row.status}</div></div></div>)}</div></section>;
}

function MoreView({ isOffline, onOffline, onReturn }: { isOffline: boolean; onOffline: () => void; onReturn: () => void }) {
  return <section className="flex-1 px-4 pb-32 pt-4"><SectionTitle eyebrow="SHOP TOOLS" title="More help for your counter." detail="Operations, claims, and delivery controls." /><div className="mt-5 space-y-2"><ToolRow icon={<Truck />} title="Delivery slot" detail="Morning 8 AM – 11 AM" action="Change" onClick={() => {}} /><ToolRow icon={<PackageCheck />} title="Stock freshness" detail="FEFO tracking · Warehouse 2" action="View" onClick={() => {}} /><ToolRow icon={<FileText />} title="Damaged goods" detail="Photo claim + instant credit note" action="Start" onClick={onReturn} /><ToolRow icon={<WifiOff />} title="Offline drafts" detail={isOffline ? "1 draft waiting to sync" : "Works when network is weak"} action={isOffline ? "Online" : "Enable"} onClick={onOffline} /></div></section>;
}

function CheckoutSheet({ total, onClose, onDone }: { total: number; onClose: () => void; onDone: () => void }) {
  const [payment, setPayment] = useState("UPI at delivery");
  return <div className="fixed inset-0 z-30 flex items-end justify-center bg-app-ink/30"><div className="w-full max-w-[430px] rounded-t-2xl bg-app-surface p-4 shadow-2xl"><div className="flex items-center justify-between"><div><div className="font-display text-xl">Confirm order</div><div className="font-mono text-[10px] uppercase tracking-widest text-app-muted">GST invoice after dispatch</div></div><Button onClick={onClose} aria-label="Close checkout" variant="ghost" size="icon" className="size-8"><X /></Button></div><div className="mt-4 space-y-2 rounded-xl bg-app-paper p-3 text-sm"><div className="flex justify-between"><span className="text-app-muted">Items total</span><span className="font-mono">{money(total)}</span></div><div className="flex justify-between text-app-green"><span>Trade discount · ₹10,000+</span><span className="font-mono">−₹468</span></div><div className="flex justify-between border-t border-app-line pt-2 font-semibold"><span>Payable</span><span className="font-mono">{money(Math.max(0, total - 468))}</span></div></div><div className="mt-4"><div className="mb-2 text-xs font-semibold">Payment method</div><div className="grid grid-cols-3 gap-2">{["UPI at delivery", "COD", "Pay later"].map((option) => <Button key={option} onClick={() => setPayment(option)} variant="outline" className={`h-11 border-app-line px-2 text-[11px] shadow-none ${payment === option ? "border-app-red bg-app-red-soft text-app-red" : "bg-app-surface text-app-ink"}`}>{option}</Button>)}</div></div><div className="mt-4 flex items-center gap-2 rounded-lg bg-app-green-soft px-3 py-2 text-xs text-app-green"><Clock3 className="size-4 shrink-0" /> Delivery slot reserved · Morning 8 AM – 11 AM</div><Button onClick={onDone} className="mt-4 h-12 w-full bg-app-red text-app-surface shadow-none hover:bg-app-red/90">Place order · {payment} <ArrowRight className="size-4" /></Button></div></div>;
}

function SectionTitle({ eyebrow, title, detail }: { eyebrow: string; title: string; detail: string }) { return <div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-app-red">{eyebrow}</div><h1 className="mt-2 font-display text-3xl leading-none">{title}</h1><p className="mt-2 max-w-[300px] text-sm leading-relaxed text-app-muted">{detail}</p></div>; }

function UtilityButton({ icon, label, value, onClick }: { icon: React.ReactNode; label: string; value: string; onClick: () => void }) { return <Button onClick={onClick} variant="outline" className="h-auto justify-between border-app-line bg-app-surface px-3 py-2 text-left shadow-none hover:border-app-red hover:bg-app-red-soft"><span className="flex min-w-0 items-center gap-2"><span className="text-app-red">{icon}</span><span className="min-w-0"><span className="block text-[10px] text-app-muted">{label}</span><span className="block truncate text-xs font-semibold">{value}</span></span></span><ChevronRight className="size-4 shrink-0 text-app-muted" /></Button>; }

function ToolRow({ icon, title, detail, action, onClick }: { icon: React.ReactNode; title: string; detail: string; action: string; onClick: () => void }) { return <div className="flex items-center gap-3 rounded-xl bg-app-surface p-3 ring-1 ring-app-line"><span className="grid size-9 shrink-0 place-items-center rounded-md bg-app-red-soft text-app-red">{icon}</span><div className="min-w-0 flex-1"><div className="text-sm font-semibold">{title}</div><div className="mt-1 truncate text-[11px] text-app-muted">{detail}</div></div><Button onClick={onClick} variant="link" className="h-auto shrink-0 p-0 text-xs text-app-red">{action}</Button></div>; }

function NavButton({ active, icon, label, badge, onClick }: { active: boolean; icon: React.ReactNode; label: string; badge?: string; onClick: () => void }) { return <Button onClick={onClick} variant="ghost" className={`relative h-auto flex-col gap-0.5 px-1 py-1.5 text-[10px] ${active ? "text-app-red" : "text-app-muted"} hover:bg-app-red-soft hover:text-app-red`}>{icon}<span>{label}</span>{badge && <span className="absolute right-3 top-0 grid min-w-4 place-items-center rounded-full bg-app-red px-1 font-mono text-[8px] text-app-surface">{badge}</span>}</Button>; }
