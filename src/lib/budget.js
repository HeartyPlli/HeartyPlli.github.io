export const BUDGET_KEY = "peso-pocket-v1";
export const MAX_CENTS = 100000000000;

// Store integer centavos, so decimal prices never accumulate rounding errors.
export function toCentavos(value) {
  const text = String(value).trim();
  if (!/^\d+(\.\d{1,2})?$/.test(text)) throw new Error("Enter a positive peso amount with up to two decimal places.");
  const [pesos, cents = ""] = text.split(".");
  const result = Number(pesos) * 100 + Number(cents.padEnd(2, "0"));
  if (!Number.isSafeInteger(result) || result > MAX_CENTS) throw new Error("Please use an amount no larger than ₱1,000,000,000.");
  return result;
}

export function totalCost(items) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  if (!Number.isSafeInteger(total)) throw new Error("This list is too large to calculate accurately. Reduce a price or quantity.");
  return total;
}

export function parseBudget(raw) {
  if (!raw) return { budget: 0, items: [] };
  const data = JSON.parse(raw);
  if (!Number.isSafeInteger(data.budget) || data.budget < 0 || data.budget > MAX_CENTS || !Array.isArray(data.items) || data.items.length > 500) throw new Error("Invalid saved budget");
  const ids = new Set();
  for (const item of data.items) {
    if (!item || typeof item.id !== "string" || ids.has(item.id) || typeof item.name !== "string" || !item.name.trim() || item.name.length > 80 || !Number.isInteger(item.quantity) || item.quantity < 1 || item.quantity > 9999 || !Number.isSafeInteger(item.price) || item.price < 0 || item.price > MAX_CENTS || !["need", "want"].includes(item.kind) || typeof item.bought !== "boolean") throw new Error("Invalid saved item");
    ids.add(item.id);
  }
  totalCost(data.items);
  return { budget: data.budget, items: data.items };
}

export const pesos = (cents) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(cents / 100);
