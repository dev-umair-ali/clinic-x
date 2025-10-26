"use client";

import React from "react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { Menu, MenuButton, MenuItem, MenuItems, Portal } from "@headlessui/react";

export interface TableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
}

interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  cellClassName?: string;
  headerClassName?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  actions?: TableAction<T>[];
  onRowClick?: (row: T) => void;
}

export const MainTable = <T,>({
  columns,
  data,
  actions,
  onRowClick,
}: TableProps<T>) => {
  return (
    <div className="relative z-0 w-full overflow-x-auto rounded-lg">
      <table className="w-full min-w-full divide-y divide-border">
        <thead className="bg-muted/30">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                scope="col"
                className={`py-3 px-2 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground ${col.headerClassName ?? ""}`}
              >
                {col.header}
              </th>
            ))}
            <th className="py-3 px-2 sm:px-3 text-left text-xs sm:text-sm font-semibold text-foreground">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-border bg-card">
          {data.length === 0 && (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="text-center py-10 text-muted-foreground text-sm sm:text-base"
              >
                No data found.
              </td>
            </tr>
          )}

          {data.map((row, i) => (
            <tr
              key={i}
              className="hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onRowClick && onRowClick(row)}
            >
              {columns.map((col, idx) => (
                <td
                  key={idx}
                  className={`px-2 sm:px-3 py-3 sm:py-4 text-xs sm:text-sm whitespace-nowrap text-foreground ${col.cellClassName ?? ""}`}
                >
                  {typeof col.accessor === "function"
                    ? col.accessor(row)
                    : (row as any)[col.accessor]}
                </td>
              ))}

              {/* Actions */}
              <td className="relative pr-2 sm:pr-4 text-right text-xs sm:text-sm font-medium whitespace-nowrap">
                <Menu as="div" className="text-left">
                  <MenuButton
                    className="flex items-center p-1 rounded focus:outline-none hover:bg-muted/50 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <EllipsisHorizontalIcon className="size-6 sm:size-7 text-[#1DA68F]" />
                  </MenuButton>

                  <Portal>
                    <MenuItems
                      anchor="top end"
                      className="z-50 w-36 sm:w-44 rounded-md bg-card shadow-lg ring-1 ring-border focus:outline-none border border-border"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="py-1">
                        {actions?.map((action) => (
                          <MenuItem key={action.label}>
                            {({ active }) => (
                              <button
                                className={`${
                                  active
                                    ? "bg-[#1DA68F] text-white"
                                    : "text-foreground hover:bg-muted/50"
                                } flex items-center gap-2 w-full text-left px-3 sm:px-4 py-2 text-xs sm:text-sm transition-colors`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                              >
                                {action.icon && (
                                  <action.icon
                                    className={`size-4 sm:size-5 ${
                                      active ? "text-white" : "text-muted-foreground"
                                    }`}
                                  />
                                )}
                                {action.label}
                              </button>
                            )}
                          </MenuItem>
                        ))}
                      </div>
                    </MenuItems>
                  </Portal>
                </Menu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
