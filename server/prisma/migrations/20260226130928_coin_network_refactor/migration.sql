/*
  Warnings:

  - The values [PAID] on the enum `ExchangeStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `assetFromId` on the `ExchangeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `assetToId` on the `ExchangeRequest` table. All the data in the column will be lost.
  - You are about to drop the column `totalSum` on the `ExchangeRequest` table. All the data in the column will be lost.
  - You are about to alter the column `amount` on the `ExchangeRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(30,10)`.
  - You are about to alter the column `commission` on the `ExchangeRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(30,10)`.
  - You are about to alter the column `exchangeRate` on the `ExchangeRequest` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Decimal(30,10)`.
  - You are about to drop the `asset` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `expiresAt` to the `ExchangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `networkFromId` to the `ExchangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `networkToId` to the `ExchangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `totalReceive` to the `ExchangeRequest` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ExchangeRequest` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExchangeStatus_new" AS ENUM ('WAITING_PAYMENT', 'PAYMENT_RECEIVED', 'PROCESSING', 'COMPLETED', 'CANCELLED', 'EXPIRED', 'FAILED');
ALTER TABLE "public"."ExchangeRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ExchangeRequest" ALTER COLUMN "status" TYPE "ExchangeStatus_new" USING ("status"::text::"ExchangeStatus_new");
ALTER TYPE "ExchangeStatus" RENAME TO "ExchangeStatus_old";
ALTER TYPE "ExchangeStatus_new" RENAME TO "ExchangeStatus";
DROP TYPE "public"."ExchangeStatus_old";
ALTER TABLE "ExchangeRequest" ALTER COLUMN "status" SET DEFAULT 'WAITING_PAYMENT';
COMMIT;

-- DropForeignKey
ALTER TABLE "public"."ExchangeRequest" DROP CONSTRAINT "ExchangeRequest_assetFromId_fkey";

-- DropForeignKey
ALTER TABLE "public"."ExchangeRequest" DROP CONSTRAINT "ExchangeRequest_assetToId_fkey";

-- DropForeignKey
ALTER TABLE "public"."asset" DROP CONSTRAINT "asset_createdById_fkey";

-- AlterTable
ALTER TABLE "ExchangeRequest" DROP COLUMN "assetFromId",
DROP COLUMN "assetToId",
DROP COLUMN "totalSum",
ADD COLUMN     "completedAt" TIMESTAMP(3),
ADD COLUMN     "expiresAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "networkFromId" TEXT NOT NULL,
ADD COLUMN     "networkToId" TEXT NOT NULL,
ADD COLUMN     "paidAt" TIMESTAMP(3),
ADD COLUMN     "recipientMemo" TEXT,
ADD COLUMN     "totalReceive" DECIMAL(30,10) NOT NULL,
ADD COLUMN     "txHash" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(30,10),
ALTER COLUMN "commission" SET DATA TYPE DECIMAL(30,10),
ALTER COLUMN "exchangeRate" SET DATA TYPE DECIMAL(30,10);

-- DropTable
DROP TABLE "public"."asset";

-- CreateTable
CREATE TABLE "Coin" (
    "id" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Network" (
    "id" TEXT NOT NULL,
    "coinId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "chainName" TEXT,
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "withdrawFee" DECIMAL(30,10) NOT NULL,
    "withdrawMin" DECIMAL(30,10) NOT NULL,
    "withdrawMax" DECIMAL(30,10),
    "depositDust" DECIMAL(30,10),
    "addressRegex" TEXT NOT NULL,
    "memoRegex" TEXT,
    "requiresMemo" BOOLEAN NOT NULL DEFAULT false,
    "minConfirm" INTEGER,
    "estimatedArrivalTime" INTEGER,
    "contractAddress" TEXT,
    "explorerUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Network_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Coin_symbol_key" ON "Coin"("symbol");

-- CreateIndex
CREATE UNIQUE INDEX "Network_coinId_name_key" ON "Network"("coinId", "name");

-- AddForeignKey
ALTER TABLE "Network" ADD CONSTRAINT "Network_coinId_fkey" FOREIGN KEY ("coinId") REFERENCES "Coin"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeRequest" ADD CONSTRAINT "ExchangeRequest_networkFromId_fkey" FOREIGN KEY ("networkFromId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ExchangeRequest" ADD CONSTRAINT "ExchangeRequest_networkToId_fkey" FOREIGN KEY ("networkToId") REFERENCES "Network"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
