/*
  Warnings:

  - You are about to alter the column `spiceLevel` on the `Menu_Item` table. The data in that column could be lost. The data in that column will be cast from `VarChar(20)` to `Enum(EnumId(3))`.

*/
-- AlterTable
ALTER TABLE `Menu_Item` ADD COLUMN `dietaryPlan` ENUM('VEGETARIAN', 'VEGAN', 'GLUTEN_FREE', 'HALAL') NOT NULL DEFAULT 'VEGETARIAN',
    MODIFY `spiceLevel` ENUM('NORMAL', 'MILD', 'MEDIUM', 'HOT', 'EXTRA_SPICY') NULL DEFAULT 'NORMAL';
