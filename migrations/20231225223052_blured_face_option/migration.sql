/*
  Warnings:

  - Added the required column `bluredFace` to the `Girl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `girl` ADD COLUMN `bluredFace` BOOLEAN NOT NULL;
