/*
  Warnings:

  - The values [PENDING,SCHEDULED,PROCESING,VERIFIED] on the enum `Verification_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `verification` MODIFY `status` ENUM('pending', 'scheduled', 'procesing', 'verified') NOT NULL;
