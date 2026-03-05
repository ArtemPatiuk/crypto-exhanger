/*
  Warnings:

  - Added the required column `depositAddress` to the `Network` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Network" ADD COLUMN     "depositAddress" TEXT NOT NULL,
ADD COLUMN     "depositMemo" TEXT;
