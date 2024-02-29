/*
  Warnings:

  - You are about to drop the column `barbie` on the `verification` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `girl` ADD COLUMN `barbie` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `verification` DROP COLUMN `barbie`;
