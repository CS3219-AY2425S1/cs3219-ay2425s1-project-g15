"use client";

import * as React from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  PaginationState,
  Row,
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
import { QuestionDifficulty, QuestionMinified } from "@/types/find-match";
import MoonLoader from "react-spinners/MoonLoader";
import EditQuestionDialog from "@/app/(auth)/leetcode-dashboard/components/EditQuestionDialog";
import { motion } from "framer-motion";
import Modal from "react-modal";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { ListFilter, Search } from "lucide-react";
import { MultiSelect } from "@/components/ui/multiselect";
import { capitalizeWords } from "@/utils/string_utils";
import { topicsList } from "@/utils/constants";

const SEARCH_DEBOUNCE_TIMEOUT = 300;

const Cell = ({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => {
  return <div className={cn("text-center", className)}>{children}</div>;
};

interface CellProps {
  row: Row<QuestionMinified>;
}

interface ActionCellProps {
  row: Row<QuestionMinified>;
  openModal(questionId: string): void;
  editingQuestionId: string | null;
  closeModal(): void;
  modalAnimation: {
    hidden: {
      opacity: number;
      scale: number;
    };
    visible: {
      opacity: number;
      scale: number;
    };
    exit: {
      opacity: number;
      scale: number;
    };
  };
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
  handleDelete(questionId: string): void;
}

interface LeetcodeDashboardTableProps {
  refreshKey: number;
  setRefreshKey: React.Dispatch<React.SetStateAction<number>>;
}

const QuestionIdHeader = () => <Cell>ID</Cell>;
const QuestionIdCell: React.FC<CellProps> = ({ row }) => (
  <Cell className="capitalize">{row.getValue("questionid")}</Cell>
);

const TitleHeader = () => <Cell>Question Title</Cell>;
const TitleCell: React.FC<CellProps> = ({ row }) => (
  <Cell>{row.getValue("title")}</Cell>
);

const ComplexityHeader = () => <Cell>Difficulty</Cell>;
const ComplexityCell: React.FC<CellProps> = ({ row }) => {
  return <Cell>{row.getValue("complexity")}</Cell>;
};

const CategoryHeader = () => <Cell>Topics</Cell>;
const CategoryCell: React.FC<CellProps> = ({ row }) => {
  const categoryValue = row.getValue("category");
  const result: string = Array.isArray(categoryValue)
    ? categoryValue.join(", ")
    : String(categoryValue);
  return <Cell>{result}</Cell>;
};

const ActionsHeader = () => <Cell>Actions</Cell>;
const ActionsCell: React.FC<ActionCellProps> = ({
  row,
  openModal,
  editingQuestionId,
  closeModal,
  modalAnimation,
  setRefreshKey,
  handleDelete,
}) => {
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
            setRefreshKey={setRefreshKey}
          />
        </motion.div>
      </Modal>
      <Button variant={"ghost"} onClick={() => handleDelete(questionId)}>
        <FaRegTrashAlt />
      </Button>
    </Cell>
  );
};

function debounce<T extends (...args: Parameters<T>) => void>(
  func: T,
  timeout = 300
) {
  let timer: NodeJS.Timeout | undefined;
  return (...args: Parameters<T>) => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func(...args);
    }, timeout);
  };
}

