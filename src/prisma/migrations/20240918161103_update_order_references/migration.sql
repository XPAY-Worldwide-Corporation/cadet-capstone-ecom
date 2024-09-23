/*
  Warnings:

  - The primary key for the `Order` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `OrderDate` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `OrderID` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `OrderStatus` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `PaymentID` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `ShippingAddress` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `ShippingID` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `TotalAmount` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `TrackingNumber` on the `Order` table. All the data in the column will be lost.
  - You are about to drop the column `UserID` on the `Order` table. All the data in the column will be lost.
  - Added the required column `status` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalAmount` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_UserID_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_OrderID_fkey";

-- DropForeignKey
ALTER TABLE "Shipping" DROP CONSTRAINT "Shipping_OrderID_fkey";

-- DropIndex
DROP INDEX "Order_PaymentID_key";

-- DropIndex
DROP INDEX "Order_ShippingID_key";

-- AlterTable
ALTER TABLE "Order" DROP CONSTRAINT "Order_pkey",
DROP COLUMN "OrderDate",
DROP COLUMN "OrderID",
DROP COLUMN "OrderStatus",
DROP COLUMN "PaymentID",
DROP COLUMN "ShippingAddress",
DROP COLUMN "ShippingID",
DROP COLUMN "TotalAmount",
DROP COLUMN "TrackingNumber",
DROP COLUMN "UserID",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL,
ADD COLUMN     "totalAmount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "userId" INTEGER NOT NULL,
ADD CONSTRAINT "Order_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" SERIAL NOT NULL,
    "productId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "orderId" INTEGER NOT NULL,

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("UserID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("ProductID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Shipping" ADD CONSTRAINT "Shipping_OrderID_fkey" FOREIGN KEY ("OrderID") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
