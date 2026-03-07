import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";
import { InventoryDetailsPanel } from "./InventoryDetailsDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { tableColumns } from "./tableColumn";
import { useState } from "react";
import {
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
  RotateCw,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { usePurchaseSlips } from "@/hooks/usePurchaseSlips";

export type Weight = {
  id: number;
  value: number;
  slipId: number;
};

export type CreatedBy = {
  id: number;
  name: string;
  email: string;
  role: "ADMIN" | "USER";
};

export type Inventory = {
  id: number;
  slipNo: string;
  date: string;
  farmer: string;
  location: string;
  mobile: string;
  item: string;
  type: string;
  grade: string;
  rate: number;
  totalWeight: number;
  totalAmount: number;
  status: "PENDING" | "CONFIRMED" | "PAYMENT_PENDING" | "PAYMENT_DONE";
  createdById: number;
  createdAt: string;
  weights: Weight[];
  createdBy: CreatedBy;
  shortageAmount: number;
  shortageWeight: number;
};

// ── Helper: returns sticky styles for a pinned column ─────────────────────────
function getPinStyles(column: any, isHeader = false): React.CSSProperties {
  const isPinned = column.getIsPinned();
  if (!isPinned) return {};
  return {
    position: "sticky",
    left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
    right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
    zIndex: isHeader ? 20 : 1,
  };
}

export function InventoryTable() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedRow, setSelectedRow] = useState<Inventory | null>(null);
  const [open, setOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [pageIndex, setPageIndex] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const { data, isLoading, refetch } = usePurchaseSlips({
    page: pageIndex + 1,
    limit: pageSize,
    farmer: globalFilter,
    sortBy: sorting[0]?.id,
    order: sorting[0]?.desc ? "desc" : "asc",
  });

  const table = useReactTable({
    data: data?.data ?? [],
    columns: tableColumns,
    initialState: {
      columnPinning: {
        left: ["status"],
      },
    },
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
      pagination: { pageIndex, pageSize },
    },
    manualPagination: true,
    manualSorting: true,
    pageCount: data?.pagination?.totalPages ?? 0,
    onSortingChange: setSorting,
    onPaginationChange: (updater) => {
      const next =
        typeof updater === "function"
          ? updater({ pageIndex, pageSize })
          : updater;
      setPageIndex(next.pageIndex);
      setPageSize(next.pageSize);
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    setSorting([]);
    setColumnFilters([]);
    setGlobalFilter("");
    setRowSelection({});
    setPageIndex(0);
    await refetch();
    setIsRefreshing(false);
  };

  const totalRows = data?.pagination?.total ?? 0;

  return (
    <>
      <div className="flex flex-col h-[calc(100vh-120px)] border rounded-md bg-background">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-4 border-b bg-muted/20">
          <Input
            placeholder="Search farmer..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="w-64"
          />
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleRefresh}
              disabled={isRefreshing || isLoading}
            >
              <RotateCw
                className={`h-4 w-4 ${
                  isRefreshing || isLoading ? "animate-spin text-primary" : ""
                }`}
              />
            </Button>
          </div>
        </div>

        {/* Table */}
        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 z-10 bg-[#E8DCC8] dark:bg-[#3A3126]">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border-r last:border-r-0 h-14 px-4 bg-[#E8DCC8] dark:bg-[#3A3126]"
                      style={{
                        width: header.getSize(),
                        ...getPinStyles(header.column, true),
                      }}
                    >
                      <div
                        className={`flex items-center justify-between ${
                          header.column.getCanSort() ? "cursor-pointer" : ""
                        }`}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                      >
                        <span>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </span>

                        {header.column.getCanSort() && (
                          <div className="flex flex-col ml-2">
                            {header.column.getIsSorted() === "asc" ? (
                              <>
                                <ChevronUp size={14} />
                                <ChevronDown
                                  size={14}
                                  className="opacity-20 -mt-1"
                                />
                              </>
                            ) : header.column.getIsSorted() === "desc" ? (
                              <>
                                <ChevronUp size={14} className="opacity-20" />
                                <ChevronDown size={14} className="-mt-1" />
                              </>
                            ) : (
                              <>
                                <ChevronUp size={14} className="opacity-30" />
                                <ChevronDown
                                  size={14}
                                  className="opacity-30 -mt-1"
                                />
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {isLoading ? (
                [...Array(pageSize)].map((_, i) => (
                  <TableRow key={i}>
                    {tableColumns.map((_, j) => (
                      <TableCell key={j}>
                        <div className="h-4 w-full bg-muted rounded animate-pulse" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : table.getRowModel().rows.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={tableColumns.length}
                    className="text-center py-10 text-muted-foreground"
                  >
                    No purchase slips found
                  </TableCell>
                </TableRow>
              ) : (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => {
                      setSelectedRow(row.original);
                      setOpen(true);
                    }}
                    className="hover:bg-muted/40 transition-colors cursor-pointer"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        className="border-r last:border-r-0 px-4 bg-background"
                        style={{
                          width: cell.column.getSize(),
                          ...getPinStyles(cell.column),
                        }}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30 dark:bg-muted/10">
          <div className="flex items-center gap-6">
            <span className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {totalRows === 0 ? 0 : pageIndex * pageSize + 1}
              </span>
              {" – "}
              <span className="font-medium text-foreground">
                {Math.min((pageIndex + 1) * pageSize, totalRows)}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">{totalRows}</span>
            </span>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>
              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="h-8 rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {[15, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-40"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="px-3 text-sm font-medium">
              {table.getState().pagination.pageIndex + 1} /{" "}
              {table.getPageCount()}
            </span>
            <button
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => table.setPageIndex(table.getPageCount() - 1)}
              disabled={!table.getCanNextPage()}
              className="p-2 rounded-md hover:bg-muted disabled:opacity-40"
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <InventoryDetailsPanel
        data={selectedRow}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
