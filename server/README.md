# Project Setup Guide

This guide will help you set up PostgreSQL, NestJS, Prisma, and Jest with snapshot testing for unit tests.

## Prerequisites

- Node.js (v14 or later)
- npm

## 1. Install PostgreSQL

### Download PostgreSQL

1. Visit the [PostgreSQL Downloads](https://www.postgresql.org/download/) page.
2. Select your operating system family.
3. Click the "Download the Installer" link.
4. You will be redirected to [EnterpriseDB Downloads](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads).
5. Choose the latest PostgreSQL version and download the installer.

### Install PostgreSQL

1. Run the downloaded installer.
2. Follow the setup instructions to complete the installation.

## 2. Install NestJS

### Install the NestJS CLI

1. Install the NestJS CLI globally:
   ```bash
   npm install -g @nestjs/cli
   ```

### Create a New NestJS Project

1. Initialize a new NestJS project:
   ```bash
   nest new your-project-name
   ```

## 3. Run Resource NestJS

### Generate a New Resource

1. Use the NestJS CLI to generate a new resource (e.g., a module, controller, or service):
   ```bash
   nest generate resource your-resource-name
   ```

## 4. Run Prettier

### Format the Codebase

1. Run Prettier to format your codebase:
   ```bash
   npm run format
   ```

## 5. Check Outdated Packages

### Check for Outdated Packages

1. Use npm to check for outdated packages in your project:
   ```bash
   npm outdated
   ```

## 6. Install Prisma

### Install Prisma CLI

1. Add Prisma CLI to your project:
   ```bash
   npm install prisma --save-dev
   ```

### Initialize Prisma

1. Initialize Prisma in your project:
   ```bash
   npx prisma init
   ```

### Install Prisma Client and Studio

1. Install Prisma Client:

   ```bash
   npm install @prisma/client
   ```

2. (Optional) Install Prisma Studio:
   ```bash
   npm install @prisma/studio --save-dev
   ```

## 7. Set Up the Database

### Run Prisma Migrations

1. Create and apply database migrations:
   ```bash
   npx prisma migrate dev --name your_migration_name
   ```

### Seed the Database

1. Seed the database with initial data:
   ```bash
   npx prisma db seed
   ```

### Open Prisma Studio

1. Open Prisma Studio to interact with your database:
   ```bash
   npx prisma studio
   ```

### Generate Prisma Client

1. Generate the Prisma Client to use in your application:
   ```bash
   npx prisma generate
   ```

## 8. Run Backend

### Start the Backend Server

1. Start the backend server in development mode:
   ```bash
   npm run start:dev
   ```

## 9. Jest Snapshot Testing

### Run Jest with Snapshot Testing

1. Run Jest to perform unit tests with snapshot testing:

   ```bash
   npm test -- -u
   ```

## 10. Postman Setup

#### Variables Use

**URI:**

```bash
http://localhost:4000/

```

**V1:**

```bash
api/v1/

```

### Before using postman make a role first

**Merchant:**

```bash
{
    "roleName":"Merchant"
}

```

**Customer:**

```bash
{
    "roleName":"Customer"
}

```
