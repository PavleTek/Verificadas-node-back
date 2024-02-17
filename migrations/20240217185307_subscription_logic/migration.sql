/*
  Warnings:

  - The values [procesing] on the enum `Verification_status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[subscriptionId]` on the table `Girl` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `paymentTier` to the `Girl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `girl` ADD COLUMN `paymentTier` VARCHAR(191) NOT NULL,
    ADD COLUMN `subscriptionId` INTEGER NULL;

-- AlterTable
ALTER TABLE `verification` MODIFY `status` ENUM('pending', 'scheduled', 'processing', 'verified') NOT NULL;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `active` BOOLEAN NOT NULL,
    `expiryDate` DATETIME(3) NOT NULL,
    `DeactivationDate` DATETIME(3) NOT NULL,
    `firstPause` JSON NOT NULL,
    `secondPause` JSON NOT NULL,
    `ThirdPause` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscriptionId` INTEGER NOT NULL,
    `paymentTier` VARCHAR(191) NOT NULL,
    `amountPaid` INTEGER NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GirlPaidServices` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GirlPaidServices_AB_unique`(`A`, `B`),
    INDEX `_GirlPaidServices_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Girl_subscriptionId_key` ON `Girl`(`subscriptionId`);

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionPayment` ADD CONSTRAINT `SubscriptionPayment_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlPaidServices` ADD CONSTRAINT `_GirlPaidServices_A_fkey` FOREIGN KEY (`A`) REFERENCES `Girl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlPaidServices` ADD CONSTRAINT `_GirlPaidServices_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
