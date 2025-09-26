import * as React from 'react';
import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell, TableCaption } from './table';
import { cn } from '@/lib/utils';

/**
 * Generic DataTable wrapper
 * props:
 *  - columns: TanStack column definitions
 *  - data: array of row objects
 *  - caption: optional string (table caption)
 *  - initialSorting: optional [{id, desc}]
 */
export function DataTable({ columns, data, caption, initialSorting }) {
  const [sorting, setSorting] = React.useState(initialSorting || []);

  const table = useReactTable({
    data,
    columns,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    debugTable: false,
  });

  return (
    <Table className="min-w-[760px]">
      <TableHeader className="bg-neutral-900/70">
        {table.getHeaderGroups().map(hg => (
          <TableRow key={hg.id} className="border-neutral-800">
            {hg.headers.map(header => {
              const isSortable = header.column.getCanSort();
              const sorted = header.column.getIsSorted();
              return (
                <TableHead key={header.id} className={cn(isSortable && 'cursor-pointer select-none')}
                  onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}>
                  {header.isPlaceholder ? null : (
                    <div className="flex items-center gap-1">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {isSortable && (
                        <span className="text-[10px] opacity-70">
                          {sorted === 'asc' && '↑'}
                          {sorted === 'desc' && '↓'}
                          {!sorted && '↕'}
                        </span>
                      )}
                    </div>
                  )}
                </TableHead>
              );
            })}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map(row => (
            <TableRow key={row.id} data-state={row.getIsSelected() && 'selected'}>
              {row.getVisibleCells().map(cell => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={columns.length} className="py-6 text-center text-neutral-500">No data.</TableCell>
          </TableRow>
        )}
      </TableBody>
      {caption && <TableCaption>{caption}</TableCaption>}
    </Table>
  );
}
