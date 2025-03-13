# Generic CORS Proxy for Cloudflare Workers

## Objective
Create a generic CORS proxy in Go, deployable on Cloudflare Workers via their Workers for Platforms service, enabling CORS bypass for various types of HTTP requests.

## Technical Specifications

### Technologies
- **Language**: Go
- **Configuration**: YAML + Environment Variables

### Key Points
1. **Performance**: Fast execution, response time < 100ms
2. **Security**: Protection against common attacks
3. **Reliability**: Robust error handling
4. **Maintenance**: Clear and well-documented code

## Features

### 1. Base Proxy
- Main endpoint: `/proxy`
- URL parameters:
  ```
  /proxy?url=URL
  ```
- Support for all standard HTTP methods
- Relevant header forwarding
- Body preservation for POST/PUT
- Timeout management

### 2. Security
- Allowed domains whitelist
- URL validation
- Automatic security headers
- Protection against:
  - Unauthorized domain injection
  - Denial of service attacks
  - Malformed requests

### 3. CORS
- Configurable CORS headers:
  - Access-Control-Allow-Origin
  - Access-Control-Allow-Methods
  - Access-Control-Allow-Headers
  - Access-Control-Max-Age
- Automatic OPTIONS request handling

### 4. Monitoring
- Structured logging
- Cloudflare metrics:
  - Latency
  - Error rate
  - Requests per minute
  - Status codes

## Project Structure

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

## Implementation Steps

### Phase 1: Initial Setup
1. Create new Go project
2. Configure Cloudflare Workers environment
3. Set up CI/CD with GitHub Actions

### Phase 2: Core Development
1. Implement base proxy handler
2. Add URL validation
3. Configure CORS headers
4. Set up error handling

### Phase 3: Security
1. Implement domain whitelist
2. Add request validation
3. Configure security headers
4. Set up rate limiting

### Phase 4: Testing and Documentation
1. Write unit tests
2. Add integration tests
3. Document API
4. Create usage examples

### Phase 5: Deployment
1. Configure wrangler.toml
2. Set up deployment pipeline
3. Test in production
4. Monitor performance

## Usage

### JavaScript Example
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

### Radio Example
```javascript
const metadata = await fetchWithProxy(
  'https://radio.rtbf.be/c21/mp3-160/me',
  { method: 'HEAD' }
);
```

## Deployment

### Prerequisites
1. Cloudflare Workers account
2. wrangler CLI installed
3. Go 1.21 or higher

### Commands
```bash
# Local development
wrangler dev

# Deployment
wrangler deploy
```

## Monitoring and Maintenance

### Monitoring
- Use Cloudflare Analytics
- Configure alerts for:
  - High error rate
  - Abnormal latency
  - Excessive usage

### Maintenance
- Regular dependency updates
- Periodic review of allowed domains
- Limit adjustments based on usage

## Limitations
- Maximum request size: 100MB
- Maximum timeout: 30 seconds
- Rate limit: based on Cloudflare plan
- Some headers may be modified by Cloudflare

## Future Enhancements
1. WebSocket support
2. Configurable caching
3. Response compression
4. Enhanced metadata format support
5. Admin interface
