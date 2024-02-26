/*
  Warnings:

  - You are about to drop the column `countryOfOrigin` on the `girl` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `girl` DROP COLUMN `countryOfOrigin`,
    ADD COLUMN `countryOfOriginId` INTEGER NULL;

-- CreateTable
CREATE TABLE `CountryOfOrigin` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_countryOfOriginId_fkey` FOREIGN KEY (`countryOfOriginId`) REFERENCES `CountryOfOrigin`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
