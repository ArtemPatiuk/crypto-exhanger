/*
  Warnings:

  - A unique constraint covering the columns `[coin,network]` on the table `asset` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "asset" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true;

-- CreateIndex
CREATE UNIQUE INDEX "asset_coin_network_key" ON "asset"("coin", "network");
