import type { ColumnDef } from "@tanstack/react-table";
import type { Inventory } from "./mockData";
import { Eye } from "lucide-react";

export const tableColumns: ColumnDef<Inventory>[] = [
  {
    id: "actions",
    enableSorting: false,
    // header: () => (
    //   <div className="flex justify-center items-center">
    //     <Eye size={18} />
    //   </div>
    // ),
    cell: () => (
      <div className="flex items-center justify-center">
        <Eye size={18} className="cursor-pointer" />
      </div>
    ),
    size: 60,
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
  },
  {
    accessorKey: "farmer",
    header: "किसान",
    size: 160,
  },
  {
    accessorKey: "village",
    header: "गांव / पार्टी का नाम",
    size: 200,
  },
  {
    accessorKey: "mobile",
    header: "मोबाइल नंबर",
    size: 150,
  },
  {
    accessorKey: "grade",
    header: "श्रेणी",
    size: 90,
  },
  {
    accessorKey: "lot",
    header: "दागा",
    size: 90,
  },
  {
    accessorKey: "price",
    header: "भाव",
    size: 110,
  },
  {
    accessorKey: "totalWeight",
    header: "कुल वजन",
    size: 120,
  },
  {
    accessorKey: "totalAmount",
    header: "कुल रुपये",
    size: 140,
  },
];
