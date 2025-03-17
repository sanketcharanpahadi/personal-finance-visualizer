import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import EditTransactionDialog from "./EditTransactionDialog";
import { Transaction } from "./TransactionColumns";
import { deleteTransaction } from "@/actions/transaction";
import { useEffect, useState } from "react";
import { Category } from "@prisma/client";
import { getAllCategories } from "@/actions/category";

const ActionsDropdown = (transaction: Transaction) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  async function Delete() {
    const res = await deleteTransaction(transaction.id);
    if (res.success) {
      console.log(res.message);
    } else {
      console.error(res.message);
    }
  }

  async function fetchCategoriesData() {
    const response = await getAllCategories();
    if (response.success && response.data) {
      setCategories(response.data);
    } else {
      console.log(response.message);
    }
  }

  useEffect(() => {
    fetchCategoriesData();
  }, []);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="h-8 w-8 p-0 cursor-pointer">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-40 border bg-background rounded-md shadow-lg"
      >
        <DropdownMenuItem
          className="cursor-pointer focus:bg-accent"
          onClick={() => setOpenDialog(true)}
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer text-destructive focus:bg-destructive/10"
          onClick={Delete}
        >
          Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
      <EditTransactionDialog
        amount={transaction.amount}
        date={transaction.date}
        description={transaction.description}
        id={transaction.id}
        open={openDialog}
        setOpen={setOpenDialog}
        categories={categories}
        category={transaction.category}
      />
    </DropdownMenu>
  );
};

export default ActionsDropdown;
