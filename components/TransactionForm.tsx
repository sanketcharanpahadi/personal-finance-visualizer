"use client";

import { TransactionSchema } from "@/schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { CalendarIcon } from "lucide-react";
import { useTransition } from "react";
import { createTransaction } from "@/actions/transaction";
import { Category } from "@prisma/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectGroup,
} from "./ui/select";

const TransactionForm = ({ categories }: { categories: Category[] }) => {
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof TransactionSchema>>({
    resolver: zodResolver(TransactionSchema),
    defaultValues: {
      amount: 0,
      description: undefined,
      date: new Date(),
      categoryId: undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof TransactionSchema>) => {
    console.log(values);
    startTransition(() => {
      createTransaction({
        amount: values.amount,
        description: values.description,
        date: values.date,
        categoryId: values.categoryId,
      })
        .then((res) => {
          form.reset();
          if (res.success) {
            console.log("Transaction added");
          } else {
            console.error(res.message);
          }
        })
        .catch((error) => {
          console.error(error);
        });
    });
  };

  return (
    <div className="px-4 py-4">
      <h1 className="mb-3 text-2xl font-semibold">Add Transaction</h1>
      <Form {...form}>
        <form
          className="flex flex-col gap-3"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex gap-3">
            <div>
              <FormField
                control={form.control}
                name="categoryId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select a Category" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {/* <SelectIt */}
                            {categories.map((category) => (
                              <SelectItem value={category.id} key={category.id}>
                                <div className="flex items-center gap-2">
                                  <div
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: category.color }}
                                  />
                                  {category.name}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input {...field} type="number" />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <>
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Description"
                        />
                      </FormControl>
                    </FormItem>
                    <FormMessage />
                  </>
                )}
              />
            </div>
            <div>
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="items-start">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button variant={"outline"}>
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent>
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date > new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div>
            <Button
              type="submit"
              variant="default"
              disabled={isPending}
              className="cursor-pointer"
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </Form>
      {/* <button onClick={onClick}>LOL</button> */}
    </div>
  );
};

export default TransactionForm;
