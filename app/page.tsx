import {
  getBudgetComparison,
  getCategoryTotals,
  getMonthlyTotals,
} from "@/actions/analytics";
import { getAllCategories } from "@/actions/category";
import { getAllTransactions } from "@/actions/transaction";
import BudgetAndActualBarChart from "@/components/BudgetAndActualBarChart";
import CategoryTotalPieChart from "@/components/CategoryTotalPieChart";
import DataTable from "@/components/data-table";
import MonthlyTotalBarChart from "@/components/MonthlyTotalBarChart";
import { TransactionColumns } from "@/components/TransactionColumns";
import TransactionForm from "@/components/TransactionForm";
import BudgetForm from "@/components/ui/BudgetForm";

export default async function Home() {
  try {
    const [
      transactionsData,
      categories,
      categoryData,
      monthlyAmountData,
      budgetAndActualData,
    ] = await Promise.all([
      getAllTransactions(),
      getAllCategories(),
      getCategoryTotals(),
      getMonthlyTotals(),
      getBudgetComparison(),
    ]);

    return (
      <div>
        <TransactionForm categories={categories.data || []} />
        <BudgetForm categories={categories.data || []} />
        <div className="mt-10">
          <DataTable
            columns={TransactionColumns}
            data={transactionsData.data === null ? [] : transactionsData.data}
          />
        </div>
        {/* <div></div> */}
        <div className="my-10 flex justify-center gap-10 items-center flex-col">
          <CategoryTotalPieChart categoryData={categoryData.data || []} />
          <MonthlyTotalBarChart data={monthlyAmountData.data || []} />
          <BudgetAndActualBarChart data={budgetAndActualData.data || []} />
        </div>
      </div>
    );
  } catch (error) {
    console.log(error);
    return <div>Something went wrong, Try again Reloading</div>;
  }
}
