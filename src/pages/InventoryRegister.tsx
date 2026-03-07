"use client";
import { useState } from "react";
import Header from "../components/common/Header";
import { InventoryTable } from "../components/inventoryTable/InventoryTable";
import InventorySlipForm from "@/components/forms/InventorySlipForm";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCreateSlip } from "@/hooks/useCreateSlip";

const InventoryRegister = () => {
  const [open, setOpen] = useState(false);
  const createSlipMutation = useCreateSlip();

  const handleCreateSlip = async (values: any) => {
    // TODO: call your API
    await createSlipMutation.mutateAsync(values);

    setOpen(false);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="p-4 flex-1">
        <InventoryTable />
      </div>

      {/* FLOATING BUTTON */}
      <div className="fixed bottom-6 right-6">
        <Button
          onClick={() => setOpen(true)}
          size="lg"
          className="rounded-full shadow-lg h-14 w-14 p-0"
        >
          <Plus size={24} />
        </Button>
      </div>

      {/* CREATE SLIP PANEL */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent
          side="right"
          className="w-full md:w-[520px] h-full overflow-y-auto"
        >
          <SheetHeader>
            <SheetTitle>Create Slip</SheetTitle>
          </SheetHeader>

          <div className="mt-4">
            <InventorySlipForm onSubmit={handleCreateSlip} />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default InventoryRegister;
