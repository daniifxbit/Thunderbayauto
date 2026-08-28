/** Affiché tant que les clés Supabase ne sont pas renseignées. */
export function MissingConfig() {
  return (
    <div className="config-screen">
      <span className="config-screen__kicker">// CONFIGURATION INCOMPLÈTE</span>
      <h1 className="config-screen__title">
        Connexion
        <br />
        <em>à Supabase</em>
      </h1>
      <p className="config-screen__text">
        Le site lit son catalogue dans Supabase. Renseignez les variables suivantes dans un fichier{' '}
        <code>.env</code> à la racine du dossier <code>client/</code>, puis relancez.
      </p>
      <ul className="config-screen__list">
        <li>
          <code>VITE_SUPABASE_URL</code> — adresse du projet
        </li>
        <li>
          <code>VITE_SUPABASE_ANON_KEY</code> — clé publique <em>anon</em>
        </li>
        <li>
          <code>VITE_ADMIN_EMAIL</code> — compte administrateur, pour l'espace de gestion
        </li>
      </ul>
      <p className="config-screen__text">
        La migration <code>supabase/migrations/0001_catalogue.sql</code> crée les tables, les
        politiques d'accès et le bucket d'images.
      </p>
    </div>
  );
}
