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

type FormValues = {
  slipNo: string;
  date: string;
  farmer: string;
  location: string;
  mobile: string;
  item: string;
  grade: string;
  rate: number;
  weights: { value: number }[];
};

function generateSlipNumber() {
  const today = new Date();
  const datePart = today.toISOString().slice(0, 10).replace(/-/g, "");

  const lastNumber = Number(localStorage.getItem("lastSlipNo") || 0) + 1;
  localStorage.setItem("lastSlipNo", String(lastNumber));

  return `NS-${datePart}-${String(lastNumber).padStart(3, "0")}`;
}

export default function ModernInventorySlipForm() {
  const form = useForm<FormValues>({
    defaultValues: {
      slipNo: "",
      date: new Date().toISOString().split("T")[0],
      farmer: "",
      location: "",
      mobile: "",
      item: "",
      grade: "",
      rate: 0,
      weights: [{ value: 0 }],
    },
  });

  useEffect(() => {
    form.setValue("slipNo", generateSlipNumber());
  }, []);

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

  const totalWeight = useMemo(() => {
    return weights?.reduce((sum, w) => sum + (Number(w.value) || 0), 0);
  }, [weights]);

  const totalAmount = useMemo(() => {
    return totalWeight * (Number(rate) || 0);
  }, [totalWeight, rate]);

  function onSubmit(values: FormValues) {
    console.log(values);
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* HEADER */}
          <div className="flex justify-between items-center bg-primary/5 dark:bg-primary/10 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-primary">
              स्लिप #{form.watch("slipNo")}
            </h2>
            <span className="text-sm text-muted-foreground">
              {form.watch("date")}
            </span>
          </div>

          {/* GRID LAYOUT */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* LEFT COLUMN */}
            <div className="space-y-6">
              {/* Farmer Info */}
              <Card className="bg-card/60 backdrop-blur">
                <CardContent className="space-y-4 p-5">
                  <FormField
                    control={form.control}
                    name="farmer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>नाम</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Farmer Name" />
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
                          <Input {...field} placeholder="Location" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="mobile"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>मोबाइल नं.</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Item Details */}
              <Card className="bg-secondary/30 dark:bg-secondary/20">
                <CardContent className="space-y-4 p-5">
                  <FormField
                    control={form.control}
                    name="item"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>वस्तु</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Chilli" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="grade"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>ग्रेड</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="rate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>दर (₹/kg)</FormLabel>
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

            {/* RIGHT COLUMN */}
            <div className="space-y-6">
              {/* Weights */}
              <Card>
                <CardContent className="space-y-4 p-5">
                  <h3 className="font-semibold">वजन</h3>

                  {fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="flex items-center justify-between bg-muted/40 dark:bg-muted/20 p-3 rounded-md"
                    >
                      <span>{index + 1}</span>

                      <FormField
                        control={form.control}
                        name={`weights.${index}.value`}
                        render={({ field }) => (
                          <Input
                            type="number"
                            step="0.1"
                            {...field}
                            className="w-24 text-right"
                          />
                        )}
                      />

                      <span>kg</span>

                      <Trash2
                        size={16}
                        className="cursor-pointer text-muted-foreground"
                        onClick={() => remove(index)}
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

              {/* Summary */}
              <Card className="bg-primary/5 dark:bg-primary/10">
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between">
                    <span>कुल वजन</span>
                    <span className="font-medium">
                      {totalWeight.toFixed(2)} kg
                    </span>
                  </div>

                  <div className="flex justify-between text-lg font-semibold text-primary">
                    <span>कुल राशि</span>
                    <span>₹{totalAmount.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Button
            variant="secondary"
            className="w-full h-12 font-semibold bg-[#E8DCC8] dark:bg-[#3A3126]"
          >
            स्लिप सहेजें
          </Button>
          {/* Terms */}
          <Card>
            <CardContent className="p-4 text-xs text-muted-foreground space-y-2">
              <h4 className="font-medium">नियम एवं शर्तें</h4>
              <p>1. माल सूखा होना अनिवार्य है। सही वजन की जांच कर लें।</p>
              <p>2. भुगतान सरकारी नियम अनुसार बैंक खाते में भेजा जाएगा।</p>
              <p>3. वजन की जांच कर लें।</p>
            </CardContent>
          </Card>
        </form>
      </Form>
    </div>
  );
}
