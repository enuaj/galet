# Galet — suivi calisthenics

Application web installable (PWA) pour iPhone. Aucune dépendance, aucun serveur, aucun compte. Les données (séances, pesées, photos) restent dans le téléphone.

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Structure et styles (clair / sombre automatique) |
| `app.js` | Logique : programme, progression, flamme, graphiques, photos |
| `manifest.webmanifest` | Nom, icône, affichage plein écran |
| `sw.js` | Fonctionnement hors ligne |
| `icons/` | Icônes 180 / 192 / 512 px |

## Publier sur GitHub Pages (≈ 10 min, gratuit)

1. Crée un compte sur github.com (si tu n'en as pas).
2. **New repository** → nom `galet` → **Public** (GitHub Pages gratuit l'exige ; seul le code est public, jamais tes données) → **Create repository**.
3. Sur la page du dépôt : **Add file → Upload files**. Glisse `index.html`, `app.js`, `manifest.webmanifest`, `sw.js` et le dossier `icons` (dézippe `galet.zip` avant). **Commit changes**.
4. **Settings → Pages** → Source : *Deploy from a branch* → Branch : `main`, dossier `/ (root)` → **Save**.
5. Après 1 à 2 minutes, l'adresse s'affiche en haut de la page : `https://<ton-identifiant>.github.io/galet/`.

## Installer sur l'iPhone

1. Ouvre l'adresse dans **Safari** (l'installation passe par Safari).
2. Bouton **Partager** → **Sur l'écran d'accueil**. Si l'option « Ouvrir en tant qu'app web » apparaît, laisse-la activée → **Ajouter**.
3. Lance Galet depuis l'icône : l'app s'ouvre en plein écran, sans barre Safari, et fonctionne hors ligne.
4. Premier lancement : taille, poids du jour, niveau, jours d'entraînement.

Utilise toujours l'icône de l'écran d'accueil : Safari et l'app installée n'ont pas le même stockage.

## Sauvegarde

- Les données sont liées à l'app installée. **Supprimer l'icône supprime les données.**
- Réglages → **Exporter** (ou **Exporter + photos**) → enregistre le fichier dans Fichiers / iCloud Drive. Une fois par semaine suffit.
- Réglages → **Importer** pour restaurer (nouveau téléphone, réinstallation).

## Mettre à jour l'app

Remplace les fichiers dans GitHub (Upload files), puis incrémente `VERSION` dans `sw.js` (`galet-v1` → `galet-v2`). L'iPhone récupère la nouvelle version à l'ouverture suivante, avec connexion. Les données sont conservées.

## Rappels

Une app web installée sur iPhone ne peut pas envoyer de notification sans serveur. Pour un rappel quotidien : app **Rappels** → nouveau rappel récurrent (ex. 7 h 30 « Pesée + Galet »), ou une alarme.

## Règles du programme

**Séances** : 4 par semaine par défaut, 15–20 min, alternance
- A · Haut du corps + gainage : pompes, dips sur chaise, dos (superman), planche, gainage latéral
- B · Bas du corps + cardio : squats, fentes, pont fessier, mountain climbers, abdos

Chaque exercice a 2 à 4 variantes de difficulté (ex. pompes inclinées → genoux → classiques → pieds surélevés).

**Après chaque exercice**, l'app demande : *Totalement / Partiellement / Pas fait*.

| Réponse | Effet sur la séance suivante |
|---|---|
| Totalement | +1 répétition par série (+5 s pour les exercices tenus). Au plafond : +1 série (max 3), puis variante supérieure |
| Partiellement | Saisie de ce qui a été fait. Même cible la fois suivante ; 2 partiels d'affilée → cible −15 % |
| Pas fait | Exercice reprogrammé en tête de la séance suivante (« rattrapage »), même s'il appartient à l'autre type de séance ; 2 non faits d'affilée → cible −10 % |
| Pause > 10 jours | Toutes les cibles −15 % à la reprise |

**Encouragements** (sans réseau social) :
- Flamme 🔥 : jours d'affilée avec une séance *ou* une pesée (les jours de repos comptent si tu te pèses)
- Gels ❄️ : 1 gagné par semaine d'objectif atteint (max 2), consommé automatiquement si un jour manque
- XP et niveaux : exercice complet 10, partiel 5, séance 20 (+15 si parfaite), pesée 5, photo 15, semaine complète 50
- 16 badges, mascotte Galet, confettis en fin de séance

**Suivi** :
- Progrès : séances par semaine (12 semaines, ligne d'objectif), calendrier de régularité, courbe par exercice, historique des séances type Strava (durée, répétitions, exercices complétés, écart avec la séance précédente du même type)
- Corps : pesées + tendance (moyenne glissante 7 jours), IMC avec repères OMS (18,5 / 25 / 30), écarts 7 et 30 jours, filtres 1M à Tout
- Photos : rappel toutes les 2 semaines, comparaison côte à côte de deux dates avec le poids du jour

Les cibles restent modifiables à la main dans Réglages.
