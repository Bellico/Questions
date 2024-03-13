This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Environment Variables

#### Create a **`.env`** file

```bash
# You can use https://neon.tech/
DATABASE_URL = "postgresql://*******"

# https://resend.com/
RESEND_API_KEY = "*******"

# For production https://next-auth.js.org/configuration/options
# Example : openssl rand -base64 32
NEXTAUTH_SECRET = "*******"

# Use for generate share link
PUBLIC_URL = "https://yourdomain.com"
```

## Local database install

#### Create a postgre database with docker

```
docker run --name postgres -e POSTGRES_DB=questions -e POSTGRES_USER=Bellico -e POSTGRES_PASSWORD=myPassWord1234 -p 5432:5432 -d postgres
```

#### Override **`.env`** with a **`.env.local`**

```bash
DATABASE_URL = "postgresql://Bellico:myPassWord1234@localhost:5432/questions"
```

#### Migrate the local database

```bash
npx prisma migrate deploy
npx prisma db seed
```

## Run project


```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.


This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

### For update prisma schema

```bash
npx prisma validate
npx prisma migrate dev --name init
(npx prisma generate)
(npx prisma db push)
(npx prisma migrate reset)
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
