/*
  Warnings:

  - A unique constraint covering the columns `[clerkUserId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `user` ADD COLUMN `clerkUserId` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `User_clerkUserId_key` ON `User`(`clerkUserId`);
