import { useEffect, useRef, useState } from 'react';
import type { Catalogue } from '../lib/types';

interface Props {
  catalogue: Catalogue | null;
  onSaveWhatsapp: (value: string) => void;
}

const SAVE_DEBOUNCE_MS = 500;

export function SettingsView({ catalogue, onSaveWhatsapp }: Props) {
  const stored = catalogue ? catalogue.settings.whatsapp : '';
  const [draft, setDraft] = useState<string | null>(null);
  const value = draft ?? stored;

  const timer = useRef<number | null>(null);
  const saveRef = useRef(onSaveWhatsapp);
  saveRef.current = onSaveWhatsapp;

  useEffect(() => {
    if (draft !== null && draft === stored) setDraft(null);
  }, [draft, stored]);

  useEffect(() => {
    const pending = timer;
    return () => {
      if (pending.current !== null) clearTimeout(pending.current);
    };
  }, []);

  function edit(next: string) {
    setDraft(next);
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = window.setTimeout(() => saveRef.current(next), SAVE_DEBOUNCE_MS);
  }

  const digits = value.replace(/[^\d]/g, '');
  const link = digits ? 'https://wa.me/' + digits : '';

  return (
    <main className="main">
      <div className="main__inner main__inner--narrow">
        <div className="settings-head">
          <span className="kicker">// COORDONNÉES PUBLIQUES</span>
          <h1 className="page-title">Réglages du site</h1>
        </div>

        <div className="settings-panel">
          <label className="settings-field">
            <span className="field-label">NUMÉRO WHATSAPP</span>
            <input
              className="underline-input"
              type="text"
              value={value}
              onChange={(e) => edit(e.target.value)}
              onBlur={(e) => {
                if (timer.current !== null) clearTimeout(timer.current);
                onSaveWhatsapp(e.target.value);
              }}
              placeholder="+1 548 258 2104"
              inputMode="tel"
            />
            <span className="settings-hint">
              Format international, indicatif compris. Le bouton flottant et le pied de page du site
              public ouvrent la conversation sur ce numéro.
            </span>
          </label>

          <div className="settings-preview">
            <span className="field-label">APERÇU DU LIEN</span>
            <a href={link || '#'} target={link ? '_blank' : undefined} rel="noreferrer">
              {link ||
                'AUCUN NUMÉRO ENREGISTRÉ — LE BOUTON RENVOIE VERS LE FORMULAIRE DE DEMANDE'}
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
