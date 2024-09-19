/*
  Warnings:

  - You are about to drop the column `prod_height` on the `product` table. All the data in the column will be lost.
  - You are about to drop the column `prod_width` on the `product` table. All the data in the column will be lost.
  - Added the required column `prod_height` to the `product_variation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `prod_width` to the `product_variation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "prod_height",
DROP COLUMN "prod_width";

-- AlterTable
ALTER TABLE "product_variation" ADD COLUMN     "prod_height" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "prod_width" DECIMAL(10,2) NOT NULL;
