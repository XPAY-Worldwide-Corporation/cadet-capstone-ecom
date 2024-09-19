-- CreateTable
CREATE TABLE "user" (
    "id" SERIAL NOT NULL,
    "email" VARCHAR(50) NOT NULL,
    "password" VARCHAR(250) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(15) NOT NULL,
    "first_name" VARCHAR(25) NOT NULL,
    "last_name" VARCHAR(25) NOT NULL,
    "phone_no" CHAR(11),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer_address" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "address_line_one" VARCHAR(255) NOT NULL,
    "postal_code" CHAR(4) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "is_dafault" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "customer_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seller" (
    "id" SERIAL NOT NULL,
    "user_id" INTEGER NOT NULL,
    "username" VARCHAR(15) NOT NULL,
    "first_name" VARCHAR(25) NOT NULL,
    "last_name" VARCHAR(25) NOT NULL,
    "phone_no" CHAR(11) NOT NULL,
    "address_line_one" VARCHAR(255) NOT NULL,
    "postal_code" CHAR(4) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "seller_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR NOT NULL,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store" (
    "id" SERIAL NOT NULL,
    "seller_id" INTEGER NOT NULL,
    "store_name" VARCHAR(50) NOT NULL,
    "store_desc" TEXT NOT NULL,
    "store_timg_url" TEXT NOT NULL,
    "pickup_address_line_one" VARCHAR(255) NOT NULL,
    "postal_code" CHAR(4) NOT NULL,
    "city" VARCHAR(50) NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "store_category" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "display_name" VARCHAR(50) NOT NULL,
    "store_id" INTEGER NOT NULL,

    CONSTRAINT "store_category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product" (
    "id" SERIAL NOT NULL,
    "store_id" INTEGER NOT NULL,
    "prod_name" VARCHAR(250) NOT NULL,
    "prod_desc" TEXT NOT NULL,
    "prod_timg_Url" TEXT NOT NULL,
    "prod_width" DECIMAL(10,2) NOT NULL,
    "prod_height" DECIMAL(10,2) NOT NULL,
    "cat_id" INTEGER NOT NULL,
    "store_category_id" INTEGER NOT NULL,
    "price_per_unit" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_variation" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "color" VARCHAR(20) NOT NULL,
    "size" VARCHAR(20) NOT NULL,

    CONSTRAINT "product_variation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory" (
    "id" SERIAL NOT NULL,
    "product_var_id" INTEGER NOT NULL,
    "stock_no" INTEGER NOT NULL DEFAULT 0,
    "prod_code" VARCHAR(20) NOT NULL,

    CONSTRAINT "inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rating_and_review" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "rate" INTEGER NOT NULL,
    "review_desc" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "rating_and_review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cart_item" (
    "id" SERIAL NOT NULL,
    "cart_id" INTEGER NOT NULL,
    "product_var_id" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,

    CONSTRAINT "cart_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,

    CONSTRAINT "bookmark_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmark_item" (
    "id" SERIAL NOT NULL,
    "bookmark_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,

    CONSTRAINT "bookmark_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "customer_address_id" INTEGER NOT NULL,
    "payment_method_id" INTEGER NOT NULL,
    "payment_status_id" INTEGER NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "discount" DECIMAL(10,2) NOT NULL,
    "shipping_fee" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item" (
    "id" SERIAL NOT NULL,
    "order_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "product_id" INTEGER NOT NULL,
    "shipping_method_id" INTEGER NOT NULL,
    "order_item_status_id" INTEGER NOT NULL,
    "qty" INTEGER NOT NULL,
    "price_per_unit" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "order_item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "order_item_id" INTEGER NOT NULL,
    "refund_type_id" INTEGER NOT NULL,
    "refund_reason_id" INTEGER NOT NULL,
    "refund_desc" TEXT NOT NULL,
    "refund_status_id" INTEGER NOT NULL DEFAULT 1,
    "refund_ref" TEXT NOT NULL,
    "refund_amt" DECIMAL(10,2) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fulfilled_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transaction" (
    "id" SERIAL NOT NULL,
    "customer_id" INTEGER NOT NULL,
    "store_id" INTEGER NOT NULL,
    "order_id" INTEGER NOT NULL,
    "total_paid" DECIMAL(10,2) NOT NULL,
    "ref_id" VARCHAR(250),
    "created_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_image" (
    "id" SERIAL NOT NULL,
    "product_id" INTEGER NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "product_image_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_type" (
    "id" SERIAL NOT NULL,
    "name" CHAR(10) NOT NULL,
    "display_name" VARCHAR(10) NOT NULL,

    CONSTRAINT "refund_type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_reason" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(25) NOT NULL,
    "display_name" VARCHAR(50) NOT NULL,

    CONSTRAINT "refund_reason_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "refund_status" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(10) NOT NULL,
    "display_name" VARCHAR(10) NOT NULL,

    CONSTRAINT "refund_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "order_item_status" (
    "id" SERIAL NOT NULL,
    "name" CHAR(15) NOT NULL,
    "display_name" CHAR(15) NOT NULL,

    CONSTRAINT "order_item_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_status" (
    "id" SERIAL NOT NULL,
    "name" CHAR(10) NOT NULL,
    "display_name" CHAR(10) NOT NULL,

    CONSTRAINT "payment_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method" (
    "id" SERIAL NOT NULL,
    "name" CHAR(25) NOT NULL,
    "display_name" CHAR(25) NOT NULL,

    CONSTRAINT "payment_method_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "shipping_method" (
    "id" SERIAL NOT NULL,
    "name" CHAR(25) NOT NULL,
    "display_name" CHAR(25) NOT NULL,
    "delivery_fee" DECIMAL(10,2) NOT NULL,
    "desc" VARCHAR(100) NOT NULL,

    CONSTRAINT "shipping_method_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_id_key" ON "user"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_id_key" ON "customer"("id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_user_id_key" ON "customer"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_address_id_key" ON "customer_address"("id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_id_key" ON "seller"("id");

-- CreateIndex
CREATE UNIQUE INDEX "seller_user_id_key" ON "seller"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "category_id_key" ON "category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "store_id_key" ON "store"("id");

-- CreateIndex
CREATE UNIQUE INDEX "store_seller_id_key" ON "store"("seller_id");

-- CreateIndex
CREATE UNIQUE INDEX "store_category_id_key" ON "store_category"("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_id_key" ON "product"("id");

-- CreateIndex
CREATE UNIQUE INDEX "product_variation_id_key" ON "product_variation"("id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_id_key" ON "inventory"("id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_product_var_id_key" ON "inventory"("product_var_id");

-- CreateIndex
CREATE UNIQUE INDEX "rating_and_review_id_key" ON "rating_and_review"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_id_key" ON "cart"("id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_customer_id_key" ON "cart"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "cart_item_id_key" ON "cart_item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_id_key" ON "bookmark"("id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_customer_id_key" ON "bookmark"("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "bookmark_item_id_key" ON "bookmark_item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "order_id_key" ON "order"("id");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_id_key" ON "order_item"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refund_id_key" ON "refund"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refund_order_item_id_key" ON "refund"("order_item_id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_id_key" ON "transaction"("id");

-- CreateIndex
CREATE UNIQUE INDEX "transaction_order_id_key" ON "transaction"("order_id");

-- CreateIndex
CREATE UNIQUE INDEX "product_image_id_key" ON "product_image"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refund_type_id_key" ON "refund_type"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refund_reason_id_key" ON "refund_reason"("id");

-- CreateIndex
CREATE UNIQUE INDEX "refund_status_id_key" ON "refund_status"("id");

-- CreateIndex
CREATE UNIQUE INDEX "order_item_status_id_key" ON "order_item_status"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_status_id_key" ON "payment_status"("id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_id_key" ON "payment_method"("id");

-- CreateIndex
CREATE UNIQUE INDEX "shipping_method_id_key" ON "shipping_method"("id");

-- AddForeignKey
ALTER TABLE "customer" ADD CONSTRAINT "customer_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "customer_address" ADD CONSTRAINT "customer_address_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "seller" ADD CONSTRAINT "seller_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store" ADD CONSTRAINT "store_seller_id_fkey" FOREIGN KEY ("seller_id") REFERENCES "seller"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "store_category" ADD CONSTRAINT "store_category_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_store_category_id_fkey" FOREIGN KEY ("store_category_id") REFERENCES "store_category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product" ADD CONSTRAINT "product_cat_id_fkey" FOREIGN KEY ("cat_id") REFERENCES "category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_variation" ADD CONSTRAINT "product_variation_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory" ADD CONSTRAINT "inventory_product_var_id_fkey" FOREIGN KEY ("product_var_id") REFERENCES "product_variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_and_review" ADD CONSTRAINT "rating_and_review_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_and_review" ADD CONSTRAINT "rating_and_review_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rating_and_review" ADD CONSTRAINT "rating_and_review_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart" ADD CONSTRAINT "cart_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "cart"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_item" ADD CONSTRAINT "cart_item_product_var_id_fkey" FOREIGN KEY ("product_var_id") REFERENCES "product_variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark" ADD CONSTRAINT "bookmark_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_item" ADD CONSTRAINT "bookmark_item_bookmark_id_fkey" FOREIGN KEY ("bookmark_id") REFERENCES "bookmark"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookmark_item" ADD CONSTRAINT "bookmark_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_customer_address_id_fkey" FOREIGN KEY ("customer_address_id") REFERENCES "customer_address"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_payment_method_id_fkey" FOREIGN KEY ("payment_method_id") REFERENCES "payment_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order" ADD CONSTRAINT "order_payment_status_id_fkey" FOREIGN KEY ("payment_status_id") REFERENCES "payment_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product_variation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_order_item_status_id_fkey" FOREIGN KEY ("order_item_status_id") REFERENCES "order_item_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "order_item" ADD CONSTRAINT "order_item_shipping_method_id_fkey" FOREIGN KEY ("shipping_method_id") REFERENCES "shipping_method"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_order_item_id_fkey" FOREIGN KEY ("order_item_id") REFERENCES "order_item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_refund_type_id_fkey" FOREIGN KEY ("refund_type_id") REFERENCES "refund_type"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_refund_reason_id_fkey" FOREIGN KEY ("refund_reason_id") REFERENCES "refund_reason"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "refund" ADD CONSTRAINT "refund_refund_status_id_fkey" FOREIGN KEY ("refund_status_id") REFERENCES "refund_status"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_order_id_fkey" FOREIGN KEY ("order_id") REFERENCES "order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transaction" ADD CONSTRAINT "transaction_store_id_fkey" FOREIGN KEY ("store_id") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_image" ADD CONSTRAINT "product_image_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
