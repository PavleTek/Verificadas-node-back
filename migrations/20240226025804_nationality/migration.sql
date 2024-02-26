/*
  Warnings:

  - You are about to drop the column `countryOfOriginId` on the `girl` table. All the data in the column will be lost.
  - You are about to drop the `countryoforigin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `girl` DROP FOREIGN KEY `Girl_countryOfOriginId_fkey`;

-- AlterTable
ALTER TABLE `girl` DROP COLUMN `countryOfOriginId`,
    ADD COLUMN `nationalityId` INTEGER NULL;

-- DropTable
DROP TABLE `countryoforigin`;

-- CreateTable
CREATE TABLE `Nationality` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_nationalityId_fkey` FOREIGN KEY (`nationalityId`) REFERENCES `Nationality`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
