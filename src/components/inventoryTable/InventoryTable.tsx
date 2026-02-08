import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import type {
  SortingState,
  ColumnFiltersState,
  RowSelectionState,
} from "@tanstack/react-table";
import { InventoryDetailsDialog } from "./InventoryDetailsDialog";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { mockData, type Inventory } from "./mockData";
import { tableColumns } from "./tableColumn";
import { useState } from "react";
import {
  Funnel,
  ChevronUp,
  ChevronDown,
  ChevronsLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsRight,
} from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export function InventoryTable() {
  const [showFilter, setShowFilter] = useState<boolean>(false);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [selectedRow, setSelectedRow] = useState<Inventory | null>(null);
  const [open, setOpen] = useState(false);
  const table = useReactTable({
    data: mockData,
    columns: tableColumns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      rowSelection,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onGlobalFilterChange: setGlobalFilter,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    enableRowSelection: true,
    initialState: {
      pagination: {
        pageSize: 10,
      },
    },
  });

  return (
    <>
      <div className="rounded-md border">
        <div className="p-4 flex justify-between">
          <Input
            placeholder="Search..."
            value={globalFilter ?? ""}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="border px-3 py-2 rounded w-64"
          />
          <Button
            variant="ghost"
            onClick={() => setShowFilter((state) => !state)}
          >
            <Funnel />
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-[#E8DCC8] dark:bg-[#3A3126]">
            {table.getHeaderGroups().map((headerGroup) => (
              <>
                {/* COLUMN TITLES ROW */}
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="border-r last:border-r-0 h-14 px-4"
                      style={{ width: header.getSize() }}
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

                {/* FILTER ROW */}
                {showFilter && (
                  <TableRow className="hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        className="border-r last:border-r-0 p-1"
                      >
                        {header.column.getCanFilter() ? (
                          <Input
                            value={
                              (header.column.getFilterValue() ?? "") as string
                            }
                            onChange={(e) =>
                              header.column.setFilterValue(
                                header.column.columnDef.meta?.isNumeric
                                  ? Number(e.target.value)
                                  : e.target.value,
                              )
                            }
                            className="h-8 text-xs bg-white"
                          />
                        ) : null}
                      </TableCell>
                    ))}
                  </TableRow>
                )}
              </>
            ))}
          </TableHeader>

          <TableBody>
            {table.getPaginationRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={() => {
                  setSelectedRow(row.original);
                  setOpen(true);
                }}
                className="cursor-pointer odd:bg-white even:bg-muted/30 dark:odd:bg-background dark:even:bg-muted/20"
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    className="border-r last:border-r-0 px-4"
                    style={{ width: cell.column.getSize() }}
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-muted/30 dark:bg-muted/10">
          {/* Left Side - Rows Info */}
          <div className="flex items-center gap-6">
            {/* Showing info */}
            <span className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium text-foreground">
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}
              </span>
              {" – "}
              <span className="font-medium text-foreground">
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length,
                )}
              </span>{" "}
              of{" "}
              <span className="font-medium text-foreground">
                {table.getFilteredRowModel().rows.length}
              </span>
            </span>

            {/* Rows per page */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                Rows per page:
              </span>

              <select
                value={table.getState().pagination.pageSize}
                onChange={(e) => table.setPageSize(Number(e.target.value))}
                className="h-8 rounded-md border bg-background px-2 text-sm focus:outline-none focus:ring-1 focus:ring-ring"
              >
                {[10, 20, 50].map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Right Side - Pagination Controls */}
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
      <InventoryDetailsDialog
        data={selectedRow}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
