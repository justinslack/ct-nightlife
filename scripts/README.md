# Geocoding Helper

This helper automatically geocodes addresses from your MDX frontmatter and adds latitude/longitude coordinates.

## Setup

1. **Install dependencies** (if not already done):

   ```bash
   pnpm install
   ```

2. **Set up Google Maps API Key** (optional but recommended):
   - Create a `.env.local` file in your project root
   - Add your Google Maps API key:

     ``` js
     GOOGLE_MAPS_API_KEY=your_api_key_here
     ```

   - If no API key is provided, the script will fallback to OpenStreetMap (free but less accurate)

## Usage

### Geocode all files

Process all MDX files in `src/content/documents/`:

```bash
pnpm run geocode
```

### Geocode a specific file

Process just one file by name:

```bash
pnpm run geocode:file one-park
# or
pnpm run geocode:file one-park.mdx
```

## How it works

The script:

1. Reads all `.mdx` files in `src/content/documents/`
2. Parses the frontmatter using `gray-matter`
3. Looks for files that have an `address` field but missing or invalid `location.lat`/`location.lng`
4. Geocodes the address using Google Maps API (with OpenStreetMap fallback)
5. Updates the frontmatter with the coordinates
6. Writes the updated content back to the file

## Example

Before:

```yaml
---
title: "One Park"
address: "One Park Road, Cape Town, South Africa, 8001"
location: 
  lat: 0
  lng: 0
---
```

After:

```yaml
---
title: "One Park"
address: "One Park Road, Cape Town, South Africa, 8001"
location: 
  lat: -33.92913021305916
  lng: 18.410936005734726
---
```

## Safety Features

- **No overwriting**: Files with existing valid coordinates (non-zero lat/lng) are skipped
- **Backup recommended**: Always commit your changes to git before running the script
- **Error handling**: Failed geocoding attempts are logged but don't stop the process
- **Rate limiting**: Small delays between API calls to be respectful to geocoding services

## Troubleshooting

- **"GOOGLE_MAPS_API_KEY environment variable is required"**: Set up your API key in `.env.local`
- **"Failed to geocode address"**: The address might be too vague or incorrect. Check the address format.
- **Rate limiting errors**: If you hit API limits, wait a few minutes and try again.

## API Services Used

1. **Google Maps Geocoding API** (primary, requires API key)
   - More accurate and reliable
   - Has usage limits and costs

2. **OpenStreetMap Nominatim** (fallback, free)
   - No API key required
   - Less accurate but sufficient for most cases
   - Has usage limits (be respectful)
