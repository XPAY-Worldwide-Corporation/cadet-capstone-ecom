/*
  Warnings:

  - You are about to drop the column `username` on the `customer` table. All the data in the column will be lost.
  - You are about to drop the column `username` on the `seller` table. All the data in the column will be lost.
  - Added the required column `username` to the `user` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_store_category_id_fkey";

-- AlterTable
ALTER TABLE "customer" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "product" ALTER COLUMN "prod_timg_Url" DROP NOT NULL,
ALTER COLUMN "store_category_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "seller" DROP COLUMN "username";

-- AlterTable
ALTER TABLE "store" ALTER COLUMN "store_timg_url" DROP NOT NULL;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "username" VARCHAR(15) NOT NULL;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_store_category_id_fkey" FOREIGN KEY ("store_category_id") REFERENCES "store_category"("id") ON DELETE SET NULL ON UPDATE CASCADE;
