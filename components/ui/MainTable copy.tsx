// in components/ui/MainTable.tsx

import React from "react";
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid'
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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

export function MainTable<T>({
    columns,
    data,
    actions,
    onRowClick,
}: TableProps<T>) {
    return (
        <div className="relative z-0">
            <table className="min-w-full divide-y divide-gray-300 pl-4">
                <thead className="bg-[#D9E1F4]">
                    <tr>
                        {columns.map((col, i) => (
                            <th
                                key={i}
                                scope="col"
                                className={`py-3.5 px-3 text-left text-sm font-semibold text-gray-900 ${col.headerClassName ?? ""}`}
                            >
                                {col.header}
                            </th>
                        ))}
                        <th className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                    {data.length === 0 && (
                        <tr>
                            <td colSpan={columns.length + 1} className="text-center py-10 text-gray-500">No data found.</td>
                        </tr>
                    )}
                    {data.map((row, i) => (
                        <tr
                            key={i}
                            className="hover:bg-[#F4F4F4] cursor-pointer"
                            onClick={() => onRowClick && onRowClick(row)}
                        >
                            {columns.map((col, idx) => (
                                <td key={idx} className={`px-3 py-5 text-sm whitespace-nowrap text-gray-700 ${col.cellClassName ?? ""}`}>
                                    {typeof col.accessor === "function"
                                        ? col.accessor(row)
                                        : (row as any)[col.accessor]}
                                </td>
                            ))}
                            <td className="relative pr-4 text-right text-sm font-medium whitespace-nowrap sm:pr-4">

                                <Menu as="div" className=" text-left z-20">
                                    <MenuButton className="flex items-center p-1 rounded  focus:outline-none " onClick={e => e.stopPropagation()}>
                                        <EllipsisHorizontalIcon className="size-8 text-[#1DA68F]  relative " onClick={e => e.stopPropagation()} />
                                    </MenuButton>
                                    <MenuItems className="absolute right-0 z-50 -mt-2 w-48 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black/5 focus:outline-none shadow-[#1DA68F]/20 border border-[#1DA68F]/20" onClick={e => e.stopPropagation()}>
                                        <div className="py-1">
                                            {actions?.map((action, j) => (
                                                <MenuItem key={action.label}>
                                                    {({ active }) => (
                                                        <button
                                                            className={`${active ? "bg-[#1DA68F] text-white " : "text-gray-900"
                                                                } flex items-center gap-2 w-full text-left px-4 py-2 text-sm`}
                                                            onClick={e => {
                                                                e.stopPropagation();
                                                                action.onClick(row);
                                                            }}
                                                        >
                                                            {action.icon && <action.icon className="size-5 text-gray-400" />}
                                                            {action.label}
                                                        </button>
                                                    )}
                                                </MenuItem>
                                            ))}
                                        </div>
                                    </MenuItems>
                                </Menu>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
