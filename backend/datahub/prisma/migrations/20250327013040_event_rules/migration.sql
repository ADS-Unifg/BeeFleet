/*
  Warnings:

  - A unique constraint covering the columns `[checkoutEventId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `Event` ADD COLUMN `checkoutEventId` VARCHAR(191) NULL,
    ADD COLUMN `status` ENUM('PENDING', 'ACTIVE', 'COMPLETED', 'CANCELLED') NOT NULL DEFAULT 'PENDING';

-- CreateIndex
CREATE UNIQUE INDEX `Event_checkoutEventId_key` ON `Event`(`checkoutEventId`);

-- AddForeignKey
ALTER TABLE `Event` ADD CONSTRAINT `Event_checkoutEventId_fkey` FOREIGN KEY (`checkoutEventId`) REFERENCES `Event`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
