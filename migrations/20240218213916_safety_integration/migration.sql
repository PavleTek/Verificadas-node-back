-- CreateTable
CREATE TABLE `ClientReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `girlId` INTEGER NOT NULL,
    `review` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
