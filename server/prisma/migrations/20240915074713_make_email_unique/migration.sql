/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "category" ADD COLUMN     "timgUrl" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");
