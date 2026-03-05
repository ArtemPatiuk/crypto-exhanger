/*
  Warnings:

  - Made the column `chainName` on table `Network` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Network" ALTER COLUMN "chainName" SET NOT NULL;
