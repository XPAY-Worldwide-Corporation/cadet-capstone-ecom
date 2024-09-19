-- DropForeignKey
ALTER TABLE "bookmark" DROP CONSTRAINT "bookmark_customer_id_fkey";

-- DropForeignKey
ALTER TABLE "bookmark_item" DROP CONSTRAINT "bookmark_item_bookmark_id_fkey";

-- DropForeignKey
ALTER TABLE "inventory" DROP CONSTRAINT "inventory_product_var_id_fkey";

-- DropForeignKey
ALTER TABLE "product_image" DROP CONSTRAINT "product_image_product_id_fkey";

-- DropForeignKey
ALTER TABLE "product_variation" DROP CONSTRAINT "product_variation_product_id_fkey";

-- DropForeignKey
ALTER TABLE "rating_and_review" DROP CONSTRAINT "rating_and_review_product_id_fkey";

-- AddForeignKey
ALTER TABLE "product_variation" ADD CONSTRAINT "product_variation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_var_id_fkey" FOREIGN KEY ("product_var_id") REFERENCES "product_variation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_and_review" ADD CONSTRAINT "rating_and_review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_item" ADD CONSTRAINT "bookmark_item_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "bookmark"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
