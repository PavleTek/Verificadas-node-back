-- CreateTable
CREATE TABLE `Verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carentFrontal` VARCHAR(191) NOT NULL,
    `carnetAtras` VARCHAR(191) NOT NULL,
    `status` ENUM('PENDING', 'SCHEDULED', 'PROCESING', 'VERIFIED') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `bday` DATETIME(3) NOT NULL,
    `rut` VARCHAR(191) NULL,
    `verificationDate` DATETIME(3) NULL,
    `verifiedBy` INTEGER NULL,
    `girlId` INTEGER NOT NULL,

    UNIQUE INDEX `Verification_girlId_key`(`girlId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Verification` ADD CONSTRAINT `Verification_verifiedBy_fkey` FOREIGN KEY (`verifiedBy`) REFERENCES `User`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Verification` ADD CONSTRAINT `Verification_girlId_fkey` FOREIGN KEY (`girlId`) REFERENCES `Girl`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
