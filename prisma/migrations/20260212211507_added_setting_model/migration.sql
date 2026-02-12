-- CreateTable
CREATE TABLE `Setting` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `isPushNotificationEnabled` BOOLEAN NOT NULL DEFAULT false,
    `isEmailNotificationEnabled` BOOLEAN NOT NULL DEFAULT true,
    `isSMSNotificationEnabled` BOOLEAN NOT NULL DEFAULT false,
    `isDarkModeEnabled` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
