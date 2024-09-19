/*
  Warnings:

  - You are about to drop the column `shipping_method_id` on the `order` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "order" DROP COLUMN "shipping_method_id";
