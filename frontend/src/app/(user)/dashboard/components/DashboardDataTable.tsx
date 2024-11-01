"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TCombinedSession } from "@/types/dashboard";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { cn } from "@/lib/utils";
import { FaExternalLinkAlt } from "react-icons/fa";
import Link from "next/link";

const Cell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("text-center", className)}>{children}</div>;
};

export const columns: ColumnDef<TCombinedSession>[] = [
  {
    accessorKey: "peer",
    header: () => <Cell>Peer</Cell>,
    cell: ({ row }) => {
      const peer = row.getValue("peer");
      return <Cell className="capitalize">
        <Link className="group text-center p-2 rounded-xl hover:bg-white hover:text-primary-900 underline" href={`/user/${peer}`}>
          {peer as string}
        </Link>
      </Cell>
    },
  },
  {
    accessorKey: "title",
    header: () => <Cell>Question Name</Cell>,
    cell: ({ row }) => <Cell>{row.getValue("title")}</Cell>,
  },
  {
    accessorKey: "language",
    header: () => <Cell>Language</Cell>,
    cell: ({ row }) => {
      return <Cell>{row.getValue("language")}</Cell>;
    },
  },
  {
    accessorKey: "complexity",
    header: () => <Cell>Complexity</Cell>,
    cell: ({ row }) => {
      return <Cell>{row.getValue("complexity")}</Cell>;
    },
  },
  {
    accessorKey: "category",
    header: () => <Cell>Category</Cell>,
    cell: ({ row }) => {
      const categories: string[] = row.getValue("category");
      return <Cell>
        {categories.slice(0, 3).join(", ")}{categories.length > 3 ? "..." : ""}
      </Cell>;
    },
  },
  {
    accessorKey: "collabid",
    header: () => <Cell>Collab Space</Cell>,
    cell: ({ row }) => {
      return (
        <Cell>
          <Link className="group grid p-2 rounded-xl hover:bg-white hover:text-primary-900 mx-auto" href={`/collab/${row.getValue('collabid')}`} key={row.getValue('collabid')}>
            <FaExternalLinkAlt size={20} className="mx-auto"/>
          </Link>
        </Cell>
      );
    },
  },
];

export function DashboardDataTable({ data }: { data: TCombinedSession[] }) {
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
  });

  return (
    <div className="w-full test">
      <div>
        <Table className="font-light">
          <TableHeader className="w-full">
            <TableRow className="text-white bg-primary-900 font-medium hover:bg-transparent h-[5rem] text-md">
              <TableCell colSpan={6} className="pl-10">
                Past Collaborations
              </TableCell>
            </TableRow>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="text-primary-400 bg-primary-800 text-xs hover:bg-transparent"
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="bg-primary-900 text-primary-300 text-xs">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4 bg-primary-800 rounded-b-lg">
        <div className="space-x-2 flex justify-around items-center w-full text-primary-300">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Prev
          </Button>
          <div>
            Page {table.getState().pagination.pageIndex + 1} /{" "}
            {table.getPageCount()}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}