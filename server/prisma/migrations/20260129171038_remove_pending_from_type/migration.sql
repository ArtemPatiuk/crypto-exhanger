/*
  Warnings:

  - The values [PENDING] on the enum `ExchangeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExchangeStatus_new" AS ENUM ('WAITING_PAYMENT', 'PAID', 'COMPLETED', 'CANCELLED');
ALTER TABLE "public"."ExchangeRequest" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "ExchangeRequest" ALTER COLUMN "status" TYPE "ExchangeStatus_new" USING ("status"::text::"ExchangeStatus_new");
ALTER TYPE "ExchangeStatus" RENAME TO "ExchangeStatus_old";
ALTER TYPE "ExchangeStatus_new" RENAME TO "ExchangeStatus";
DROP TYPE "public"."ExchangeStatus_old";
ALTER TABLE "ExchangeRequest" ALTER COLUMN "status" SET DEFAULT 'WAITING_PAYMENT';
COMMIT;

-- AlterTable
ALTER TABLE "ExchangeRequest" ALTER COLUMN "status" SET DEFAULT 'WAITING_PAYMENT';
