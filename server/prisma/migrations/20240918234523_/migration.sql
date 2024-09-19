/*
  Warnings:

  - Added the required column `shipping_method_id` to the `order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "order" ADD COLUMN     "shipping_method_id" INTEGER NOT NULL,
ALTER COLUMN "discount" DROP NOT NULL,
ALTER COLUMN "discount" SET DEFAULT 0;
