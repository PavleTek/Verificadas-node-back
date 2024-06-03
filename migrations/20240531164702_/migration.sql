/*
  Warnings:

  - Added the required column `shortDescription` to the `Blog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `blog` ADD COLUMN `shortDescription` VARCHAR(191) NOT NULL;
