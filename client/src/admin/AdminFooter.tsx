import { PUBLIC_PATH } from '../lib/routes';

interface Props {
  onLock: () => void;
}

export function AdminFooter({ onLock }: Props) {
  return (
    <footer className="footer">
      <span>THUNDER BAY AUTO — ADMINISTRATION DU CATALOGUE</span>
      <span className="footer__right">
        <button type="button" className="footer__lock" onClick={onLock}>
          VERROUILLER LA SESSION
        </button>
        <a href={PUBLIC_PATH}>← RETOUR AU SITE PUBLIC</a>
      </span>
    </footer>
  );
}
