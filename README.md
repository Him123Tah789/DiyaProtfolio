This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Love Page Online Storage (Vercel)

The Love page now uses online storage so `/love/edit` and `/love` stay in sync across devices.

It uses:

- Postgres (Neon or Vercel Postgres integration) for story and memories metadata.
- Vercel Blob for uploaded image files.

### Required environment variables

Use the values in `.env.example`:

- `POSTGRES_URL` (or `DATABASE_URL`)
- `BLOB_READ_WRITE_TOKEN`

### Vercel setup

1. Open your project in Vercel.
2. Add a Postgres database integration (Neon or Vercel Postgres).
3. Add Vercel Blob integration.
4. Confirm the environment variables are present in Project Settings -> Environment Variables.
5. Redeploy.

### API endpoints added

- `GET /api/love`
- `PUT /api/love/story`
- `POST /api/love/memories`
- `DELETE /api/love/memories?id=...`
- `POST /api/love/images`
- `DELETE /api/love/images?id=...`

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
