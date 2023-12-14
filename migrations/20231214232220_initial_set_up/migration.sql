-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Girl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `age` INTEGER NOT NULL,
    `active` BOOLEAN NOT NULL,
    `cityId` INTEGER NOT NULL,
    `specificLocation` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `sessionPrices` JSON NOT NULL,
    `oneHourPrice` DOUBLE NOT NULL,
    `ethnicity` VARCHAR(191) NOT NULL,
    `height` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `chestCm` INTEGER NOT NULL,
    `waistCm` INTEGER NOT NULL,
    `bottomCm` INTEGER NOT NULL,
    `parking` BOOLEAN NOT NULL,
    `schedule` JSON NOT NULL,
    `attributes` JSON NOT NULL,
    `images` JSON NOT NULL,
    `videos` JSON NOT NULL,
    `profilePicture` VARCHAR(191) NOT NULL,
    `editLevel` INTEGER NOT NULL,
    `countryOfOrigin` VARCHAR(191) NULL,
    `categories` JSON NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Service` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('admin', 'girl') NOT NULL,
    `girlId` INTEGER NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_girlId_key`(`girlId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GirlServices` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GirlServices_AB_unique`(`A`, `B`),
    INDEX `_GirlServices_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_girlId_fkey` FOREIGN KEY (`girlId`) REFERENCES `Girl`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlServices` ADD CONSTRAINT `_GirlServices_A_fkey` FOREIGN KEY (`A`) REFERENCES `Girl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlServices` ADD CONSTRAINT `_GirlServices_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
