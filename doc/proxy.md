# Proxy CORS Générique pour Cloudflare Workers

## Objectif
Créer un proxy CORS générique en Go, déployable sur Cloudflare Workers via leur service Workers for Platforms, permettant de contourner les restrictions CORS pour différents types de requêtes HTTP.

## Caractéristiques Techniques

### Technologies
- **Langage** : Go
- **Framework** : [workers](https://github.com/cloudflare/workers-sdk)
- **Plateforme** : Cloudflare Workers
- **Configuration** : YAML + Variables d'environnement

### Points Clés
1. **Performance** : Exécution rapide, temps de réponse < 100ms
2. **Sécurité** : Protection contre les attaques courantes
3. **Fiabilité** : Gestion des erreurs robuste
4. **Maintenance** : Code clair et bien documenté

## Fonctionnalités

### 1. Proxy de Base
- Endpoint principal : `/proxy`
- Paramètres URL :
  ```
  /proxy?url=<URL_encodée>&method=<GET|POST|etc>&timeout=<durée>
  ```
- Support de toutes les méthodes HTTP standards
- Transmission des headers pertinents
- Préservation du body pour POST/PUT
- Gestion des timeouts

### 2. Sécurité
- Liste blanche de domaines autorisés
- Rate limiting par IP (via Cloudflare)
- Validation des URLs
- Headers de sécurité automatiques
- Protection contre :
  - Injection de domaines non autorisés
  - Attaques par déni de service
  - Requêtes malformées

### 3. CORS
- Headers CORS configurables :
  - Access-Control-Allow-Origin
  - Access-Control-Allow-Methods
  - Access-Control-Allow-Headers
  - Access-Control-Max-Age
- Gestion automatique des requêtes OPTIONS

### 4. Monitoring
- Logs structurés
- Métriques Cloudflare :
  - Latence
  - Taux d'erreur
  - Requêtes par minute
  - Status codes

## Structure du Projet

```
proxy/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── cmd/
│   └── worker/
│       └── main.go
├── internal/
│   ├── config/
│   │   └── config.go
│   ├── handler/
│   │   └── proxy.go
│   ├── middleware/
│   │   ├── cors.go
│   │   └── security.go
│   └── validator/
│       └── url.go
├── config/
│   └── config.yaml
├── wrangler.toml
├── go.mod
└── README.md
```

## Configuration

### config.yaml
```yaml
security:
  allowed_domains:
    - "*.rtbf.be"
    - "*.radiomeuh.com"
    - "*.streamabc.net"
  
cors:
  allowed_origins:
    - "http://localhost:*"
    - "http://127.0.0.1"
    - "https://*.dppst.com"
  allowed_methods:
    - "GET"
    - "HEAD"
    - "OPTIONS"
  max_age: 3600

worker:
  memory_limit: "128MB"
  timeout: 30s
```

## Étapes de Réalisation

### Phase 1 : Setup Initial
1. Créer un nouveau projet Go
2. Configurer l'environnement Cloudflare Workers
3. Mettre en place la CI/CD avec GitHub Actions

### Phase 2 : Développement Core
1. Implémenter le handler de proxy de base
2. Ajouter la validation des URLs
3. Configurer les headers CORS
4. Mettre en place la gestion des erreurs

### Phase 3 : Sécurité
1. Implémenter la liste blanche de domaines
2. Ajouter la validation des requêtes
3. Configurer les headers de sécurité
4. Mettre en place le rate limiting

### Phase 4 : Tests et Documentation
1. Écrire les tests unitaires
2. Ajouter les tests d'intégration
3. Documenter l'API
4. Créer des exemples d'utilisation

### Phase 5 : Déploiement
1. Configurer wrangler.toml
2. Mettre en place le pipeline de déploiement
3. Tester en production
4. Monitorer les performances

## Utilisation

### Exemple en JavaScript
```javascript
async function fetchWithProxy(url, options = {}) {
  const proxyUrl = 'https://proxy.workers.dev/proxy';
  const params = new URLSearchParams({
    url: encodeURIComponent(url),
    method: options.method || 'GET',
    timeout: options.timeout || '30'
  });

  return fetch(`${proxyUrl}?${params}`, {
    headers: options.headers
  });
}
```

### Exemple pour les Radios
```javascript
const metadata = await fetchWithProxy(
  'https://radio.rtbf.be/c21/mp3-160/me',
  { method: 'HEAD' }
);
```

## Déploiement

### Prérequis
1. Compte Cloudflare Workers
2. wrangler CLI installé
3. Go 1.21 ou supérieur

### Commandes
```bash
# Développement local
wrangler dev

# Déploiement
wrangler deploy
```

## Monitoring et Maintenance

### Surveillance
- Utiliser Cloudflare Analytics
- Configurer des alertes sur :
  - Taux d'erreur élevé
  - Latence anormale
  - Utilisation excessive

### Maintenance
- Mises à jour régulières des dépendances
- Revue périodique des domaines autorisés
- Ajustement des limites selon l'usage

## Limitations
- Taille maximale des requêtes : 100MB
- Timeout maximum : 30 secondes
- Rate limit : selon le plan Cloudflare
- Certains headers peuvent être modifiés par Cloudflare

## Prochaines Évolutions Possibles
1. Support de WebSocket
2. Cache configurable
3. Compression des réponses
4. Support de plus de formats de métadonnées
5. Interface d'administration
