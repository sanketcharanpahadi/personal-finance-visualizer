"use server";

import { db } from "@/lib/db";
import { TransactionSchema, UpdateTransactionSchema } from "@/schemas";
import { revalidatePath } from "next/cache";
import * as z from "zod";

export const getAllTransactions = async () => {
  try {
    const transactions = await db.transaction.findMany({
      include: {
        category: true,
      },
    });
    if (!transactions) {
      throw new Error("Couldn't find transactions");
    }
    return {
      data: transactions,
      success: true,
      message: "Transaction successfully created",
    };
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    };
  }
};

export const createTransaction = async (
  values: z.infer<typeof TransactionSchema>
) => {
  try {
    const validatedFields = TransactionSchema.safeParse(values);
    if (!validatedFields.success) {
      throw new Error("Provide valid values");
    }
    const { amount, date, description, categoryId } = validatedFields.data;
    console.log(validatedFields.data);
    const new_transaction = await db.transaction.create({
      data: {
        amount,
        date,
        description,
        categoryId,
      },
    });
    if (!new_transaction) {
      throw new Error("Transaction could not be created, Please try again!");
    }
    revalidatePath("/");
    return {
      data: {
        amount: new_transaction.amount,
        date: new_transaction.date,
        description: new_transaction.description,
        categoryId: new_transaction.categoryId,
      },
      success: true,
      message: "Transaction successfully created",
    };
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    };
  }
};

export const updateTransaction = async (
  data: z.infer<typeof UpdateTransactionSchema>
) => {
  try {
    const validatedFields = UpdateTransactionSchema.safeParse(data);

    if (!validatedFields.success) {
      throw new Error("Invalid values");
    }

    const { id, amount, date, description, categoryId } = validatedFields.data;
    console.log(id, amount, date, description, categoryId);

    const existing = await db.transaction.findUnique({
      where: {
        id: validatedFields.data.id,
      },
    });

    if (!existing) {
      throw new Error("Transaction does not exist");
    }

    const updatedTransaction = await db.transaction.update({
      where: {
        id,
      },
      data: {
        amount,
        date,
        description,
        categoryId,
      },
    });

    revalidatePath("/transactions");
    return {
      success: true,
      data: updatedTransaction,
      message: "Transaction updated successfully",
    };
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    };
  }
};

export const deleteTransaction = async (id: string) => {
  try {
    if (!id) {
      throw new Error("Provide valid values");
    }
    const transactionExist = await db.transaction.findFirst({
      where: {
        id,
      },
    });
    if (!transactionExist) {
      throw new Error("Transaction does not exist");
    }

    await db.transaction.delete({ where: { id } });
    revalidatePath("/");
    return {
      data: null,
      success: true,
      message: "Transaction successfully deleted",
    };
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    };
  }
};
