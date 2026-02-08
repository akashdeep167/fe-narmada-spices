import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import { Button } from "../..//components/ui/button";
import type { Inventory } from "./mockData";

type Props = {
  data: Inventory | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function InventoryDetailsDialog({ data, open, onOpenChange }: Props) {
  if (!data) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        {/* Header */}
        <DialogHeader className="bg-[#E8DCC8] dark:bg-[#3A3126] px-4 py-3 border-b">
          <DialogTitle className="text-lg font-semibold">
            रिकॉर्ड विवरण
          </DialogTitle>
        </DialogHeader>

        {/* Body */}
        <div className="px-6 py-4 space-y-4 bg-background max-h-[60vh] overflow-y-auto">
          <Detail label="क्रमांक" value={data.id} />
          <Detail label="दिनांक" value={data.date} />
          <Detail label="किसान" value={data.farmer} />
          <Detail label="गांव / पार्टी का नाम" value={data.village} />
          <Detail label="मोबाइल नंबर" value={data.mobile} />
          <Detail label="श्रेणी" value={data.grade} />
          <Detail label="दागा" value={data.lot} />
          <Detail label="भाव" value={`₹${data.price}`} />
          <Detail label="कुल वजन" value={data.totalWeight} />
          <Detail label="कुल रुपये" value={`₹${data.totalAmount}`} />
        </div>

        {/* Footer */}
        <div className="p-4 border-t space-y-3 bg-muted/30 dark:bg-muted/10">
          <Button className="w-full bg-green-700 hover:bg-green-800">
            संपादित करें
          </Button>

          <Button variant="destructive" className="w-full">
            हटाएं
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function Detail({ label, value }: { label: string; value: any }) {
  return (
    <div className="border-b pb-2">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-base font-medium">{value}</p>
    </div>
  );
}
