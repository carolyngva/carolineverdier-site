# Caroline Verdier Site

Mini-site statique V1 pour `carolineverdier.com`, construit d'abord autour de la page d'attente Love Blueprint.

## Pages

- `/` présente Love School : vision, quatre enseignements, présentation de Caroline et liste d'attente. Nouvelle version locale, non publiée.
- `/love-blueprint` sert la page d'attente Love Blueprint via le Worker Cloudflare.
- `/happy-together` présente Happy Together, édition 2027, sans inscription ni paiement. Cette nouvelle page reste locale jusqu'à validation et déploiement explicites.
- En local avec `python3 -m http.server`, ouvrir `/love-blueprint.html` car le routage Worker n'est pas actif.
- Pour la maquette Happy Together, ouvrir `/happy-together.html`.

## Reprise de l'oracle (version locale)

- `/oracle-dunerivealautre` et `/oracle-dunerivealautre/` : contenu de la page actuelle de L'Atelier de Lucette, habillage Caroline Verdier. Prix public de 97 CHF, formation, livraison et lien Stripe repris sans modifier le paiement.
- `/tirage` et `/tirage/` : tirage de trois cartes distinctes parmi les 42 cartes originales ; situation, blocage, conseil et questions. Nouveau tirage, animation et audio optionnel, réduction des animations respectée.
- Aperçus sur le serveur Python : `/oracle-dunerivealautre.html` et `/tirage.html`.
- Photos, 17 témoignages, images des cartes, données originales et deux audios sont autonomes dans `assets/oracle/`. Aucun chargement ne dépend de l'ancien domaine.
- Les textes originaux des cartes sont conservés, y compris leurs formulations au féminin. Le lien final du tirage mène maintenant à la présentation de l'oracle, plutôt qu'au mini-rituel non migré.
- Aucune redirection de `latelierdelucette.com`, modification DNS ou publication effectuée. Après validation et déploiement, prévoir les redirections spécifiques des anciennes pages oracle et tirage vers leurs nouvelles URL, avant une éventuelle redirection générale.
- Avant bascule : vérifier les pages de retour et la livraison des accès après paiement Stripe, ainsi que les conditions de vente de produits physiques (les CGV actuelles Caroline Verdier portent principalement sur les prestations). Ne pas perdre les anciennes modalités de retour de l'oracle lors de la migration.

## Stack technique

- HTML statique
- CSS natif
- JavaScript natif
- Cloudflare Worker static assets

## Formulaire

Webhook prévu :

```text
https://automate.carolineverdier.com/webhook/love-blueprint-waitlist
```

Workflow n8n : `Love Blueprint Waitlist` (`ETa718jy79OLOFBf`).

État vérifié le 13 novembre 2026 : workflow actif. Le node NocoDB est branché sur la table `Leads Love Blueprint` et Mautic applique encore le tag fixe `love-blueprint-waitlist`. Aucun changement distant effectué lors de la préparation de l'accueil Love School.

Avant publication de l'accueil : adapter le classement Mautic à Love School et vérifier les éventuelles campagnes liées au tag historique. Le nouveau formulaire envoie `source: love-school-waitlist` au webhook existant, qui conserve cette valeur dans NocoDB. Son consentement et sa confirmation affichent Love School. Tester le formulaire de bout en bout après adaptation ; les tests locaux interceptent le réseau sans créer de contact réel.

Payload envoyé :

- `prenom`
- `email`
- `consentement`
- `source`
- `page_url`
- `form_location`
- UTM : `utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`

## NocoDB

Table prévue : `Leads Love Blueprint`

ID table NocoDB : `mevravap8dat7jm`

Template CSV :

```text
Second Cerveau/1 PROJETS/Lancement Love School/nocodb-template-leads-love-blueprint.csv
```

## Développement local

```bash
python3 -m http.server 8791
```

Puis ouvrir :

```text
http://localhost:8791/
```

## Vérification

```bash
npm run build
```

Le build reconstruit `dist/` depuis les fichiers source et `assets/`.

## Déploiement automatique

Le workflow GitHub Actions `.github/workflows/deploy.yml` déploie automatiquement sur Cloudflare à chaque push sur `main`.

Secrets GitHub requis :

- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

Le script `npm run deploy` lance d'abord `npm run build` via `predeploy`, puis `wrangler deploy`.

## Déploiement restant

1. Activer le workflow n8n `ETa718jy79OLOFBf`.
2. Tester formulaire -> n8n -> NocoDB -> Mautic.
3. Retirer la redirection Cloudflare actuelle `carolineverdier.com` -> `latelierdelucette.com` si elle existe encore.
4. Pointer `carolineverdier.com` vers ce Worker / projet.
