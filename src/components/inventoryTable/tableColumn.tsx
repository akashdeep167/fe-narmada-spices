import type { ColumnDef } from "@tanstack/react-table";
import { ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useUpdatePurchaseSlip } from "@/hooks/useUpdatePurchaseSlip";
import { useAuth } from "@/hooks/useAuth";
import type { Inventory } from "./InventoryTable";

export const tableColumns: ColumnDef<Inventory>[] = [
  {
    accessorKey: "status",
    header: "स्थिति",
    size: 110,
    enablePinning: true,
    cell: ({ row }) => {
      const { mutate, isPending } = useUpdatePurchaseSlip();
      const { user } = useAuth();

      const status = row.original.status;

      const statusColors: Record<string, string> = {
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-300",
        CONFIRMED: "bg-blue-100 text-blue-800 border-blue-300",
        PAYMENT_PENDING: "bg-orange-100 text-orange-800 border-orange-300",
        PAYMENT_DONE: "bg-green-100 text-green-800 border-green-300",
      };

      const allStatuses = [
        "PENDING",
        "CONFIRMED",
        "PAYMENT_PENDING",
        "PAYMENT_DONE",
      ];

      // Determine which statuses the user can change to based on their role
      let allowedStatuses: string[] = [];
      if (user?.role === "SUPERVISOR") {
        // SUPERVISOR can confirm slips (PENDING -> CONFIRMED -> PAYMENT_PENDING)
        allowedStatuses = ["PENDING", "CONFIRMED", "PAYMENT_PENDING"];
      } else if (user?.role === "ADMIN") {
        // ADMIN can do everything
        allowedStatuses = allStatuses;
      } else {
        // Other roles cannot change status
        allowedStatuses = [];
      }

      const canChangeStatus = allowedStatuses.length > 0;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className={`flex items-center gap-1 px-2 py-1 text-xs font-medium rounded border cursor-pointer hover:opacity-90 transition ${statusColors[status]} ${!canChangeStatus ? "opacity-50 cursor-not-allowed" : ""}`}
              disabled={!canChangeStatus}
            >
              {status.replace("_", " ")}
              <ChevronDown size={12} />
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
                    mutate({
                      id: row.original.id,
                      data: { status: s },
                    });
                  }}
                >
                  {s.replace("_", " ")}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          )}
        </DropdownMenu>
      );
    },
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
  },

  {
    accessorKey: "shortageWeight",
    header: "कटौती के बाद वजन",
    size: 140,
  },

  {
    accessorKey: "totalAmount",
    header: "कुल रुपये",
    size: 140,
    cell: ({ row }) => {
      return `₹${row.original.totalAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`;
    },
  },

  {
    id: "shortageAmount",
    header: "कटौती के बाद रुपये",
    size: 160,
    cell: ({ row }) => {
      return `₹${row.original.shortageAmount.toLocaleString("en-IN", {
        maximumFractionDigits: 2,
      })}`;
    },
  },
];
