/*
  Warnings:

  - You are about to drop the column `age` on the `girl` table. All the data in the column will be lost.
  - Added the required column `bday` to the `Girl` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `girl` DROP COLUMN `age`,
    ADD COLUMN `bday` DATETIME(3) NOT NULL;
