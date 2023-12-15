/*
  Warnings:

  - A unique constraint covering the columns `[verifiedBy]` on the table `Verification` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE `verification` DROP FOREIGN KEY `Verification_verifiedBy_fkey`;

-- CreateIndex
CREATE UNIQUE INDEX `Verification_verifiedBy_key` ON `Verification`(`verifiedBy`);
