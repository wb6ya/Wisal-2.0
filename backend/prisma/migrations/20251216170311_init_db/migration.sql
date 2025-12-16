-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'AGENT', 'SUPER_ADMIN');

-- CreateEnum
CREATE TYPE "PlanType" AS ENUM ('STARTER', 'GROWTH', 'ENTERPRISE');

-- CreateEnum
CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIAL');

-- CreateEnum
CREATE TYPE "AddonType" AS ENUM ('STORAGE_GB', 'EXTRA_USER', 'EXTRA_CHANNEL');

-- CreateEnum
CREATE TYPE "Platform" AS ENUM ('WHATSAPP', 'TELEGRAM', 'INSTAGRAM', 'TWITTER', 'WEB');

-- CreateEnum
CREATE TYPE "ConversationStatus" AS ENUM ('OPEN', 'PENDING', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "MsgType" AS ENUM ('TEXT', 'IMAGE', 'VIDEO', 'AUDIO', 'DOCUMENT', 'LOCATION', 'INTERACTIVE');

-- CreateEnum
CREATE TYPE "MsgDir" AS ENUM ('INCOMING', 'OUTGOING');

-- CreateEnum
CREATE TYPE "MsgStatus" AS ENUM ('SENT', 'DELIVERED', 'READ', 'FAILED');

-- CreateEnum
CREATE TYPE "StepType" AS ENUM ('MESSAGE', 'MENU', 'INPUT', 'ACTION_ASSIGN', 'ACTION_TAG');

-- CreateTable
CREATE TABLE "Tenant" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "plan" "PlanType" NOT NULL DEFAULT 'STARTER',
    "subscriptionStatus" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "subscriptionEndsAt" TIMESTAMP(3),
    "maxAgents" INTEGER NOT NULL DEFAULT 2,
    "baseStorageLimitMB" INTEGER NOT NULL DEFAULT 1000,
    "extraStoragePurchasedMB" INTEGER NOT NULL DEFAULT 0,
    "mediaRetentionDays" INTEGER NOT NULL DEFAULT 60,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tenant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubscriptionAddon" (
    "id" TEXT NOT NULL,
    "type" "AddonType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "cost" DOUBLE PRECISION NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "SubscriptionAddon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'AGENT',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT,
    "email" TEXT,
    "tags" TEXT[],
    "notes" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactChannel" (
    "id" TEXT NOT NULL,
    "platform" "Platform" NOT NULL,
    "identifier" TEXT NOT NULL,
    "contactId" TEXT NOT NULL,

    CONSTRAINT "ContactChannel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "status" "ConversationStatus" NOT NULL DEFAULT 'OPEN',
    "channel" "Platform" NOT NULL,
    "unreadCount" INTEGER NOT NULL DEFAULT 0,
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "contactId" TEXT NOT NULL,
    "assigneeId" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Message" (
    "id" TEXT NOT NULL,
    "content" TEXT,
    "mediaUrl" TEXT,
    "mediaType" TEXT,
    "type" "MsgType" NOT NULL DEFAULT 'TEXT',
    "direction" "MsgDir" NOT NULL,
    "status" "MsgStatus" NOT NULL DEFAULT 'SENT',
    "conversationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Flow" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "triggerKeyword" TEXT,
    "tenantId" TEXT NOT NULL,

    CONSTRAINT "Flow_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowStep" (
    "id" TEXT NOT NULL,
    "flowId" TEXT NOT NULL,
    "type" "StepType" NOT NULL,
    "content" JSONB NOT NULL,
    "position" JSONB,
    "parentId" TEXT,

    CONSTRAINT "FlowStep_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlowConnection" (
    "id" TEXT NOT NULL,
    "sourceStepId" TEXT NOT NULL,
    "targetStepId" TEXT NOT NULL,
    "triggerValue" TEXT,

    CONSTRAINT "FlowConnection_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tenant_email_key" ON "Tenant"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "ContactChannel_platform_identifier_contactId_key" ON "ContactChannel"("platform", "identifier", "contactId");

-- AddForeignKey
ALTER TABLE "SubscriptionAddon" ADD CONSTRAINT "SubscriptionAddon_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contact" ADD CONSTRAINT "Contact_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ContactChannel" ADD CONSTRAINT "ContactChannel_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_contactId_fkey" FOREIGN KEY ("contactId") REFERENCES "Contact"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_assigneeId_fkey" FOREIGN KEY ("assigneeId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Flow" ADD CONSTRAINT "Flow_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowStep" ADD CONSTRAINT "FlowStep_flowId_fkey" FOREIGN KEY ("flowId") REFERENCES "Flow"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowStep" ADD CONSTRAINT "FlowStep_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "FlowStep"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowConnection" ADD CONSTRAINT "FlowConnection_sourceStepId_fkey" FOREIGN KEY ("sourceStepId") REFERENCES "FlowStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlowConnection" ADD CONSTRAINT "FlowConnection_targetStepId_fkey" FOREIGN KEY ("targetStepId") REFERENCES "FlowStep"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
