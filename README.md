# Next.js — Client-Side vs Server-Side Rendering

## React vs Next.js

React is mainly a UI library, while Next.js is a React framework that provides features such as Server Components, Client Components, Server-Side Rendering (SSR), file-based routing, backend/API functionality, SEO support, and performance optimizations.

---

## React — Client-Side Rendering

In a typical React + Vite application, components run in the browser by default.

```text
Browser
   ↓
Downloads JavaScript
   ↓
React runs
   ↓
React generates the UI
```

The initial HTML can be very minimal
Example:

        <div id="root"></div>
        <script src="app.js"></script>

React then executes JavaScript in the browser and generates the actual UI.

## Next.js — Server Components

In the Next.js App Router, components are Server Components by default.

    export default function Page() {
        return <h1>Hello World</h1>;
    }

Next.js can render this component on the server and send HTML containing the actual page content to the browser.

```text 
Browser
   ↓
Request
   ↓
Next.js Server
   ↓
React Component rendered
   ↓
HTML generated
   ↓
Browser
```
For example, the browser can receive:

    <h1>Hello World</h1>
    <p>This content is already present in the HTML.</p>


# When to Use "use client"

By default, Next.js components are Server Components.
If a component needs client-side interactivity, add: "use client" at the top of the file.

Example:
    "use client";

    export default function Button() {
        function handleClick() {
            console.log("Clicked!");
        }
        return (
            <button onClick={handleClick}>
            Click me
            </button>
        );
    }

## "use client" is generally required when using:
    onClick
    onChange
    useState
    useEffect
    useRef
    Browser APIs such as window or localStorage


Easy Rule
```text 
No client-side interaction
        ↓
Server Component
        ↓
No "use client"

Client-side interaction/state
        ↓
Client Component
        ↓
"use client"
```

Don't add "use client" to every component. Use it only when the component actually needs client-side functionality.

# How Next.js Helps with SEO

One important advantage of server rendering is that Next.js can send HTML that already contains the page's meaningful content.

React + Vite

The initial HTML can be:

    <div id="root"></div>
    <script src="app.js"></script>

Then:
```text
    JavaScript
        ↓
    React
        ↓
    Actual page content
    Next.js
```

Next.js can generate the HTML on the server:

    <h1>Best Programming Courses</h1>
    <p>Learn programming...</p>

Then send it to the browser.
```text
    Next.js Server
        ↓
    HTML containing page content
        ↓
    Browser / Search Engine
```

This can make it easier for search-engine crawlers to discover and understand important page content from the initial HTML.

### React applications can also be indexed by modern search engines because they can execute JavaScript. SEO is not dependent only on server rendering; metadata, content quality, semantic HTML, performance, links, structured data, etc. also matter.

# Why Does Next.js HTML Contain More Information?

Next.js does not create a different type of HTML. Both React and Next.js ultimately produce normal HTML.

The main difference is when the UI content is generated.

React + Vite
```text
Initial HTML
      ↓
Minimal HTML
      ↓
JavaScript executes
      ↓
React generates UI
```

Next.js Server Rendering
```text
Next.js Server
      ↓
Renders React Component
      ↓
HTML contains page content
      ↓
Browser receives HTML
```

### Therefore: React can generate the UI in the browser, while Next.js can generate the HTML on the server before sending it to the browser. 

# Next.js Learning – Prisma ORM and Database Integration

## Prisma ORM with Next.js

Prisma is a type-safe ORM (Object-Relational Mapper) that allows us to interact with databases using TypeScript or JavaScript instead of writing raw SQL queries.

In Next.js, Prisma can be used inside server-side code and API routes to perform database operations.

### Installing Prisma 7

```bash
npm install prisma@7
npm install @prisma/client@7
npm install @prisma/adapter-pg pg
```

Initialize Prisma:

```bash
npx prisma init
```

## Defining a Prisma Model

Models are defined in `prisma/schema.prisma`. They describe the structure of our database tables.

```prisma
generator client {
  provider = "prisma-client"
  output   = "../generated/prisma"
}

datasource db {
  provider = "postgresql"
}

model users {
  id       Int    @id @default(autoincrement())
  name     String
  email    String @unique
  password String
}
```

Here:
- `@id` defines the primary key.
- `@default(autoincrement())` automatically generates IDs.
- `@unique` ensures that duplicate values are not allowed.
- `String` and `Int` define field types.

## Prisma Migrate vs Prisma Generate

### Prisma Migrate

Updates the actual database structure according to the Prisma schema.

```bash
npx prisma migrate dev --name init
```

It creates SQL migration files and applies the changes to the database.

### Prisma Generate

Generates the type-safe Prisma Client based on the models defined in `schema.prisma`.

