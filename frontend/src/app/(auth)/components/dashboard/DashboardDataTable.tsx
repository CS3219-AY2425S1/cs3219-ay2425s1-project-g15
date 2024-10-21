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
import { getUserHistory } from "@/api/dashboard";
import { SessionHistory } from "@/types/dashboard";
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { cn } from "@/lib/utils";

interface SessionHistoryFormatted extends SessionHistory {
  completedAtFormatted: string;
}

const Cell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("text-center", className)}>{children}</div>;
};

export const columns: ColumnDef<SessionHistory>[] = [
  {
    accessorKey: "peerName",
    header: () => <Cell>Peer</Cell>,
    cell: ({ row }) => (
      <Cell className="capitalize">{row.getValue("peerName")}</Cell>
    ),
  },
  {
    accessorKey: "completedAtFormatted",
    header: () => <Cell>Completed At</Cell>,
    cell: ({ row }) => <Cell>{row.getValue("completedAtFormatted")}</Cell>,
  },
  {
    accessorKey: "questionName",
    header: () => <Cell>Question Name</Cell>,
    cell: ({ row }) => {
      return <Cell>{row.getValue("questionName")}</Cell>;
    },
  },
  {
    accessorKey: "totalTime",
    header: () => <Cell>Total Time</Cell>,
    cell: ({ row }) => {
      return <Cell>{row.getValue("totalTime")}</Cell>;
    },
  },
  {
    accessorKey: "reviewDiscussion",
    header: () => <Cell>Review Discussion</Cell>,
    cell: ({}) => {
      return (
        <Cell>
          <Button variant={"ghost"}>
            <MdOutlineRemoveRedEye />
          </Button>
        </Cell>
      );
    },
  },
];

const dateFormattingOption: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "short",
  day: "numeric",
};

export function DashboardDataTable() {
  const [data, setData] = React.useState<SessionHistoryFormatted[]>([]);
  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });
  React.useEffect(() => {
    const userHistory = getUserHistory().map((h: SessionHistory) => {
      return {
        ...h,
        completedAtFormatted: h.completedAt.toLocaleDateString(
          "en-US",
          dateFormattingOption
        ),
      };
    });
    setData(userHistory);
  }, []);

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
              <TableCell colSpan={5} className="pl-10">
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
