-- AlterTable
ALTER TABLE `user` ADD COLUMN `changePasswordMessage` VARCHAR(550) NULL,
    ADD COLUMN `changePasswordSent` BOOLEAN NOT NULL DEFAULT false;
