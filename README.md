# Location Service

A NestJS module that reverse geocodes GPS coordinates into a human-readable address using the Google Maps Geocoding API.

## Folder Structure
```
src/
└── location/
    ├── location.controller.ts
    ├── location.service.ts
    ├── location.module.ts
    └── __tests__/
        ├── location.controller.spec.ts
        └── location.service.spec.ts
```

## API

### GET /location

| Param | Type   | Required | Description             |
|-------|--------|----------|-------------------------|
| lat   | number | ✅       | Latitude (-90 to 90)    |
| lon   | number | ✅       | Longitude (-180 to 180) |

**Success Response**
```json
{ "address": "Chennai, Tamil Nadu, India" }
```

## Setup

Add to your `.env`:
```
googleApiKey=YOUR_GOOGLE_MAPS_API_KEY
```

In `app.module.ts`:
```typescript
import { LocationModule } from "./location/location.module";

@Module({ imports: [LocationModule] })
export class AppModule {}
```

## Example
```
GET /location?lat=13.0827&lon=80.2707
```
```

---

### File 7 — `.env.example`
```
googleApiKey=YOUR_GOOGLE_MAPS_API_KEY_HERE
```

---

### File 8 — `.gitignore`
```
.env
.env.local
node_modules/
dist/
*.log
.DS_Store