export function LeetcodeDashboardTable({
  refreshKey,
  setRefreshKey,
}: Readonly<LeetcodeDashboardTableProps>) {
  const [data, setData] = useState<QuestionMinified[]>([]);
  const [editingQuestionId, setEditingQuestionId] = React.useState<
    string | null
  >(null);

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

          setPagination({
            pageIndex: 0,
            pageSize: 10,
          });
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

  const [totalPages, setTotalPage] = React.useState<number>(1);
  const [searchTitle, setSearchTitle] = React.useState<string>("");
  const [searchDifficulty, setSearchDifficulty] = React.useState<string[]>([]);
  const [searchTopic, setSearchTopic] = React.useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  const debouncedSetSearchTitle = debounce((title: string) => {
    setSearchTitle(title);
  }, SEARCH_DEBOUNCE_TIMEOUT);

  const questionDifficulty = Object.values(QuestionDifficulty).map((q1) => {
    return {
      label: capitalizeWords(q1),
      value: q1,
    };
  });

  const toggleDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const columns: ColumnDef<QuestionMinified>[] = [
    {
      accessorKey: "questionid",
      header: QuestionIdHeader,
      cell: ({ row }) => QuestionIdCell({ row }),
    },
    {
      accessorKey: "title",
      header: TitleHeader,
      cell: ({ row }) => TitleCell({ row }),
    },
    {
      accessorKey: "complexity",
      header: ComplexityHeader,
      cell: ({ row }) => ComplexityCell({ row }),
    },
    {
      accessorKey: "category",
      header: CategoryHeader,
      cell: ({ row }) => CategoryCell({ row }),
    },
    {
      accessorKey: "actions",
      header: ActionsHeader,
      cell: ({ row }) =>
        ActionsCell({
          row,
          openModal,
          editingQuestionId,
          closeModal,
          modalAnimation,
          setRefreshKey,
          handleDelete,
        }),
    },
  ];

  useEffect(() => {
    getLeetcodeDashboardData(
      pagination.pageIndex + 1,
      pagination.pageSize,
      searchTitle,
      searchDifficulty,
      searchTopic
    ).then((data) => {
      setTotalPage(data.totalPages);
      if (data.totalPages < pagination.pageIndex + 1) {
        setPagination((prev) => ({
          ...prev,
          pageIndex: data.totalPages - 1,
        }));
      } else {
        if (pagination.pageIndex + 1 == 0 && data.totalPages !== 0) {
          setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
          }));
        }
        setData(data.questions);
      }
    });
    setIsLoading(false);
  }, [
    refreshKey,
    pagination.pageIndex,
    pagination.pageSize,
    searchTitle,
    searchDifficulty,
    searchTopic,
  ]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      pagination,
    },
    onPaginationChange: setPagination,
    manualPagination: true,
    pageCount: totalPages,
  });

  return (
    <div className="w-full test">
      <div>
        <Table className="font-light min-h-[360px]">
          <TableHeader className="w-full">
            <TableRow className="text-white bg-primary-900 font-medium hover:bg-transparent h-[5rem] text-md">
              <TableCell colSpan={5} className="pl-10">
                <div className="flex items-center">
                  <span>LeetCode Question Bank</span>
                  <span className="ml-auto flex place-items-center gap-6 pr-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary-400 w-4" />
                      <Input
                        className="w-[16rem] pl-10 !placeholder-primary-400"
                        placeholder="Search Question Name"
                        onChange={(e) => {
                          debouncedSetSearchTitle(e.target.value);
                        }}
                      />
                    </div>
                    <div className="relative">
                      <Button
                        className="gap-2 bg-transparent text-primary-400 border-[1px] hover:bg-primary-300"
                        onClick={toggleDropdown}
                      >
                        <ListFilter />
                        Filter By
                      </Button>
                      {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-[408px] min-h-[184px] bg-primary-800 text-primary-300 border border-gray-300 rounded shadow-lg z-10">
                          <div className="flex flex-col place-items-center mt-4 gap-4">
                            <div className="w-[90%]">
                              <div className="text-xs">Difficulty</div>
                              <MultiSelect
                                options={questionDifficulty}
                                onValueChange={setSearchDifficulty}
                                placeholder="Select options"
                                variant="inverted"
                                className="mt-1"
                              />
                            </div>
                            <div className="w-[90%] mb-4">
                              <div className="text-xs">Topics</div>
                              <MultiSelect
                                options={topicsList}
                                onValueChange={setSearchTopic}
                                placeholder="Select options"
                                variant="inverted"
                                className="mt-1"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </span>
                </div>
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
            {table.getRowModel().rows?.length && !isLoading ? (
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
                    {isLoading ? (
                      <MoonLoader color="#FFFFFF" size="30" />
                    ) : (
                      <div className="text-base">No data found</div>
                    )}
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
            onClick={() => {
              if (table.getState().pagination.pageIndex === 0) {
                table.setPageIndex(totalPages - 1);
              } else {
                table.previousPage();
              }
            }}
            disabled={totalPages === 0}
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
            onClick={() => {
              if (
                table.getState().pagination.pageIndex + 1 ===
                table.getPageCount()
              ) {
                table.setPageIndex(0);
              } else {
                table.nextPage();
              }
            }}
            disabled={totalPages === 0}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
