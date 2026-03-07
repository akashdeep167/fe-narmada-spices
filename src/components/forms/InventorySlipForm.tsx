"use client";

import { useEffect, useMemo } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import { Form, FormField } from "@/components/ui/form";
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
  createdById: number;
  weights: { value: number }[];
};

type Props = {
  defaultValues?: FormValues;
  onSubmit: (values: FormValues) => void;
  isSubmitting?: boolean;
};

const ITEM_OPTIONS = [
  { value: "Mahii", label: "Mahii", types: ["WS", "DC"] },
  { value: "Seed Variety", label: "Seed Variety", types: ["WS", "DC"] },
];

const GRADES = ["A", "B", "C", "D"];

function generateSlipNumber() {
  const datePart = new Date().toISOString().slice(0, 10).replace(/-/g, "");
  const n = Number(localStorage.getItem("lastSlipNo") || 0) + 1;
  localStorage.setItem("lastSlipNo", String(n));
  return `NS-${datePart}-${String(n).padStart(3, "0")}`;
}

const inputCls =
  "w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 placeholder:text-gray-400";

const selectCls =
  "w-full h-10 rounded-lg border border-gray-200 bg-white px-3 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 appearance-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed";

function SectionCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-gray-400">
        {title}
      </p>
      {children}
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-medium text-gray-500">{label}</label>
      {children}
    </div>
  );
}

export default function InventorySlipForm({
  defaultValues,
  onSubmit,
  isSubmitting,
}: Props) {
  const form = useForm<FormValues>({
    defaultValues: defaultValues
      ? { ...defaultValues, date: defaultValues.date.split("T")[0] }
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
          createdById: 1,
          weights: [{ value: 0 }],
        },
  });

  useEffect(() => {
    if (!defaultValues) form.setValue("slipNo", generateSlipNumber());
  }, []);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "weights",
  });
  const weights = useWatch({ control: form.control, name: "weights" });
  const rate = useWatch({ control: form.control, name: "rate" });
  const selectedItem = useWatch({ control: form.control, name: "item" });

  // ✅ Find the selected item object to get its types
  const selectedItemObj = ITEM_OPTIONS.find((o) => o.value === selectedItem);

  const totalWeight = useMemo(
    () => weights?.reduce((s, w) => s + (Number(w.value) || 0), 0) ?? 0,
    [weights],
  );
  const totalAmount = useMemo(
    () => totalWeight * (Number(rate) || 0),
    [totalWeight, rate],
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-6 pb-16 font-sans">
      <div className="mx-auto flex max-w-md flex-col gap-3">
        {/* ── Header ── */}
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-white px-4 py-3">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              स्लिप
            </p>
            <p className="mt-0.5 text-lg font-semibold text-indigo-500">
              {form.watch("slipNo")}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400">
              दिनांक
            </p>
            <p className="mt-0.5 text-sm font-medium text-gray-700">
              {form.watch("date")}
            </p>
          </div>
        </div>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-3"
          >
            {/* ── Farmer Info ── */}
            <SectionCard title="किसान की जानकारी">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="farmer"
                  render={({ field }) => (
                    <Field label="नाम">
                      <input
                        className={inputCls}
                        placeholder="किसान का नाम"
                        {...field}
                      />
                    </Field>
                  )}
                />
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <Field label="स्थान">
                      <input
                        className={inputCls}
                        placeholder="गाँव / शहर"
                        {...field}
                      />
                    </Field>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <Field label="मोबाइल">
                      <input
                        className={inputCls}
                        placeholder="मोबाइल नंबर"
                        type="tel"
                        {...field}
                      />
                    </Field>
                  )}
                />
              </div>
            </SectionCard>

            {/* ── Item Details ── */}
            <SectionCard title="वस्तु की जानकारी">
              <div className="flex flex-col gap-3">
                <FormField
                  control={form.control}
                  name="item"
                  render={({ field }) => (
                    <Field label="वस्तु">
                      <select
                        className={selectCls}
                        value={field.value}
                        onChange={(e) => {
                          field.onChange(e.target.value);
                          // Reset type when item changes
                          form.setValue("type", "");
                        }}
                      >
                        <option value="">चुनें…</option>
                        {/* ✅ option value = o.value ("mahii" / "seed_variety"), not the object key */}
                        {ITEM_OPTIONS.map((o) => (
                          <option key={o.value} value={o.value}>
                            {o.label}
                          </option>
                        ))}
                      </select>
                    </Field>
                  )}
                />

                <div className="grid grid-cols-3 gap-2">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <Field label="Type">
                        <select
                          className={selectCls}
                          {...field}
                          disabled={!selectedItem}
                        >
                          <option value="">—</option>
                          {/* ✅ types come from the found item object */}
                          {selectedItemObj?.types.map((t) => (
                            <option key={t} value={t}>
                              {t}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="grade"
                    render={({ field }) => (
                      <Field label="ग्रेड">
                        <select className={selectCls} {...field}>
                          <option value="">—</option>
                          {GRADES.map((g) => (
                            <option key={g} value={g}>
                              {g}
                            </option>
                          ))}
                        </select>
                      </Field>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="rate"
                    render={({ field }) => (
                      <Field label="दर (₹)">
                        <input
                          className={inputCls}
                          type="number"
                          placeholder="0"
                          min="0"
                          step="0.01"
                          {...field}
                        />
                      </Field>
                    )}
                  />
                </div>
              </div>
            </SectionCard>

            {/* ── Weights ── */}
            <SectionCard title="वजन">
              <div className="flex flex-col gap-2">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="group flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <span className="w-5 shrink-0 text-xs text-gray-300">
                      {index + 1}
                    </span>
                    <FormField
                      control={form.control}
                      name={`weights.${index}.value`}
                      render={({ field }) => (
                        <input
                          type="number"
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                          {...field}
                          className="flex-1 bg-transparent text-right text-[15px] font-medium text-gray-900 outline-none placeholder:text-gray-300"
                        />
                      )}
                    />
                    <span className="text-xs text-gray-400">kg</span>
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      disabled={fields.length === 1}
                      className="ml-1 text-gray-300 opacity-0 transition hover:text-red-400 group-hover:opacity-100 disabled:pointer-events-none"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => append({ value: 0 })}
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-gray-200 py-2 text-sm text-gray-400 transition hover:border-indigo-400 hover:text-indigo-500"
              >
                <Plus size={13} /> वजन जोड़ें
              </button>
            </SectionCard>

            {/* ── Summary ── */}
            <div className="rounded-xl border border-gray-100 bg-white px-4 py-3">
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500">कुल वजन</span>
                <span className="text-sm font-medium text-gray-800">
                  {totalWeight.toFixed(2)} kg
                </span>
              </div>
              <div className="my-1 h-px bg-gray-100" />
              <div className="flex items-center justify-between py-1">
                <span className="text-sm text-gray-500">कुल राशि</span>
                <span className="text-xl font-bold text-indigo-500">
                  ₹
                  {totalAmount.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </span>
              </div>
            </div>

            {/* ── Submit ── */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-11 w-full rounded-xl bg-indigo-500 text-sm font-semibold text-white transition hover:bg-indigo-600 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "सहेजा जा रहा है…" : "स्लिप सहेजें"}
            </button>
          </form>
        </Form>
      </div>
    </div>
  );
}
