import { useState, type FormEvent } from 'react';
import { ChapterHead } from './Chapter';
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

    const message =
      t.reqIntro + '\n\n' + (lines.length ? lines.join('\n') : '—') + '\n\n' + t.reqOutro;
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
    <section id="recherche" className="band band--request">
      <div className="hold">
        <ChapterHead
          index="07"
          kicker={t.kSearch}
          title={
            <>
              {t.searchT1} {t.searchT2} <em>{t.searchT3}</em>
            </>
          }
          aside={<p className="chapter__desc">{t.searchLead}</p>}
        />

        <form className="form" onSubmit={submit}>
          {t.fields.map(([label, placeholder], i) => (
            <label key={label} className="field">
              <span className="field__label">{label}</span>
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

          <label className="field field--wide">
            <span className="field__label">{t.partWanted}</span>
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

          <div className="form__foot">
            <span className="tag">{t.formNote}</span>
            <button type="submit" className="btn btn--red">
              {sent ? t.submitDone : whatsappDigits ? t.submitWa : t.submitIdle}
              <i className="btn__arrow">→</i>
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
