/*
  Warnings:

  - You are about to drop the column `emailVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `verificationCode` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `emailVerified`,
    DROP COLUMN `verificationCode`,
    ADD COLUMN `welcomeMessage` VARCHAR(550) NULL,
    ADD COLUMN `welcomeSent` BOOLEAN NOT NULL DEFAULT false;
