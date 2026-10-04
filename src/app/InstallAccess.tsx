import { useSyncExternalStore } from 'react';
import { getInstallAccess, subscribeInstall, promptInstall } from '../core/offline/install';

export function InstallAccess() {
  const access = useSyncExternalStore(subscribeInstall, getInstallAccess);
  if (access === 'native') return <button type="button" className="utilityButton installAccess" onClick={() => void promptInstall()}>Zum Home-Bildschirm hinzufügen</button>;
  if (access === 'safari') return <details className="installAccess">
    <summary>Zum Home-Bildschirm hinzufügen</summary>
    <ol>
      <li>Öffne in Safari das Seitenmenü (…) und tippe auf „Teilen“ (Quadrat mit Pfeil nach oben). Je nach Ansicht ist „Teilen“ direkt sichtbar.</li>
      <li>Scrolle zu „Zu Home-Bildschirm hinzufügen“. Fehlt der Eintrag, findest du ihn unter „Aktionen bearbeiten“.</li>
      <li>Lass „Als Web-App öffnen“ aktiviert, falls angezeigt, und tippe auf „Hinzufügen“.</li>
    </ol>
  </details>;
  return null;
}
