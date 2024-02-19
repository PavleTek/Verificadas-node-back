/*
  Warnings:

  - The primary key for the `client` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `client` table. All the data in the column will be lost.
  - You are about to drop the column `clientId` on the `clientreview` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[phoneNumber]` on the table `Client` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `clientreview` DROP FOREIGN KEY `ClientReview_clientId_fkey`;

-- AlterTable
ALTER TABLE `client` DROP PRIMARY KEY,
    DROP COLUMN `id`,
    ADD PRIMARY KEY (`phoneNumber`);

-- AlterTable
ALTER TABLE `clientreview` DROP COLUMN `clientId`;

-- CreateIndex
CREATE UNIQUE INDEX `Client_phoneNumber_key` ON `Client`(`phoneNumber`);

-- AddForeignKey
ALTER TABLE `ClientReview` ADD CONSTRAINT `ClientReview_phoneNumber_fkey` FOREIGN KEY (`phoneNumber`) REFERENCES `Client`(`phoneNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;
