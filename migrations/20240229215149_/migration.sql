/*
  Warnings:

  - You are about to drop the column `DeactivationDate` on the `subscription` table. All the data in the column will be lost.
  - You are about to drop the column `ThirdPause` on the `subscription` table. All the data in the column will be lost.
  - Added the required column `deactivationDate` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `thirdPause` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `subscription` DROP COLUMN `DeactivationDate`,
    DROP COLUMN `ThirdPause`,
    ADD COLUMN `deactivationDate` DATETIME(3) NOT NULL,
    ADD COLUMN `thirdPause` JSON NOT NULL;