```bash
npx prisma generate
```

The generated client provides methods such as:

```ts
prisma.users.create()
prisma.users.findMany()
prisma.users.findUnique()
prisma.users.update()
prisma.users.delete()
```

**Difference:** Migrate updates the database, whereas Generate updates the Prisma Client used in our application.

## Connecting Prisma to PostgreSQL

Prisma 7 uses a driver adapter to establish a database connection.

```ts
import { PrismaClient } from "../../../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });
```

The database connection string is stored in `.env` and must not be committed to GitHub.

## Creating API Routes in Next.js

Next.js App Router supports API routes through `route.ts` files.

For example:

```text
app/
└── api/
    └── user/
        └── route.ts
```

This creates the API endpoint `/api/user`.

We can export HTTP methods such as `GET`, `POST`, `PUT`, `PATCH` and `DELETE`.

### POST – Create a User

```ts
export async function POST(req: NextRequest) {
  const body = await req.json();

  const user = await prisma.users.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashedPassword,
    },
  });

  return Response.json(
    { message: "User created successfully", data: user },
    { status: 201 }
  );
}
```

Here, `hashedPassword` represents the password after secure hashing, which must be performed before saving it.

### GET – Fetch Users

```ts
export async function GET() {
  const users = await prisma.users.findMany({
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return Response.json(users);
}
```

`findMany()` returns an array of database records. Using `select` ensures that sensitive fields such as passwords are not returned.

## Handling Forms in Next.js

Client Components can use React state and event handlers to handle user input.

```tsx
"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

const router = useRouter();

async function handleSubmit(
  e: React.FormEvent<HTMLFormElement>
) {
  e.preventDefault();

  await axios.post("/api/user", {
    name,
    email,
    password,
  });

  router.push("/");
}
```

- `e.preventDefault()` prevents the default form submission.
- `axios.post()` sends the form data to the API.
- `await` waits for the API request to complete.
- `router.push("/")` navigates to the home page after a successful request.

## Fetching Data in Server Components

Next.js App Router pages are Server Components by default.

We can use `async/await` to fetch data before rendering the page.

```tsx
import axios from "axios";

async function getUserData() {
  const res = await axios.get("http://localhost:3000/api/user");
  return res.data;
}

export default async function Home() {
  const users = await getUserData();

  return (
    <div className="flex flex-wrap gap-4 p-8">
      {users.map((user: {
        id: number;
        name: string;
        email: string;
      }) => (
        <div
          key={user.id}
          className="w-64 rounded border p-8"
        >
          <h2>Name: {user.name}</h2>
          <p>Email: {user.email}</p>
        </div>
      ))}
    </div>
  );
}
```

Since `findMany()` returns an array, we use `map()` to render one card for each user.

The Tailwind classes `flex`, `flex-wrap` and `gap-4` arrange the cards from left to right and wrap them onto the next row when necessary.

**Note:** In a real Next.js Server Component, we can also query Prisma directly rather than making an HTTP request to our own API.



# Prisma Singleton in Next.js

## Why Prisma Singleton?
In Next.js development, Fast Refresh can cause modules to reload multiple times.
If we create Prisma like this:

  const prisma = new PrismaClient();

every time the module is recreated, another PrismaClient instance may be created.

  PrismaClient #1
  PrismaClient #2
  PrismaClient #3
  PrismaClient #4
  ...

This is unnecessary because every PrismaClient can maintain its own database resources/connections.

A singleton pattern makes sure that we reuse the same PrismaClient instance instead of continuously creating new ones.

  Without Singleton:

  route.ts  → Prisma #1
  page.tsx  → Prisma #2
  Fast Refresh → Prisma #3
  Fast Refresh → Prisma #4


  With Singleton:

  route.ts  ─┐
            ├──→ Same Prisma #1
  page.tsx  ─┘

## Prisma Singleton Setup
Create:
  lib/
  └── prisma.ts

## Saving Prisma Globally

  if (process.env.NODE_ENV !== "production") {
    globalThis.prisma = prisma;
  }

## Why Multiple PrismaClients Are a Problem?

Multiple PrismaClients don't necessarily break the application immediately.
However, each PrismaClient can maintain its own database resources/connections.
For example:

  PrismaClient #1 → DB resources
  PrismaClient #2 → DB resources
  PrismaClient #3 → DB resources
  PrismaClient #4 → DB resources

This can cause:
- Unnecessary database connections
- Higher resource usage
- Higher memory usage
- Database connection-limit problems
- Prisma warnings during development
- Potential instability in larger applications

So we prefer:

  One shared PrismaClient
          ↓
  Reuse it
          ↓
  Better resource management