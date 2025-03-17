"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdateTransactionSchema } from "@/schemas";
import { Transaction } from "./TransactionColumns";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "./ui/calendar";
import { useTransition } from "react";
import { updateTransaction } from "@/actions/transaction";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Category } from "@prisma/client";

const EditTransactionDialog = (
  props: Transaction & {
    open: boolean;
    setOpen: (val: boolean) => void;
    categories: Category[];
  }
) => {
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof UpdateTransactionSchema>>({
    resolver: zodResolver(UpdateTransactionSchema),
    defaultValues: {
      amount: props.amount,
      description: props.description || undefined,
      date: props.date,
      id: props.id,
      categoryId: props.category?.id || undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof UpdateTransactionSchema>) => {
    // console.log("HELLO", values);
    startTransition(() => {
      updateTransaction({
        amount: values.amount,
        date: values.date,
        description: values.description || "",
        id: values.id,
        categoryId: values.categoryId,
      }).then((res) => {
        if (res.success) {
          console.log(res.message);
        } else {
          console.error("ERROR:", res.message);
        }
        props.setOpen(false);
      });
    });
  };
  return (
    <div>
      <Dialog open={props.open} onOpenChange={props.setOpen}>
        <DialogContent style={{ maxWidth: "700px" }}>
          <DialogHeader>
            <DialogTitle>Edit Transaction</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form
              className="flex items-end gap-3 flex-col w-full"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="flex gap-3">
                <div>
                  {" "}
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            value={field.value}
                          >
                            <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {/* <SelectIt */}
                                {props.categories.map((category) => (
                                  <SelectItem
                                    value={category.id}
                                    key={category.id}
                                  >
                                    <div className="flex items-center gap-2">
                                      <div
                                        className="h-3 w-3 rounded-full"
                                        style={{
                                          backgroundColor: category.color,
                                        }}
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

              <div className="flex gap-3">
                <Button
                  type="submit"
                  variant="default"
                  disabled={isPending}
                  className="cursor-pointer"
                >
                  Save
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  disabled={isPending}
                  className="cursor-pointer"
                  onClick={() => {
                    props.setOpen(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditTransactionDialog;
