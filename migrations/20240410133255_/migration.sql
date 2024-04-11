/*
  Warnings:

  - Added the required column `discountMessage` to the `PricingPlan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pricingplan` ADD COLUMN `discountMessage` VARCHAR(191) NOT NULL;
