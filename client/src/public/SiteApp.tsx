import { useCallback, useEffect, useMemo, useState } from 'react';
import { CartDrawer } from './CartDrawer';
import { CatalogueSection } from './CatalogueSection';
import { Facts } from './Facts';
import { GlossarySection } from './GlossarySection';
import { Hero } from './Hero';
import { LocationSection } from './LocationSection';
import { Marquee } from './Marquee';
import { PartDetail } from './PartDetail';
import { Preloader } from './Preloader';
import { RequestForm } from './RequestForm';
import { ServicesSection } from './ServicesSection';
import { SiteFooter } from './SiteFooter';
import { SiteHeader } from './SiteHeader';
import { StageLayers } from './StageLayers';
import { StockSection } from './StockSection';
import { FloatingActions } from './FloatingActions';
import { DICT, type Lang } from './i18n';
import { cartCount, loadCart, loadLang, orderMessage, saveCart, saveLang, type CartItem } from './cart';
import { fetchCatalogue } from '../lib/catalogue';
import { supabaseConfigured } from '../lib/supabase';
import { MissingConfig } from '../MissingConfig';
import type { Catalogue, Part, Vehicle } from '../lib/types';
import { displayPrice, hasNumber } from '../lib/types';
import './site.css';

export type VehicleFilter = 'Tous' | Vehicle;

