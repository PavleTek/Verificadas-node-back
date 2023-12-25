/*
  Warnings:

  - A unique constraint covering the columns `[verificationId]` on the table `Girl` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `verification` DROP FOREIGN KEY `Verification_girlId_fkey`;

-- AlterTable
ALTER TABLE `girl` ADD COLUMN `verificationId` INTEGER NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Girl_verificationId_key` ON `Girl`(`verificationId`);

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_verificationId_fkey` FOREIGN KEY (`verificationId`) REFERENCES `Verification`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
