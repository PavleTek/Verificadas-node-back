-- CreateTable
CREATE TABLE `City` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClickStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `generalClicks` INTEGER NOT NULL DEFAULT 0,
    `clicksOnGirls` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `GirlClickStats` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `girlId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `clicksToProfile` INTEGER NOT NULL DEFAULT 0,
    `clciksToWhatsapp` INTEGER NOT NULL DEFAULT 0,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Girl` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `bday` DATETIME(3) NOT NULL,
    `active` BOOLEAN NOT NULL,
    `hiden` BOOLEAN NOT NULL DEFAULT false,
    `barbie` BOOLEAN NOT NULL DEFAULT false,
    `bluredFace` BOOLEAN NOT NULL DEFAULT false,
    `cityId` INTEGER NOT NULL,
    `specificLocationId` INTEGER NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `description` VARCHAR(550) NOT NULL,
    `ethnicityId` INTEGER NULL,
    `nationalityId` INTEGER NULL,
    `height` INTEGER NOT NULL,
    `weight` INTEGER NOT NULL,
    `chestCm` INTEGER NOT NULL,
    `waistCm` INTEGER NOT NULL,
    `bottomCm` INTEGER NOT NULL,
    `paymentTier` VARCHAR(191) NOT NULL,
    `subscriptionId` INTEGER NULL,
    `parking` BOOLEAN NOT NULL,
    `schedule` JSON NOT NULL,
    `attributes` JSON NOT NULL,
    `images` JSON NOT NULL,
    `videos` JSON NOT NULL,
    `profilePicture` VARCHAR(191) NOT NULL,
    `editLevel` ENUM('Nulo', 'Leve', 'Editado') NOT NULL,
    `categories` JSON NOT NULL,
    `requestProfilePicture` VARCHAR(191) NULL,
    `sessionPricesId` INTEGER NULL,
    `verificationId` INTEGER NULL,

    UNIQUE INDEX `Girl_subscriptionId_key`(`subscriptionId`),
    UNIQUE INDEX `Girl_sessionPricesId_key`(`sessionPricesId`),
    UNIQUE INDEX `Girl_verificationId_key`(`verificationId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Ethnicity` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Nationality` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SpecificLocation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Prices` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `halfHourPrice` INTEGER NULL,
    `oneHourPrice` INTEGER NULL,
    `oneAndAHalfHourPrice` INTEGER NULL,
    `twoHourPrice` INTEGER NULL,
    `fourHourPrice` INTEGER NULL,
    `dinnerPrice` INTEGER NULL,
    `wholeNight` INTEGER NULL,
    `girlId` INTEGER NULL,

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
    `welcomeMessage` VARCHAR(550) NULL,
    `changePasswordMessage` VARCHAR(550) NULL,
    `welcomeSent` BOOLEAN NOT NULL DEFAULT false,
    `changePasswordSent` BOOLEAN NOT NULL DEFAULT true,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_girlId_key`(`girlId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Verification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carnetFrontal` VARCHAR(191) NOT NULL,
    `carnetAtras` VARCHAR(191) NOT NULL,
    `status` ENUM('Pending', 'Scheduled', 'Processing', 'Verified') NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `lastname` VARCHAR(191) NOT NULL,
    `bday` DATETIME(3) NOT NULL,
    `scheduledLink` VARCHAR(191) NULL,
    `rut` VARCHAR(191) NULL,
    `verificationDate` DATETIME(3) NULL,
    `verifiedBy` INTEGER NULL,
    `girlId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Subscription` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `expiryDate` DATETIME(3) NOT NULL,
    `deactivationDate` DATETIME(3) NOT NULL,
    `pauseStartDate` DATETIME(3) NULL,
    `pauseEndDate` DATETIME(3) NULL,
    `availablePauses` INTEGER NOT NULL DEFAULT 0,
    `girlId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SubscriptionPayment` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `subscriptionId` INTEGER NOT NULL,
    `paymentTier` VARCHAR(191) NOT NULL,
    `amountPaid` INTEGER NOT NULL,
    `paymentDate` DATETIME(3) NOT NULL,
    `duration` VARCHAR(191) NOT NULL,
    `paymentMethod` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ClientReview` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `girlId` INTEGER NOT NULL,
    `review` VARCHAR(3000) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `rating` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Client` (
    `phoneNumber` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `Client_phoneNumber_key`(`phoneNumber`),
    PRIMARY KEY (`phoneNumber`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `PricingPlan` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `price` DOUBLE NOT NULL,
    `discount` INTEGER NOT NULL,
    `discountMessage` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `PricingPlan_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Banner` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(191) NOT NULL,
    `message` VARCHAR(191) NOT NULL,
    `showBanner` BOOLEAN NOT NULL DEFAULT false,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` VARCHAR(191) NOT NULL,
    `fromUserId` INTEGER NOT NULL,
    `date` DATETIME(3) NOT NULL,
    `searchId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `AnounceRequest` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `phoneNumber` VARCHAR(191) NOT NULL,
    `paymentTier` VARCHAR(191) NOT NULL,
    `message` VARCHAR(3000) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GirlServices` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GirlServices_AB_unique`(`A`, `B`),
    INDEX `_GirlServices_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_GirlPaidServices` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_GirlPaidServices_AB_unique`(`A`, `B`),
    INDEX `_GirlPaidServices_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_cityId_fkey` FOREIGN KEY (`cityId`) REFERENCES `City`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_specificLocationId_fkey` FOREIGN KEY (`specificLocationId`) REFERENCES `SpecificLocation`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_ethnicityId_fkey` FOREIGN KEY (`ethnicityId`) REFERENCES `Ethnicity`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_nationalityId_fkey` FOREIGN KEY (`nationalityId`) REFERENCES `Nationality`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_sessionPricesId_fkey` FOREIGN KEY (`sessionPricesId`) REFERENCES `Prices`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Girl` ADD CONSTRAINT `Girl_verificationId_fkey` FOREIGN KEY (`verificationId`) REFERENCES `Verification`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SubscriptionPayment` ADD CONSTRAINT `SubscriptionPayment_subscriptionId_fkey` FOREIGN KEY (`subscriptionId`) REFERENCES `Subscription`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ClientReview` ADD CONSTRAINT `ClientReview_phoneNumber_fkey` FOREIGN KEY (`phoneNumber`) REFERENCES `Client`(`phoneNumber`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlServices` ADD CONSTRAINT `_GirlServices_A_fkey` FOREIGN KEY (`A`) REFERENCES `Girl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlServices` ADD CONSTRAINT `_GirlServices_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlPaidServices` ADD CONSTRAINT `_GirlPaidServices_A_fkey` FOREIGN KEY (`A`) REFERENCES `Girl`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_GirlPaidServices` ADD CONSTRAINT `_GirlPaidServices_B_fkey` FOREIGN KEY (`B`) REFERENCES `Service`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
