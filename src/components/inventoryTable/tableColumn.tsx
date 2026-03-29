import type { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useUpdatePurchaseSlip } from "@/hooks/useUpdatePurchaseSlip";
import { useAuth } from "@/hooks/useAuth";
import type { Inventory } from "./InventoryTable";

function StatusCell({ row }: { row: any }) {
  const { mutate, isPending } = useUpdatePurchaseSlip();
  const { user } = useAuth();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<string | null>(null);

  const status = row.original.status;

  const statusColors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
    CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
    PAYMENT_PENDING: "bg-orange-100 text-orange-800 border-orange-300",
    PAYMENT_DONE: "bg-green-100 text-green-800 border-green-300",
  };

  // Determine which statuses the user can change to based on their role
  let allowedStatuses: string[] = [];
  if (user?.role === "SUPERVISOR") {
    // SUPERVISOR can mark: PENDING -> CONFIRMED only
    if (status === "PENDING") {
      allowedStatuses = ["CONFIRMED"];
    }
  } else if (user?.role === "FINANCER") {
    // FINANCER can mark: CONFIRMED -> PAYMENT_PENDING only
    if (status === "CONFIRMED") {
      allowedStatuses = ["PAYMENT_PENDING"];
    }
  } else if (user?.role === "ADMIN") {
    // ADMIN can do everything
    allowedStatuses = [
      "PENDING",
      "CONFIRMED",
      "PAYMENT_PENDING",
      "PAYMENT_DONE",
    ];
  } else {
    // PURCHASER and other roles cannot change status
    allowedStatuses = [];
  }

  const canChangeStatus = allowedStatuses.length > 0;

  const handleStatusClick = (newStatus: string) => {
    setPendingStatus(newStatus);
    setConfirmOpen(true);
  };

  const handleConfirm = () => {
    if (pendingStatus) {
      mutate({
        id: row.original.id,
        data: { status: pendingStatus },
      });
      setConfirmOpen(false);
      setPendingStatus(null);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            onClick={(e) => e.stopPropagation()}
            className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border cursor-pointer hover:opacity-90 transition ${statusColors[status]} ${!canChangeStatus ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={!canChangeStatus}
          >
            {status.replace("_", " ")}
            {canChangeStatus && <ChevronDown size={12} />}
          </button>
        </DropdownMenuTrigger>

        {canChangeStatus && (
          <DropdownMenuContent align="start">
            {allowedStatuses.map((s) => (
              <DropdownMenuItem
                key={s}
                disabled={isPending || s === status}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusClick(s);
                }}
              >
                {s.replace("_", " ")}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        )}
      </DropdownMenu>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>पुष्टि करें</DialogTitle>
            <DialogDescription>
              क्या आप स्थिति को{" "}
              <strong>{pendingStatus?.replace("_", " ")}</strong> में बदलना
              चाहते हैं?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                setConfirmOpen(false);
                setPendingStatus(null);
              }}
            >
              रद्द करें
            </Button>
            <Button
              onClick={(e) => {
                e.stopPropagation();
                handleConfirm();
              }}
              disabled={isPending}
            >
              {isPending ? "बदल रहे हैं..." : "पुष्टि करें"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export const tableColumns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "status",
    header: "स्थिति",
    size: 110,
    enablePinning: true,
    cell: ({ row }) => <StatusCell row={row} />,
  },

  {
    accessorKey: "id",
    header: "क्रमांक",
    size: 90,
  },
  {
    accessorKey: "date",
    header: "दिनांक",
    size: 120,
    cell: ({ row }) => {
      const date = new Date(row.original.date);

      return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }).format(date);
    },
  },
  {
    accessorKey: "farmer",
    header: "किसान",
    size: 160,
  },
  {
    accessorKey: "location",
    header: "गांव / पार्टी का नाम",
    size: 200,
  },
  {
    accessorKey: "mobile",
    header: "मोबाइल नंबर",
    size: 150,
  },
  {
    accessorKey: "item",
    header: "वस्तु",
    size: 140,
  },
  {
    accessorKey: "type",
    header: "प्रकार",
    size: 110,
  },
  {
    accessorKey: "grade",
    header: "श्रेणी",
    size: 90,
  },
  {
    id: "lot",
    header: "दाग",
    size: 90,
    cell: ({ row }) => {
      return row.original.weights?.length ?? 0;
    },
  },
  {
    accessorKey: "rate",
    header: "भाव",
    size: 110,
  },

  {
    accessorKey: "totalWeight",
    header: "कुल वजन",
    size: 120,
    cell: ({ row }) => {
      return row.original.totalWeight.toFixed(3);
    },
  },

  {
    accessorKey: "shortageWeight",
    header: "कटौती के बाद वजन",
    size: 140,
    enableSorting: false,
    cell: ({ row }) => {
      return row.original.shortageWeight.toFixed(3);
    },
  },

  {
    accessorKey: "totalAmount",
    header: "कुल रुपये",
    size: 140,
    cell: ({ row }) => {
      return `₹${parseFloat(row.original.totalAmount.toFixed(3)).toLocaleString(
        "en-IN",
        {
          maximumFractionDigits: 3,
        },
      )}`;
    },
  },

  {
    id: "shortageAmount",
    header: "कटौती के बाद रुपये",
    size: 160,
    enableSorting: false,
    cell: ({ row }) => {
      return `₹${parseFloat(
        row.original.shortageAmount.toFixed(3),
      ).toLocaleString("en-IN", {
        maximumFractionDigits: 3,
      })}`;
    },
  },
];
