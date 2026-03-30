# Sanity schema for Portfolio

The portfolio page reads content of type **`portfolioItem`** from your Sanity dataset.

## Option A: Use Sanity Studio elsewhere

If you already have a Sanity project (e.g. at [sanity.io/manage](https://sanity.io/manage)), add a document type that matches this schema:

- **Type name:** `portfolioItem`
- **Fields:** `title` (string), `image` (image), `url` (optional url)

Then set in this app’s `.env.local`:

- `NEXT_PUBLIC_SANITY_PROJECT_ID` – your project ID
- `NEXT_PUBLIC_SANITY_DATASET` – e.g. `production`

## Option B: Run Sanity Studio in this repo

From the project root:

```bash
npm create sanity@latest -- --project-plan free --create-project "Dragon's Purr" --dataset production
```

When prompted, choose “Embedded studio” and point it at this repo. Then copy the generated schema into `sanity/schemas/` (or merge with the existing `portfolioItem` schema) and run the studio with:

```bash
npx sanity dev
```

Your content will be stored in the same project; ensure `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` match that project and dataset.
