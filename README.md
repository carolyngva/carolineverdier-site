# Caroline Verdier Site

Mini-site statique V1 pour `carolineverdier.com`, construit d'abord autour de la page d'attente Love Blueprint.

## Pages

- `/` redirige vers `/love-blueprint`.
- `/love-blueprint` sert la page d'attente Love Blueprint via le Worker Cloudflare.
- En local avec `python3 -m http.server`, ouvrir `/love-blueprint.html` car le routage Worker n'est pas actif.

## Stack

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

État actuel : workflow créé, valide et inactif. Le node NocoDB est branché sur la table `Leads Love Blueprint`.

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
http://localhost:8791/love-blueprint.html
```

## Vérification

```bash
npm run build
```

## Déploiement restant

1. Activer le workflow n8n `ETa718jy79OLOFBf`.
2. Tester formulaire -> n8n -> NocoDB -> Mautic.
3. Déployer le Worker Cloudflare `carolineverdier-site`.
4. Retirer la redirection Cloudflare actuelle `carolineverdier.com` -> `latelierdelucette.com`.
5. Pointer `carolineverdier.com` vers ce Worker / projet.
