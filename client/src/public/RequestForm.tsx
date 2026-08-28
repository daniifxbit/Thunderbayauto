import { useState, type FormEvent } from 'react';
import type { Dict } from './i18n';

interface Props {
  t: Dict;
  whatsappDigits: string;
}

/**
 * Fiche de demande de pièce : les champs remplis partent sur WhatsApp,
 * message prérempli dans la langue affichée.
 */
export function RequestForm({ t, whatsappDigits }: Props) {
  const [values, setValues] = useState<Record<number, string>>({});
  const [wanted, setWanted] = useState('');
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent) {
    event.preventDefault();

    const lines = t.fields
      .map(([label], i) => [label, (values[i] ?? '').trim()] as const)
      .filter(([, value]) => value)
      .map(([label, value]) => `${label} : ${value}`);
    if (wanted.trim()) lines.push(`${t.reqWantedLabel} : ${wanted.trim()}`);

    const message = t.reqIntro + '\n\n' + (lines.length ? lines.join('\n') : '—') + '\n\n' + t.reqOutro;
    setSent(true);

    if (whatsappDigits) {
      window.open(
        `https://wa.me/${whatsappDigits}?text=${encodeURIComponent(message)}`,
        '_blank',
        'noopener',
      );
    }
  }

  return (
    <section id="recherche" className="s-section">
      <div className="s-wrap s-request">
        <div>
          <span className="s-kicker">{t.kSearch}</span>
          <h2 className="s-request__title">
            {t.searchT1}
            <br />
            {t.searchT2}
            <br />
            <em>{t.searchT3}</em>
          </h2>
          <p className="s-request__lead">{t.searchLead}</p>
          <div className="s-request__fields">
            {['TYPE', 'MARQUE / MODÈLE', 'ANNÉE', 'MOTORISATION', 'VIN', 'OEM', 'ÉTAT', 'QUANTITÉ', 'LIVRAISON'].map(
              (label, i, all) => (
                <span key={label}>
                  {label}
                  {i < all.length - 1 ? <span className="s-request__sep">·</span> : null}
                </span>
              ),
            )}
          </div>
        </div>

        <form className="s-form" onSubmit={submit}>
          {t.fields.map(([label, placeholder], i) => (
            <label key={label} className="s-form__field">
              <span className="s-form__label">{label}</span>
              <input
                type="text"
                value={values[i] ?? ''}
                onChange={(e) => {
                  const value = e.target.value;
                  setValues((current) => ({ ...current, [i]: value }));
                  setSent(false);
                }}
                placeholder={placeholder}
              />
            </label>
          ))}

          <label className="s-form__field s-form__field--wide">
            <span className="s-form__label">{t.partWanted}</span>
            <textarea
              rows={3}
              value={wanted}
              onChange={(e) => {
                setWanted(e.target.value);
                setSent(false);
              }}
              placeholder={t.partWantedPh}
            />
          </label>

          <div className="s-form__foot">
            <span className="s-form__note">{t.formNote}</span>
            <button type="submit" className="s-btn s-btn--red s-btn--submit">
              {sent ? t.submitDone : whatsappDigits ? t.submitWa : t.submitIdle}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
