"use server";

import { db } from "@/lib/db";
import { BudgetSchema } from "@/schemas";
import * as z from "zod";

export const setBudget = async (values: z.infer<typeof BudgetSchema>) => {
  try {
    const validatedFields = BudgetSchema.safeParse(values);
    if (!validatedFields.success) {
      throw new Error("Invalid inputs recieved");
    }
    const { amount, categoryId, month, year } = validatedFields.data;
    const budget = await db.budget.upsert({
      where: {
        categoryId_month_year: {
          categoryId,
          month,
          year,
        },
      },
      create: {
        categoryId,
        amount,
        month,
        year,
      },
      update: {
        amount,
      },
    });

    return {
      data: budget,
      message: "Budget successfuly saved",
      success: true,
    };
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    };
  }
};
