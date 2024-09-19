# Project Setup Guide

This guide will help you set up NextJS, Zustand, Axios, React Hook Form, and Zod.

## Prerequisites

- Node.js (v14 or later)
- npm

## 1. Install Shadcn

### Set Up Shadcn

1. Visit the [Shadcn Installation for Next](https://ui.shadcn.com/docs/installation/next).
2. ```bash
   npx shadcn@latest init
   ```
3. ```bash
   npx shadcn@latest init -d
   ```
4. ```bash
   Which style would you like to use? › New York
   Which color would you like to use as base color? › Zinc
   Do you want to use CSS variables for colors? › no / yes

   ```

5. You can now start adding components to your project.
   ```bash
   npx shadcn@latest add button
   ```

## 2. Setup Dependencies

### Install Zustand for state management

1. Add Zustand to your project:
   ```bash
   npm install zustand
   ```

### Install Axios for API Calls

1. Add Axios to your project:
   ```bash
   npm install axios
   ```

### Install React Hook Form for Form Handling

1. Add React Hook Form to your project:
   ```bash
   npm install react-hook-form
   ```

### Install Zod for Validation

1. Add Zod to your project:
   ```bash
   npm install zod
   ```
## 3. Run Prettier

### Format the Codebase

1. Run Prettier to format your codebase:
   ```bash
   npm run format
   ```

## 4. Check Outdated Packages

### Check for Outdated Packages

1. Use npm to check for outdated packages in your project:
   ```bash
   npm outdated
   ```

## 5. Run Frontend

### Start the Frontend Server

1. Start the frontend server in development mode:
   ```bash
   npm run dev
   ```
2. Base URL of the frontend server:
   ```bash
   http://localhost:3000/
   ```