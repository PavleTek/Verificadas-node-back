/*
  Warnings:

  - You are about to drop the column `oneHourPrice` on the `girl` table. All the data in the column will be lost.
  - You are about to drop the column `sessionPrices` on the `girl` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[sessionPricesId]` on the table `Girl` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `girl` DROP COLUMN `oneHourPrice`,
    DROP COLUMN `sessionPrices`,
    ADD COLUMN `sessionPricesId` INTEGER NULL;

-- CreateTable
CREATE TABLE `Prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `halfHourPrice` INTEGER NULL,
    `oneHourPrice` INTEGER NULL,
    `twoHourPrice` INTEGER NULL,
    `fourHourPrice` INTEGER NULL,
    `dinnerPrice` INTEGER NULL,
    `wholeNight` INTEGER NULL,
    `girlId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Girl_sessionPricesId_key` ON `Girl`(`sessionPricesId`);

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_sessionPricesId_fkey` FOREIGN KEY (`sessionPricesId`) REFERENCES `Prices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
