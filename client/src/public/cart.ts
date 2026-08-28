import type { Lang } from './i18n';
import { DICT } from './i18n';

export interface CartItem {
  id: string;
  ref: string;
  name: string;
  qty: number;
  price: string;
  image: string;
}

/** Mêmes clés que la maquette : un panier déjà rempli survit à la mise en ligne. */
const CART_KEY = 'tba.panier.v1';
const LANG_KEY = 'tba.langue';

export function loadCart(): CartItem[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) ?? 'null');
    return Array.isArray(raw) ? (raw as CartItem[]) : [];
  } catch {
    return [];
  }
}

export function saveCart(cart: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {
    /* stockage indisponible : le panier reste valable pour la visite en cours */
  }
}

export function loadLang(fallback: Lang): Lang {
  try {
    const stored = localStorage.getItem(LANG_KEY);
    if (stored && stored in DICT) return stored as Lang;
  } catch {
    /* ignoré */
  }
  return fallback;
}

export function saveLang(lang: Lang): void {
  try {
    localStorage.setItem(LANG_KEY, lang);
  } catch {
    /* ignoré */
  }
}

export function cartCount(cart: CartItem[]): number {
  return cart.reduce((n, item) => n + item.qty, 0);
}

/** Récapitulatif prérempli dans la conversation WhatsApp. */
export function orderMessage(cart: CartItem[], t: (typeof DICT)['fr']): string {
  if (cart.length === 0) return t.msgIntro + '\n\n' + t.msgEmpty;
  const lines = cart.map(
    (item, i) => `${i + 1}. ${item.ref} — ${item.name} × ${item.qty} — ${item.price}`,
  );
  return t.msgIntro + '\n\n' + lines.join('\n') + '\n\n' + t.msgOutro;
}
