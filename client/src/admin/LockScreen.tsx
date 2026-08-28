import { useState, type FormEvent } from 'react';
import logo from '../assets/logo-tba.png';
import { PUBLIC_PATH } from '../lib/routes';

export interface UnlockError {
  /** Ce qu'il faut corriger, en clair. */
  message: string;
  /** Le message brut de Supabase, pour lever les derniers doutes. */
  detail?: string;
}

interface Props {
  onUnlock: (password: string) => Promise<UnlockError | null>;
}

const DEFAULT_MESSAGE = 'ACCÈS RÉSERVÉ À LA GESTION DU CATALOGUE.';

export function LockScreen({ onUnlock }: Props) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState<UnlockError | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    const failure = await onUnlock(password);
    setBusy(false);
    if (failure) {
      setError(failure);
      return;
    }
    setPassword('');
    setError(null);
  }

  return (
    <div className="lock">
      <div className="lock__bar">
        <span>// ACCÈS RESTREINT — ADMINISTRATION DU CATALOGUE</span>
        <a href={PUBLIC_PATH}>← RETOUR AU SITE PUBLIC</a>
      </div>

      <div className="lock__body">
        <img className="lock__logo" src={logo} alt="Thunder Bay Auto" />
        <h1 className="lock__title">
          Espace
          <br />
          <em>administrateur</em>
        </h1>

        <form className="lock__form" onSubmit={submit}>
          <label className="lock__field">
            <span className="field-label">MOT DE PASSE</span>
            <input
              className="underline-input lock__input"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(null);
              }}
              placeholder="••••••••••••"
              autoFocus
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn-red lock__submit" disabled={busy}>
            {busy ? 'Vérification…' : 'Déverrouiller'}
          </button>
        </form>

        <div className={'lock__message' + (error ? ' lock__message--error' : '')}>
          {error ? error.message : DEFAULT_MESSAGE}
        </div>
        {error?.detail ? <div className="lock__detail">Supabase : {error.detail}</div> : null}
      </div>

      <div className="lock__footer">THUNDER BAY AUTO — 520 SQUIER ST, THUNDER BAY, ON</div>
    </div>
  );
}
