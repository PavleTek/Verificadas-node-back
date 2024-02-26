/*
  Warnings:

  - You are about to drop the column `ethnicity` on the `girl` table. All the data in the column will be lost.
  - You are about to drop the column `specificLocation` on the `girl` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX `Verification_verifiedBy_key` ON `verification`;

-- AlterTable
ALTER TABLE `girl` DROP COLUMN `ethnicity`,
    DROP COLUMN `specificLocation`,
    ADD COLUMN `ethnicityId` INTEGER NULL,
    ADD COLUMN `specificLocationId` INTEGER NULL;

-- AlterTable
ALTER TABLE `verification` ADD COLUMN `barbie` BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE `Ethnicity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecificLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_specificLocationId_fkey` FOREIGN KEY (`specificLocationId`) REFERENCES `SpecificLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_ethnicityId_fkey` FOREIGN KEY (`ethnicityId`) REFERENCES `Ethnicity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
