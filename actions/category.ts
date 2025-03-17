"use server";
import { db } from "@/lib/db";

export const getAllCategories = async () => {
  try {
    const categories = await db.category.findMany({});
    if (!categories) {
      throw new Error("Couldn't find categories");
    }
    return {
      success: true,
      message: "categories successfully fetched",
      data: categories,
    };
  } catch (error) {
    return {
      data: null,
      message: error instanceof Error ? error.message : "Something went wrong",
      success: false,
    };
  }
};