export function SiteApp() {
  const [lang, setLang] = useState<Lang>(() => loadLang('fr'));
  const [catalogue, setCatalogue] = useState<Catalogue | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [vehicle, setVehicle] = useState<VehicleFilter>('Tous');
  const [catId, setCatId] = useState('c01');
  const [query, setQuery] = useState('');

  const [cart, setCart] = useState<CartItem[]>(() => loadCart());
  const [cartOpen, setCartOpen] = useState(false);
  const [detailId, setDetailId] = useState<string | null>(null);

  const t = DICT[lang];

  useEffect(() => {
    if (!supabaseConfigured) return;
    fetchCatalogue()
      .then(setCatalogue)
      .catch((err: unknown) =>
        setLoadError(err instanceof Error ? err.message : 'catalogue indisponible'),
      );
  }, []);

  const chooseLang = useCallback((next: Lang) => {
    saveLang(next);
    setLang(next);
  }, []);

  const writeCart = useCallback((next: CartItem[]) => {
    saveCart(next);
    setCart(next);
  }, []);

  const addToCart = useCallback(
    (part: Part) => {
      const next = cart.slice();
      const at = next.findIndex((item) => item.id === part.id);
      if (at > -1) {
        next[at] = { ...next[at]!, qty: next[at]!.qty + 1 };
      } else {
        next.push({
          id: part.id,
          ref: part.ref,
          name: part.name,
          qty: 1,
          price: displayPrice(part, t.priceTbc),
          image: part.image,
        });
      }
      writeCart(next);
      // La fiche se referme : sans cela le tiroir s'ouvrirait derrière elle.
      setDetailId(null);
      setCartOpen(true);
    },
    [cart, t.priceTbc, writeCart],
  );

  const inCart = useCallback((id: string) => cart.some((item) => item.id === id), [cart]);

  /* ------------------------------------------------------------ dérivés ---- */

  const categories = catalogue ? catalogue.categories : [];
  const parts = catalogue ? catalogue.parts : [];

  const categoryName = useCallback(
    (id: string) => categories.find((c) => c.id === id)?.name ?? '',
    [categories],
  );

  const whatsappDigits = (catalogue?.settings.whatsapp ?? '').replace(/[^\d]/g, '');
  const whatsappRaw = catalogue?.settings.whatsapp ?? '';

  /** Le stock physique ne montre que les références réellement chiffrées. */
  const priced = useMemo(
    () => parts.filter((p) => hasNumber(p.priceNew) || hasNumber(p.priceUsed)),
    [parts],
  );

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parts.filter((p) => {
      if (vehicle !== 'Tous' && !p.vehicles.includes(vehicle)) return false;
      if (!q) return true;
      const haystack = `${p.name} ${p.ref} ${p.oem} ${p.fit} ${categoryName(p.catId)}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [parts, query, vehicle, categoryName]);

  const shownCats = useMemo(
    () => categories.filter((c) => vehicle === 'Tous' || c.vehicles.includes(vehicle)),
    [categories, vehicle],
  );

  const activeCatId = shownCats.some((c) => c.id === catId) ? catId : (shownCats[0]?.id ?? null);
  const searching = query.trim().length > 0;
  const rows = searching ? visible : visible.filter((p) => p.catId === activeCatId);

  const detailPart = detailId ? (parts.find((p) => p.id === detailId) ?? null) : null;
  const message = orderMessage(cart, t);

  if (!supabaseConfigured) return <MissingConfig />;

  return (
    <div className="s-root">
      <Preloader t={t} />
      <StageLayers />

      <SiteHeader t={t} lang={lang} onLang={chooseLang} />
      <Hero t={t} />
      <Marquee />

      <section id="univers" className="s-section s-section--first">
        <div className="s-wrap">
          <div className="s-head">
            <span className="s-kicker">{t.kUnivers}</span>
            <h2 className="s-h2">{t.universTitle}</h2>
          </div>
          <div className="s-univers">
            {(['Auto', 'Camion', 'Moto', 'Bateau'] as Vehicle[]).map((v, i) => (
              <a
                key={v}
                href="#catalogue"
                className="s-univers__card"
                onClick={() => {
                  setVehicle(v);
                  setQuery('');
                }}
              >
                <div className="s-univers__top">
                  <span>UNIV-0{i + 1}</span>
                  <span className="s-univers__count">
                    {parts.filter((p) => p.vehicles.includes(v)).length} {t.refsWord}
                  </span>
                </div>
                <div className="s-univers__body">
                  <h3 className="s-univers__name">{t.veh[v]}</h3>
                  <p className="s-univers__text">{t.univDesc[v]}</p>
                  <span className="s-univers__link">{t.filterCat}</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <Facts t={t} />

      {priced.length > 0 ? (
        <StockSection
          t={t}
          products={priced}
          total={parts.length}
          categoryName={categoryName}
          inCart={inCart}
          onAdd={addToCart}
          onOpen={(part) => setDetailId(part.id)}
        />
      ) : null}

      <CatalogueSection
        t={t}
        loading={!catalogue}
        categories={shownCats}
        visible={visible}
        rows={rows}
        activeCatId={activeCatId}
        vehicle={vehicle}
        query={query}
        totalParts={parts.length}
        searching={searching}
        categoryName={categoryName}
        inCart={inCart}
        onVehicle={(v) => setVehicle(v)}
        onCategory={(id) => {
          setCatId(id);
          setQuery('');
        }}
        onQuery={setQuery}
        onAdd={addToCart}
        onOpen={(part) => setDetailId(part.id)}
      />

      <GlossarySection t={t} />
      <ServicesSection t={t} />
      <LocationSection t={t} />
      <RequestForm t={t} whatsappDigits={whatsappDigits} />

      <SiteFooter t={t} whatsappDigits={whatsappDigits} whatsappRaw={whatsappRaw} />

      <FloatingActions
        t={t}
        count={cartCount(cart)}
        whatsappDigits={whatsappDigits}
        whatsappRaw={whatsappRaw}
        onOpenCart={() => setCartOpen(true)}
      />

      {detailPart ? (
        <PartDetail
          t={t}
          part={detailPart}
          categoryName={categoryName(detailPart.catId)}
          inCart={inCart(detailPart.id)}
          onAdd={() => addToCart(detailPart)}
          onClose={() => setDetailId(null)}
        />
      ) : null}

      {cartOpen ? (
        <CartDrawer
          t={t}
          cart={cart}
          message={message}
          whatsappDigits={whatsappDigits}
          onChange={writeCart}
          onClose={() => setCartOpen(false)}
        />
      ) : null}

      {loadError ? <div className="s-error">{loadError.toUpperCase()}</div> : null}
    </div>
  );
}
