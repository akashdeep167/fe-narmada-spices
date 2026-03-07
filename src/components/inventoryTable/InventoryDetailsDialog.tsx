import { useState, useEffect } from "react";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { useUpdatePurchaseSlip } from "@/hooks/useUpdatePurchaseSlip";
import { useDeletePurchaseSlip } from "@/hooks/useDeletePurchaseSlip";

import type { Inventory } from "./InventoryTable";

import { Pencil, Plus, Trash2, X } from "lucide-react";

type Props = {
  data: Inventory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InventoryDetailsPanel({ data, open, onOpenChange }: Props) {
  const updateMutation = useUpdatePurchaseSlip();
  const deleteMutation = useDeletePurchaseSlip();

  const [editableData, setEditableData] = useState<Inventory | null>(null);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!data) return;
    setEditableData(JSON.parse(JSON.stringify(data)));
    setIsDirty(false);
  }, [data]);

  if (!editableData) return null;

  const updateField = (field: keyof Inventory, value: any) => {
    setEditableData((prev) => {
      if (!prev) return prev;
      setIsDirty(true);
      return { ...prev, [field]: value };
    });
  };

  const updateWeights = (weights: number[]) => {
    setEditableData((prev) => {
      if (!prev) return prev;

      setIsDirty(true);

      const totalWeight = weights.reduce((s, w) => s + w, 0);

      return {
        ...prev,
        weights: weights.map((w, i) => ({
          id: prev.weights?.[i]?.id ?? i,
          value: w,
          slipId: prev.id,
        })),
        totalWeight,
        totalAmount: totalWeight * prev.rate,
      };
    });
  };

  const handleDelete = () => {
    if (!confirm("Delete this slip?")) return;

    deleteMutation.mutate(editableData.id, {
      onSuccess: () => onOpenChange(false),
    });
  };

  const handleSave = () => {
    updateMutation.mutate(
      {
        id: editableData.id,
        data: editableData,
      },
      {
        onSuccess: () => {
          setIsDirty(false);
        },
      },
    );
  };

  const weights = editableData.weights?.map((w) => w.value) ?? [];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full md:w-[520px] h-full overflow-y-auto"
      >
        {/* HEADER */}
        <SheetHeader className="px-6 py-4 border-b bg-muted/20">
          <div className="flex items-center justify-between mr-6">
            <SheetTitle>{editableData.slipNo}</SheetTitle>
            <Badge>{editableData.status.replace("_", " ")}</Badge>
          </div>
        </SheetHeader>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
          <Section title="Farmer Details">
            <EditableRow
              label="Farmer"
              value={editableData.farmer}
              onSave={(v: any) => updateField("farmer", v)}
            />

            <EditableRow
              label="Location"
              value={editableData.location}
              onSave={(v: any) => updateField("location", v)}
            />

            <EditableRow
              label="Mobile"
              value={editableData.mobile}
              onSave={(v: any) => updateField("mobile", v)}
            />
          </Section>

          <Separator />

          <Section title="Purchase Details">
            <EditableRow
              label="Grade"
              value={editableData.grade}
              onSave={(v: any) => updateField("grade", v)}
            />

            <EditableRow
              label="Rate"
              value={editableData.rate}
              onSave={(v: any) => updateField("rate", Number(v))}
            />

            <Row
              label="Total Weight"
              value={`${editableData.totalWeight} kg`}
            />
            <Row label="Total Amount" value={`₹${editableData.totalAmount}`} />
          </Section>

          <Separator />

          <WeightsEditor
            weights={weights}
            rate={editableData.rate}
            onChange={updateWeights}
          />

          <Separator />

          <Section title="Activity">
            <div className="text-sm text-muted-foreground">
              Created by {editableData.createdBy?.name}
            </div>
          </Section>
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t bg-background space-y-3">
          {isDirty && (
            <div className="text-sm text-amber-600">● Unsaved changes</div>
          )}

          <Button
            className="w-full"
            onClick={handleSave}
            disabled={!isDirty || updateMutation.isPending}
          >
            {updateMutation.isPending ? "Saving..." : "Save Changes"}
          </Button>

          <Button
            variant="destructive"
            className="w-full"
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Deleting..." : "Delete Slip"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function Section({ title, children }: any) {
  return (
    <div>
      <p className="text-sm font-semibold mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Row({ label, value }: any) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function EditableRow({
  label,
  value,
  onSave,
}: {
  label: string;
  value: string | number;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [localValue, setLocalValue] = useState(String(value));

  useEffect(() => {
    setLocalValue(String(value));
  }, [value]);

  const cancel = () => {
    setLocalValue(String(value));
    setEditing(false);
  };

  return (
    <div className="flex justify-between items-center text-sm rounded-md px-2 py-1 hover:bg-muted/50 transition">
      <span className="text-muted-foreground">{label}</span>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            autoFocus
            value={localValue}
            onChange={(e) => {
              const val = e.target.value;
              setLocalValue(val);
              onSave(val); // 🔥 save immediately
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
            onBlur={() => setEditing(false)}
            className="border rounded px-2 py-1 text-right w-32"
          />

          <X
            size={16}
            className="cursor-pointer text-muted-foreground hover:text-foreground"
            onClick={cancel}
          />
        </div>
      ) : (
        <button
          onClick={() => setEditing(true)}
          className="flex items-center gap-2 text-right"
        >
          <span className="font-medium">{value || "-"}</span>

          <Pencil
            size={14}
            className="text-muted-foreground opacity-70 hover:opacity-100"
          />
        </button>
      )}
    </div>
  );
}

