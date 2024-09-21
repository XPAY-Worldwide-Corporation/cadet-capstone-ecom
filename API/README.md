```markdown
# Project Setup Guide

This guide will walk you through installing the necessary tools and setting up the backend for this project.

## Prerequisites

Make sure you have the following installed on your system:

- **Node.js**: [Download Node.js](https://nodejs.org/)
- **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/)

## Step 1: Install PostgreSQL

1. Go to the [PostgreSQL download page](https://www.postgresql.org/download/).
2. Select your operating system.
3. Click on **Download the Installer** and follow the instructions.
4. You will be redirected to [EnterpriseDB](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
5. Download and install the latest version of PostgreSQL.

## Step 2: Install NestJS CLI

To scaffold a new NestJS project, install the Nest CLI globally:

```bash
npm install -g @nestjs/cli
```

## Step 3: Create a New NestJS Project

Once Nest CLI is installed, create a new project:

```bash
nest new .
```

## Step 4: Run Prettier for Code Formatting

Ensure your code is properly formatted with Prettier by running the following command:

```bash
npm run format
```

## Step 5: Check for Outdated Packages

To see if there are any outdated npm packages in your project, run:

```bash
npm outdated
```

## Step 6: Install Prisma

Prisma will be used as the ORM for database management. To install Prisma and initialize it in your project:

```bash
npm install prisma
npx prisma init
npm install @prisma/client
```

## Step 7: Set Up the Database

After installing Prisma, set up your database with the following migration command:

```bash
npx prisma migrate dev --name init
```

## Step 8: Generate a New Resource

You can automatically create a new resource using the following command (omit test files with `--no-spec`):

```bash
nest generate resource folder_name --no-spec
```

## Step 9: Run the Backend

Start the development server using the following command:

```bash
npm run start:dev
```

---

### Additional Notes

- Make sure your PostgreSQL database is running before starting the server.
- For further details about NestJS, visit the [NestJS documentation](https://docs.nestjs.com/).
- For Prisma documentation, visit [Prisma Docs](https://www.prisma.io/docs/).
