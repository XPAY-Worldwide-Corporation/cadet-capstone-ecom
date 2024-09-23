-- CreateTable
CREATE TABLE "User" (
    "UserID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "Address" TEXT,
    "PhoneNumber" TEXT,
    "TwoFactorEnabled" BOOLEAN NOT NULL DEFAULT false,
    "DateRegistered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("UserID")
);

-- CreateTable
CREATE TABLE "Product" (
    "ProductID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Description" TEXT NOT NULL,
    "Price" DOUBLE PRECISION NOT NULL,
    "StockLevel" INTEGER NOT NULL,
    "CategoryID" INTEGER NOT NULL,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("ProductID")
);

-- CreateTable
CREATE TABLE "Category" (
    "CategoryID" SERIAL NOT NULL,
    "CategoryName" TEXT NOT NULL,
    "Description" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("CategoryID")
);

-- CreateTable
CREATE TABLE "Review" (
    "ReviewID" SERIAL NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "UserID" INTEGER NOT NULL,
    "Rating" INTEGER NOT NULL,
    "Comment" TEXT,
    "ReviewDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Review_pkey" PRIMARY KEY ("ReviewID")
);

-- CreateTable
CREATE TABLE "Cart" (
    "CartID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "ProductID" INTEGER NOT NULL,
    "Quantity" INTEGER NOT NULL,

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("CartID")
);

-- CreateTable
CREATE TABLE "Order" (
    "OrderID" SERIAL NOT NULL,
    "UserID" INTEGER NOT NULL,
    "OrderDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ShippingAddress" TEXT NOT NULL,
    "TotalAmount" DOUBLE PRECISION NOT NULL,
    "OrderStatus" TEXT NOT NULL,
    "PaymentID" INTEGER NOT NULL,
    "ShippingID" INTEGER NOT NULL,
    "TrackingNumber" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("OrderID")
);

-- CreateTable
CREATE TABLE "Payment" (
    "PaymentID" SERIAL NOT NULL,
    "OrderID" INTEGER NOT NULL,
    "PaymentMethod" TEXT NOT NULL,
    "TransactionID" INTEGER NOT NULL,
    "PaymentStatus" TEXT NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("PaymentID")
);

-- CreateTable
CREATE TABLE "Shipping" (
    "ShippingID" SERIAL NOT NULL,
    "OrderID" INTEGER NOT NULL,
    "Carrier" TEXT NOT NULL,
    "ShippingMethod" TEXT NOT NULL,
    "ShippingCost" DOUBLE PRECISION NOT NULL,
    "EstimatedDeliveryTime" TIMESTAMP(3) NOT NULL,
    "TrackingURL" TEXT,

    CONSTRAINT "Shipping_pkey" PRIMARY KEY ("ShippingID")
);

-- CreateTable
CREATE TABLE "Discount" (
    "DiscountID" SERIAL NOT NULL,
    "DiscountCode" TEXT NOT NULL,
    "DiscountType" TEXT NOT NULL,
    "AmountValue" DOUBLE PRECISION NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Discount_pkey" PRIMARY KEY ("DiscountID")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "TransactionID" SERIAL NOT NULL,
    "PaymentID" INTEGER NOT NULL,
    "MerchantID" INTEGER NOT NULL,
    "Amount" DOUBLE PRECISION NOT NULL,
    "TransactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "TransactionType" TEXT NOT NULL,
    "ProductID" INTEGER,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("TransactionID")
);

-- CreateTable
CREATE TABLE "Merchant" (
    "MerchantID" SERIAL NOT NULL,
    "MerchantName" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Password" TEXT NOT NULL,
    "BusinessName" TEXT NOT NULL,
    "VerifiedStatus" BOOLEAN NOT NULL DEFAULT false,
    "DateRegistered" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Merchant_pkey" PRIMARY KEY ("MerchantID")
);

-- CreateTable
CREATE TABLE "_DiscountToProduct" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_Email_key" ON "User"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "Order_PaymentID_key" ON "Order"("PaymentID");

-- CreateIndex
CREATE UNIQUE INDEX "Order_ShippingID_key" ON "Order"("ShippingID");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_OrderID_key" ON "Payment"("OrderID");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_TransactionID_key" ON "Payment"("TransactionID");

-- CreateIndex
CREATE UNIQUE INDEX "Shipping_OrderID_key" ON "Shipping"("OrderID");

-- CreateIndex
CREATE UNIQUE INDEX "Transaction_PaymentID_key" ON "Transaction"("PaymentID");

-- CreateIndex
CREATE UNIQUE INDEX "Merchant_Email_key" ON "Merchant"("Email");

-- CreateIndex
CREATE UNIQUE INDEX "_DiscountToProduct_AB_unique" ON "_DiscountToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_DiscountToProduct_B_index" ON "_DiscountToProduct"("B");

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_CategoryID_fkey" FOREIGN KEY ("CategoryID") REFERENCES "Category"("CategoryID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_UserID_fkey" FOREIGN KEY ("UserID") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Order"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Order"("OrderID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_PaymentID_fkey" FOREIGN KEY ("PaymentID") REFERENCES "Payment"("PaymentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_MerchantID_fkey" FOREIGN KEY ("MerchantID") REFERENCES "Merchant"("MerchantID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_ProductID_fkey" FOREIGN KEY ("ProductID") REFERENCES "Product"("ProductID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountToProduct" ADD CONSTRAINT "_DiscountToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Discount"("DiscountID") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DiscountToProduct" ADD CONSTRAINT "_DiscountToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("ProductID") ON DELETE CASCADE ON UPDATE CASCADE;
