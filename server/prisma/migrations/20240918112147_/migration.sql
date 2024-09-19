/*
  Warnings:

  - Made the column `stock_no` on table `inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "inventory" ALTER COLUMN "stock_no" SET NOT NULL;
