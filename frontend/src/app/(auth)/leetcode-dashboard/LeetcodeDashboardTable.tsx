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
import { cn } from "@/lib/utils";
import { HiOutlinePencil } from "react-icons/hi";
import { FaRegTrashAlt } from "react-icons/fa";
import {
  deleteSingleLeetcodeQuestion,
  getLeetcodeDashboardData,
} from "@/api/leetcode-dashboard";
import { QuestionMinified } from "@/types/find-match";
import MoonLoader from "react-spinners/MoonLoader";
import EditQuestionDialog from "@/app/(auth)/leetcode-dashboard/EditQuestionDialog";
import { motion } from "framer-motion";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

const Cell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("text-center", className)}>{children}</div>;
};

export function LeetcodeDashboardTable() {
  const [data, setData] = useState<QuestionMinified[]>([]);
  const [editingQuestionId, setEditingQuestionId] = React.useState<
    string | null
  >(null);
  const [refreshKey, setRefreshKey] = useState(0); // State to trigger re-fetch

  function handleDelete(questionId: string) {
    Swal.fire({
      icon: "warning",
      title: "Confirm delete?",
      text: "Are you sure you want to delete this question?",
      showCancelButton: true,
      confirmButtonText: "Confirm",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        try {
          await deleteSingleLeetcodeQuestion(questionId);
          Swal.fire("Question deleted successfully!", "", "success");

          // Trigger data refresh
          setRefreshKey((prev) => prev + 1);
        } catch (error) {
          Swal.showValidationMessage(`Failed to delete question: ${error}`);
        }
      },
      allowOutsideClick: () => !Swal.isLoading(),
    });
  }

  function openModal(questionId: string) {
    setEditingQuestionId(questionId);
  }

  function closeModal() {
    setEditingQuestionId(null);
  }

  const modalAnimation = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  };

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns: ColumnDef<QuestionMinified>[] = [
    {
      accessorKey: "questionid",
      header: () => <Cell>ID</Cell>,
      cell: ({ row }) => (
        <Cell className="capitalize">{row.getValue("questionid")}</Cell>
      ),
    },
    {
      accessorKey: "title",
      header: () => <Cell>Question Title</Cell>,
      cell: ({ row }) => <Cell>{row.getValue("title")}</Cell>,
    },
    {
      accessorKey: "complexity",
      header: () => <Cell>Difficulty</Cell>,
      cell: ({ row }) => {
        return <Cell>{row.getValue("complexity")}</Cell>;
      },
    },
    {
      accessorKey: "category",
      header: () => <Cell>Topics</Cell>,
      cell: ({ row }) => {
        const categoryValue = row.getValue("category");
        const result: string = Array.isArray(categoryValue)
          ? categoryValue.join(", ")
          : String(categoryValue);
        return <Cell>{result}</Cell>;
      },
    },
    {
      accessorKey: "actions",
      header: () => <Cell>Actions</Cell>,
      cell: ({ row }) => {
        const questionId: string = row.getValue("questionid");
        return (
          <Cell>
            <Button onClick={() => openModal(questionId)} variant={"ghost"}>
              <HiOutlinePencil />
            </Button>
            <Modal
              isOpen={editingQuestionId === questionId}
              onRequestClose={closeModal}
              ariaHideApp={false}
              className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-none"
              style={{
                overlay: {
                  backgroundColor: "rgba(29, 36, 51, 0.8)",
                },
              }}
            >
              <motion.div
                initial="hidden"
                animate="visible"
                exit="exit"
                variants={modalAnimation}
                transition={{ duration: 0.3 }}
              >
                <EditQuestionDialog
                  questionId={questionId}
                  handleClose={closeModal}
                />
              </motion.div>
            </Modal>
            <Button variant={"ghost"} onClick={() => handleDelete(questionId)}>
              <FaRegTrashAlt />
            </Button>
          </Cell>
        );
      },
    },
  ];

  useEffect(() => {
    getLeetcodeDashboardData().then((data) => setData(data.reverse()));
  }, [refreshKey]);

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
                <TableCell colSpan={columns.length}>
                  <div className="w-full flex justify-center items-center">
                    <MoonLoader color="#FFFFFF" size="30" />
                  </div>
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
