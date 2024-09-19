/*
  Warnings:

  - You are about to drop the column `timgUrl` on the `category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "category" DROP COLUMN "timgUrl",
ADD COLUMN     "cat_timg_url" TEXT;

-- AlterTable
ALTER TABLE "customer" ADD COLUMN     "profile_img_url" TEXT;

-- AlterTable
ALTER TABLE "product_variation" ADD COLUMN     "prod_var_timg_url" TEXT;

-- AlterTable
ALTER TABLE "seller" ADD COLUMN     "profile_img_url" TEXT,
ALTER COLUMN "phone_no" DROP NOT NULL;
