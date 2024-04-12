/*
  Warnings:

  - Added the required column `searchId` to the `Notification` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `notification` ADD COLUMN `searchId` INTEGER NOT NULL;
