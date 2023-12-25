/*
  Warnings:

  - You are about to drop the column `carentFrontal` on the `verification` table. All the data in the column will be lost.
  - Added the required column `carnetFrontal` to the `Verification` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Verification_girlId_key` ON `verification`;

-- AlterTable
ALTER TABLE `verification` DROP COLUMN `carentFrontal`,
    ADD COLUMN `carnetFrontal` VARCHAR(191) NOT NULL,
    MODIFY `girlId` INTEGER NULL;

-- CreateTable
CREATE TABLE `ClickStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `generalClicks` INTEGER NOT NULL DEFAULT 0,
    `clicksOnGirls` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GirlClickStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `girlId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clicksToProfile` INTEGER NOT NULL DEFAULT 0,
    `clciksToWhatsapp` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
