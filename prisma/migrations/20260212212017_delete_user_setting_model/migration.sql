/*
  Warnings:

  - You are about to drop the `User_Setting` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[userId]` on the table `Setting` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Setting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Setting` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `User_Setting` DROP FOREIGN KEY `User_Setting_userId_fkey`;

-- AlterTable
ALTER TABLE `Setting` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `User_Setting`;

-- CreateIndex
CREATE UNIQUE INDEX `Setting_userId_key` ON `Setting`(`userId`);

-- AddForeignKey
ALTER TABLE `Setting` ADD CONSTRAINT `Setting_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
