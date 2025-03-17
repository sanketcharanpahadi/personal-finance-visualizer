"use server";

import { db } from "@/lib/db";

export const getCategoryTotals = async () => {
  try {
    const result = await db.transaction.groupBy({
      by: ["categoryId"],
      _sum: {
        amount: true,
      },
    });
    const categories = await db.category.findMany({});
    const categoryTotals = result.map(({ categoryId, _sum }) => {
      const category = categories.find((c) => c.id === categoryId);
      return {
        name: category?.name || null,
        color: category?.color || "#64748b",
        total: _sum.amount || 0,
      };
    });
    return {
      success: true,
      data: categoryTotals,
      message: "successfully fetched category-wise amount",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "falied",
    };
  }
};

export const getMonthlyTotals = async () => {
  try {
    const result = await db.transaction.aggregateRaw({
      pipeline: [
        {
          $group: {
            _id: {
              $dateToString: { format: "%Y-%m", date: "$date" },
            },
            total: { $sum: "$amount" },
          },
        },
        { $sort: { _id: 1 } },
      ],
    });

    console.log(result);

    const monthlyData = (
      result as unknown as Array<{ _id: string; total: number }>
    ).map(({ _id, total }) => ({
      month: _id,
      total,
    }));

    return {
      success: true,
      message: "successfully fetched data",
      data: monthlyData,
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "falied",
    };
  }
};

export const getBudgetComparison = async () => {
  try {
    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();

    const [budgets, expenses] = await Promise.all([
      db.budget.findMany({
        where: { month: currentMonth, year: currentYear },
        include: { category: true },
      }),
      db.transaction.groupBy({
        by: ["categoryId"],
        _sum: { amount: true },
        where: {
          date: {
            gte: new Date(currentYear, currentMonth - 1, 1),
            lt: new Date(currentYear, currentMonth, 1),
          },
        },
      }),
    ]);

    const mapped_budget = budgets.map((budget) => ({
      category: budget.category.name,
      budget: budget.amount,
      actual:
        expenses.find((e) => e.categoryId === budget.categoryId)?._sum.amount ||
        0,
    }));
    return {
      success: true,
      data: mapped_budget,
      message: "successfully fetched",
    };
  } catch (error) {
    console.log(error);
    return {
      success: false,
      data: null,
      message: "falied",
    };
  }
};
