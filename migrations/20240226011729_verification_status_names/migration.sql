/*
  Warnings:

  - The values [pending,scheduled,processing,verified] on the enum `Verification_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `verification` MODIFY `status` ENUM('Pending', 'Scheduled', 'Processing', 'Verified') NOT NULL;
