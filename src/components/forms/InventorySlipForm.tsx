"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trash2, Plus } from "lucide-react";

export type FormValues = {
  slipNo: string;
  date: string;
  farmer: string;
  location: string;
  mobile: string;
  item: string;
  type: string;
  grade: string;
  rate: number;
  weights: { value: number }[];
};

type Props = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
};

const ITEM_OPTIONS = {
  mahii: {
    label: "Mahii",
    types: ["WS", "DC"],
  },
  seedVariety: {
    label: "Seed Variety",
    types: ["WS", "DC"],
  },
};

const GRADES = ["A", "B", "C", "D"];

function generateSlipNumber() {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");

  const lastNumber = Number(localStorage.getItem("lastSlipNo") || 0) + 1;
  localStorage.setItem("lastSlipNo", String(lastNumber));

  return `NS-${datePart}-${String(lastNumber).padStart(3, "0")}`;
}

export default function ModernInventorySlipForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: defaultValues
      ? {
          ...defaultValues,
          date: defaultValues.date.split("T")[0],
        }
      : {
          slipNo: "",
          date: new Date().toISOString().split("T")[0],
          farmer: "",
          location: "",
          mobile: "",
          item: "",
          type: "",
          grade: "",
          rate: 0,
          weights: [{ value: 0 }],
        },
  });

  useEffect(() => {
    if (!defaultValues) {
      form.setValue("slipNo", generateSlipNumber());
    }
  }, [defaultValues]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "weights",
  });

  const weights = useWatch({
    control: form.control,
    name: "weights",
  });

  const rate = useWatch({
    control: form.control,
    name: "rate",
  });

  const selectedItem = useWatch({
    control: form.control,
    name: "item",
  });

  const totalWeight = useMemo(() => {
    return weights?.reduce((sum, w) => sum + (Number(w.value) || 0), 0);
  }, [weights]);

  const totalAmount = useMemo(() => {
    return totalWeight * (Number(rate) || 0);
  }, [totalWeight, rate]);

  function handleSubmit(values: FormValues) {
    onSubmit(values);
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          {/* HEADER */}
          <div className="flex justify-between items-center bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-primary">
              स्लिप #{form.watch("slipNo")}
            </h2>

            <span className="text-sm text-muted-foreground">
              {form.watch("date")}
            </span>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 gap-2">
            {/* LEFT */}
            <div className="space-y-4">
              {/* Farmer Info */}
              <Card>
                <CardContent className="space-y-4 p-5">
                  <FormField
                    control={form.control}
                    name="farmer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>नाम</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>स्थान</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>मोबाइल</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Item */}
              <Card>
                <CardContent className="space-y-4 p-5">
                  <FormField
                    control={form.control}
                    name="item"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>वस्तु</FormLabel>
                        <FormControl>
                          <select
                            {...field}
                            className="w-full border rounded-md h-10 px-3"
                          >
                            <option value="">Select</option>
                            {Object.entries(ITEM_OPTIONS).map(([k, v]) => (
                              <option key={k} value={k}>
                                {v.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-3 gap-4">
                    {/* Type */}
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full border rounded-md h-10 px-3"
                            >
                              <option value="">Select</option>

                              {selectedItem &&
                                ITEM_OPTIONS[
                                  selectedItem as keyof typeof ITEM_OPTIONS
                                ]?.types.map((t) => (
                                  <option key={t} value={t}>
                                    {t}
                                  </option>
                                ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Grade */}
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ग्रेड</FormLabel>
                          <FormControl>
                            <select
                              {...field}
                              className="w-full border rounded-md h-10 px-3"
                            >
                              <option value="">Select</option>
                              {GRADES.map((g) => (
                                <option key={g}>{g}</option>
                              ))}
                            </select>
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    {/* Rate */}
                    <FormField
                      control={form.control}
                      name="rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>दर</FormLabel>
                          <FormControl>
                            <Input type="number" {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* RIGHT */}
            <div className="space-y-4">
              {/* Weights */}
              <Card>
                <CardContent className="space-y-4 p-5">
                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between bg-muted p-3 rounded"
                    >
                      <span>{index + 1}</span>

                      <FormField
                        control={form.control}
                        name={`weights.${index}.value`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            {...field}
                            className="w-24 text-right"
                          />
                        )}
                      />

                      <Trash2
                        size={16}
                        onClick={() => remove(index)}
                        className="cursor-pointer"
                      />
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => append({ value: 0 })}
                  >
                    <Plus size={16} className="mr-2" />
                    वजन जोड़ें
                  </Button>
                </CardContent>
              </Card>

              {/* SUMMARY */}
              <Card>
                <CardContent className="p-5 space-y-2">
                  <div className="flex justify-between">
                    <span>Total Weight</span>
                    <span>{totalWeight.toFixed(2)} kg</span>
                  </div>

                  <div className="flex justify-between font-semibold">
                    <span>Total Amount</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* SUBMIT */}
          <Button type="submit" disabled={isSubmitting} className="w-full h-12">
            {isSubmitting ? "Saving..." : "Save Slip"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
