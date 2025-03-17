"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import ActionsDropdown from "./ActionsDropdown";
import { Category } from "@prisma/client";

export type Transaction = {
  amount: number;
  description: string | null;
  date: Date;
  id: string;
  category: Category | null;
};

export const TransactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      const category = row.getValue("category") as Category | null;
      const category_name = category?.name || "NO_CATEGORY";
      return <div>{category_name}</div>;
    },
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      return (
        <div className="font-medium">₹{amount.toLocaleString("en-IN")}</div>
      );
    },
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => {
      const date = row.getValue("date") as Date;
      const month = format(date, "LLLL");

      return (
        <div>
          {month} {date.getDate()}, {date.getFullYear()}
        </div>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Description",
    cell: ({ row }) => {
      const description = row.getValue("description") as string | null;

      return <div>{description ? description : "No Description"}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const transaction = row.original;

      return <ActionsDropdown {...transaction} />;
    },
  },
];
