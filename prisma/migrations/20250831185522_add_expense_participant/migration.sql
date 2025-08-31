-- AlterTable
ALTER TABLE "public"."Expense" ADD COLUMN     "isDeleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "public"."ExpenseParticipant" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "expenseId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "owes" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "paid" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExpenseParticipant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseParticipant_id_key" ON "public"."ExpenseParticipant"("id");

-- AddForeignKey
ALTER TABLE "public"."ExpenseParticipant" ADD CONSTRAINT "ExpenseParticipant_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."ExpenseParticipant" ADD CONSTRAINT "ExpenseParticipant_expenseId_fkey" FOREIGN KEY ("expenseId") REFERENCES "public"."Expense"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
