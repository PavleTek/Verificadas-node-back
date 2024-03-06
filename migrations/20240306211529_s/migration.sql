/*
  Warnings:

  - You are about to drop the column `firstPause` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `secondPause` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `thirdPause` on the `subscription` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `girl` ADD COLUMN `hiden` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `firstPause`,
    DROP COLUMN `secondPause`,
    DROP COLUMN `thirdPause`,
    ADD COLUMN `availablePauses` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `pauseEndDate` DATETIME(3) NULL,
    ADD COLUMN `pauseStartDate` DATETIME(3) NULL;