function WeightsEditor({ weights, rate, onChange }: any) {
  const totalWeight = weights.reduce((s: number, w: number) => s + w, 0);
  const totalAmount = totalWeight * rate;

  const updateWeight = (index: number, value: number) => {
    const newWeights = [...weights];
    newWeights[index] = value;
    onChange(newWeights);
  };

  const addWeight = () => onChange([...weights, 0]);

  const removeWeight = (index: number) =>
    onChange(weights.filter((_: any, i: number) => i !== index));

  return (
    <Section title="Weights">
      {weights.map((w: number, i: number) => (
        <EditableWeightRow
          key={i}
          index={i}
          weight={w}
          onSave={(v: number) => updateWeight(i, v)}
          onDelete={() => removeWeight(i)}
        />
      ))}

      <button
        onClick={addWeight}
        className="flex items-center gap-2 text-sm text-primary"
      >
        <Plus size={14} />
        Add Bag
      </button>

      <Separator className="my-3" />

      <Row label="Total Weight" value={`${totalWeight} kg`} />
      <Row label="Total Amount" value={`₹${totalAmount}`} />
    </Section>
  );
}

function EditableWeightRow({
  index,
  weight,
  onSave,
  onDelete,
}: {
  index: number;
  weight: number;
  onSave: (value: number) => void;
  onDelete: () => void;
}) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(weight);

  useEffect(() => {
    setValue(weight);
  }, [weight]);

  const cancel = () => {
    setValue(weight);
    setEditing(false);
  };

  return (
    <div className="flex justify-between items-center bg-muted px-3 py-2 rounded text-sm">
      <span className="text-muted-foreground">Bag {index + 1}</span>

      {editing ? (
        <div className="flex items-center gap-2">
          <input
            type="number"
            autoFocus
            value={value}
            onChange={(e) => {
              const val = Number(e.target.value);
              setValue(val);
              onSave(val); // 🔥 instant update
            }}
            onKeyDown={(e) => {
              if (e.key === "Escape") cancel();
            }}
            onBlur={() => setEditing(false)}
            className="w-20 border rounded px-2 py-1 text-right"
          />

          <X
            size={16}
            className="cursor-pointer text-muted-foreground"
            onClick={cancel}
          />
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <span className="font-medium">{weight} kg</span>

          <Pencil
            size={14}
            className="cursor-pointer text-muted-foreground"
            onClick={() => setEditing(true)}
          />

          <Trash2
            size={14}
            onClick={onDelete}
            className="text-red-500 cursor-pointer"
          />
        </div>
      )}
    </div>
  );
}
