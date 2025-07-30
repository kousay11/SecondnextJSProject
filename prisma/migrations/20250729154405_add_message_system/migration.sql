-- CreateTable
CREATE TABLE `Message` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `phone` VARCHAR(191) NOT NULL,
    `subject` ENUM('GENERAL_INQUIRY', 'TECHNICAL_SUPPORT', 'BILLING_QUESTION', 'PRODUCT_QUESTION', 'COMPLAINT', 'SUGGESTION', 'OTHER') NOT NULL,
    `message` TEXT NOT NULL,
    `status` ENUM('PENDING', 'PROCESSED', 'CLOSED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processedAt` DATETIME(3) NULL,

    INDEX `Message_userId_idx`(`userId`),
    INDEX `Message_status_idx`(`status`),
    INDEX `Message_createdAt_idx`(`createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Message` ADD CONSTRAINT `Message_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
