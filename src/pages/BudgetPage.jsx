import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { BUDGET_KEY, parseBudget, pesos, toCentavos, totalCost } from "../lib/budget";
import "../budget.css";

const emptyItem = { name: "", quantity: "1", price: "", kind: "need" };

export default function BudgetPage() {
  const [initial] = useState(() => {
    try { return { data: parseBudget(localStorage.getItem(BUDGET_KEY)), warning: "" }; }
    catch { return { data: { budget: 0, items: [] }, warning: "Your saved budget could not be read. Changes will start a new list." }; }
  });
  const [data, setData] = useState(initial.data);
  const [budgetInput, setBudgetInput] = useState(String(initial.data.budget / 100));
  const [draft, setDraft] = useState(emptyItem);
  const [editing, setEditing] = useState(null);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");
  const [storageNotice, setStorageNotice] = useState(initial.warning);
  const [dirty, setDirty] = useState(false);
  const nameInput = useRef(null);
  const spent = totalCost(data.items);
  const remaining = data.budget - spent;
  const used = data.budget ? Math.min(100, Math.round(spent / data.budget * 100)) : spent ? 100 : 0;
  const visible = data.items.filter((item) => filter === "all" || item.kind === filter);

  useEffect(() => {
    document.title = "Peso Pocket | Budget Tracker";
    window.scrollTo(0, 0);
    return () => { document.title = "ArtheHeart | Heart Cagadas"; };
  }, []);

  useEffect(() => {
    if (!dirty) return;
    try { localStorage.setItem(BUDGET_KEY, JSON.stringify(data)); setStorageNotice(""); }
    catch { setStorageNotice("Browser storage is unavailable or full. This list will only last for this visit."); }
  }, [data, dirty]);

  function update(next) { setData(next); setDirty(true); }
  function saveBudget(event) {
    event.preventDefault();
    try { const budget = toCentavos(budgetInput); update({ ...data, budget }); setMessage(`Budget set to ${pesos(budget)}.`); }
    catch (error) { setMessage(error.message); }
  }
  function saveItem(event) {
    event.preventDefault();
    try {
      const name = draft.name.trim();
      const quantity = Number(draft.quantity);
      if (!name) throw new Error("Give your item a name.");
      if (!Number.isInteger(quantity) || quantity < 1 || quantity > 9999) throw new Error("Quantity must be a whole number from 1 to 9,999.");
      if (!editing && data.items.length >= 500) throw new Error("Your list is full. Remove an item before adding another.");
      const item = { id: editing || crypto.randomUUID(), name, quantity, price: toCentavos(draft.price), kind: draft.kind, bought: data.items.find((item) => item.id === editing)?.bought || false };
      const items = editing ? data.items.map((old) => old.id === editing ? item : old) : [...data.items, item];
      totalCost(items);
      update({ ...data, items });
      setDraft(emptyItem); setEditing(null); setMessage(`${name} ${editing ? "updated" : "added"}.`); nameInput.current.focus();
    } catch (error) { setMessage(error.message); }
  }
  function edit(item) {
    setEditing(item.id); setDraft({ name: item.name, quantity: String(item.quantity), price: (item.price / 100).toFixed(2), kind: item.kind });
    setMessage(`Editing ${item.name}.`); nameInput.current.focus(); nameInput.current.scrollIntoView({ block: "center", behavior: "smooth" });
  }
  function remove(item) {
    update({ ...data, items: data.items.filter((entry) => entry.id !== item.id) });
    if (editing === item.id) { setEditing(null); setDraft(emptyItem); }
    setMessage(`${item.name} removed. Its cost is returned to your remaining money.`);
  }

  return <div className="budget-app">
    <header className="budget-header"><Link className="pocket-brand" to="/budget-tracker"><span aria-hidden="true">₱</span>Peso Pocket</Link><Link className="portfolio-return" to="/projects">Back to portfolio</Link></header>
    <main className="budget-main" id="main-content">
      <div className="budget-intro"><p className="pocket-eyebrow">A little planning goes a long way</p><h1>Make room for<br /><em>what matters.</em></h1><p>Your needs, your wants, your pesos. Give every purchase a place.</p><span className="local-label">Saved on this device · Philippine peso</span></div>
      {storageNotice && <p className="budget-notice" role="alert">{storageNotice}</p>}
      <section className="budget-stats" aria-label="Budget overview">
        <article><span>My budget</span><strong>{pesos(data.budget)}</strong><small>Your starting amount</small></article>
        <article><span>Planned spending</span><strong>{pesos(spent)}</strong><small>{data.items.length} {data.items.length === 1 ? "item" : "items"} on your list</small></article>
        <article className={`remaining-card${remaining < 0 ? " over-budget" : ""}`}><span>{remaining < 0 ? "Over budget by" : "Money left"}</span><strong>{pesos(Math.abs(remaining))}</strong><small>{remaining < 0 ? "Try lowering a quantity or removing a want." : "A little breathing room feels good."}</small></article>
      </section>
      <div className="budget-progress"><div><span>{used}% of your budget planned</span><span>{remaining < 0 ? "Over budget" : "You’re in control"}</span></div><progress max="100" value={used} aria-label="Budget allocated" /></div>
      <div className="budget-workspace">
        <aside className="budget-forms">
          <form className="pocket-panel" onSubmit={saveBudget}><h2>Start with your budget</h2><label htmlFor="starting-budget">Available money (₱)</label><div className="budget-input-row"><input id="starting-budget" type="number" min="0" max="1000000000" step="0.01" inputMode="decimal" required value={budgetInput} onChange={(event) => setBudgetInput(event.target.value)} /><button className="pocket-button" type="submit">Set budget</button></div></form>
          <form className="pocket-panel item-form" onSubmit={saveItem}><h2>{editing ? "Edit your item" : "What’s on your list?"}</h2>
            <label htmlFor="item-name">Item name</label><input ref={nameInput} id="item-name" placeholder="e.g. School supplies" maxLength="80" required value={draft.name} onChange={(event) => setDraft({ ...draft, name: event.target.value })} />
            <div className="item-number-fields"><div><label htmlFor="item-quantity">Quantity</label><input id="item-quantity" type="number" min="1" max="9999" step="1" required value={draft.quantity} onChange={(event) => setDraft({ ...draft, quantity: event.target.value })} /></div><div><label htmlFor="item-price">Price each (₱)</label><input id="item-price" type="number" min="0" max="1000000000" step="0.01" inputMode="decimal" placeholder="0.00" required value={draft.price} onChange={(event) => setDraft({ ...draft, price: event.target.value })} /></div></div>
            <fieldset className="kind-picker"><legend>A need or a want?</legend>{["need", "want"].map((kind) => <label key={kind}><input type="radio" name="item-kind" value={kind} checked={draft.kind === kind} onChange={() => setDraft({ ...draft, kind })} /><span>{kind === "need" ? "Need · the essentials" : "Want · a little joy"}</span></label>)}</fieldset>
            <button className="pocket-button" type="submit">{editing ? "Save changes" : "Add to my list"}</button>{editing && <button className="pocket-text-button" type="button" onClick={() => { setEditing(null); setDraft(emptyItem); setMessage("Edit canceled."); }}>Cancel edit</button>}
          </form>
          <p className="budget-tip">A small habit: plan your needs first, then make space for something you love.</p>
        </aside>
        <section className="pocket-panel shopping-list" aria-labelledby="shopping-title">
          <div className="shopping-heading"><div><p className="pocket-eyebrow">One purchase at a time</p><h2 id="shopping-title">My little list</h2></div><span>{data.items.filter((item) => item.bought).length} / {data.items.length} bought</span></div>
          <div className="list-filters" aria-label="Filter shopping list">{["all", "need", "want"].map((kind) => <button type="button" key={kind} aria-pressed={filter === kind} onClick={() => setFilter(kind)}>{kind === "all" ? "Everything" : kind === "need" ? "Needs" : "Wants"}</button>)}</div>
          {!visible.length ? <div className="budget-empty"><span aria-hidden="true">₱</span><h3>{data.items.length ? "Nothing in this category yet" : "Good plans start small."}</h3><p>{data.items.length ? "Choose another filter or add an item." : "Add your first item and watch your budget take shape."}</p></div> : <ul className="budget-items">{visible.map((item) => <li key={item.id} className={item.bought ? "is-bought" : ""}>
            <input type="checkbox" aria-label={`Mark ${item.name} as bought`} checked={item.bought} onChange={() => update({ ...data, items: data.items.map((entry) => entry.id === item.id ? { ...entry, bought: !entry.bought } : entry) })} />
            <div className="budget-item-copy"><strong>{item.name}</strong><span>{item.quantity} × {pesos(item.price)} <b className={`kind-badge ${item.kind}`}>{item.kind}</b></span><div className="item-actions"><button type="button" onClick={() => edit(item)} aria-label={`Edit ${item.name}`}>Edit</button><button type="button" onClick={() => remove(item)} aria-label={`Remove ${item.name}`}>Remove</button></div></div><strong className="item-total">{pesos(item.quantity * item.price)}</strong>
          </li>)}</ul>}
          <div className="list-totals"><span>Needs <b>{pesos(totalCost(data.items.filter((item) => item.kind === "need")))}</b></span><span>Wants <b>{pesos(totalCost(data.items.filter((item) => item.kind === "want")))}</b></span></div>
          <p className="list-footnote">Every listed item is included in planned spending, even after you mark it bought.</p>
        </section>
      </div>
      <p className="budget-feedback" role="status">{message}</p>
      <footer className="budget-footer">Made with care by Heart · Your list stays in this browser.</footer>
    </main>
  </div>;
}
