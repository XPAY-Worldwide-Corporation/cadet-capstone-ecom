/*
  Warnings:

  - You are about to drop the column `isActive` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "isActive",
ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true;
