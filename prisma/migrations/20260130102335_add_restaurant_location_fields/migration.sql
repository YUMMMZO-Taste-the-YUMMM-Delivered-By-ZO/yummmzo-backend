/*
  Warnings:

  - Added the required column `closingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Restaurant` table without a default value. This is not possible if the table is not empty.
  - Added the required column `openingTime` to the `Restaurant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Category` ADD COLUMN `sortOrder` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Menu_Item` ADD COLUMN `isBestseller` BOOLEAN NOT NULL DEFAULT false,
    ADD COLUMN `rating` DOUBLE NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Restaurant` ADD COLUMN `closingTime` VARCHAR(5) NOT NULL,
    ADD COLUMN `isActive` BOOLEAN NOT NULL DEFAULT true,
    ADD COLUMN `latitude` DOUBLE NOT NULL,
    ADD COLUMN `longitude` DOUBLE NOT NULL,
    ADD COLUMN `openingTime` VARCHAR(5) NOT NULL;
