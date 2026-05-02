/* =====================================================
   UI TABLE COMPONENT
   Design System - Plataforma de Atención Inteligente
   ===================================================== */

import * as React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/* =====================================================
   TABLE COMPONENT
   ===================================================== */
interface Column<T = any> {
  key: string;
  header: string;
  width?: string;
  sortable?: boolean;
  render?: (row: T, index: number) => React.ReactNode;
  className?: string;
  align?: 'left' | 'center' | 'right';
}

interface TableProps<T = any> extends React.HTMLAttributes<HTMLTableElement> {
  columns: Column<T>[];
  data: T[];
  keyField?: keyof T;
  empty?: React.ReactNode;
  loading?: boolean;
  striped?: boolean;
  hover?: boolean;
  bordered?: boolean;
  density?: 'sm' | 'md' | 'lg';
  onRowClick?: (row: T, index: number) => void;
  sortKey?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

/* ---------- Density Config ---------- */
const densityConfig = {
  sm: { th: 'px-3 py-2 text-xs', td: 'px-3 py-2 text-xs', row: 'h-10' },
  md: { th: 'px-4 py-3 text-sm', td: 'px-4 py-3 text-sm', row: 'h-12' },
  lg: { th: 'px-5 py-4 text-base', td: 'px-5 py-4 text-base', row: 'h-14' },
};

/* ---------- Align Config ---------- */
const alignConfig = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

export function Table<T extends Record<string, any>>({
  columns,
  data,
  keyField = 'id' as keyof T,
  empty,
  loading = false,
  striped = true,
  hover = true,
  bordered = false,
  density = 'md',
  onRowClick,
  sortKey,
  sortDirection,
  onSort,
  className,
  ...props
}: TableProps<T>) {
  const densityStyles = densityConfig[density];

  const defaultEmpty = (
    <tr>
      <td colSpan={columns.length} className="px-4 py-12 text-center text-neutral-500">
        <div className="flex flex-col items-center gap-2">
          <svg className="w-12 h-12 text-neutral-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-sm">No hay datos disponibles</p>
        </div>
      </td>
    </tr>
  );

  const loadingRows = Array.from({ length: 5 }).map((_, i) => (
    <tr key={i} className={clsx(striped && i % 2 === 1 && 'bg-neutral-50/50')}>
      {columns.map((col, j) => (
        <td key={j} className={clsx(densityStyles.td, 'border-b border-neutral-100')}>
          <div className="h-4 w-full animate-pulse rounded bg-neutral-200" />
        </td>
      ))}
    </tr>
  ));

  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <table className={twMerge(clsx('w-full', className))} {...props}>
        <thead>
          <tr className="bg-neutral-50 border-b border-neutral-200">
            {columns.map((col) => (
              <th
                key={col.key}
                className={clsx(
                  densityStyles.th,
                  'font-semibold text-neutral-600 whitespace-nowrap',
                  alignConfig[col.align || 'left'],
                  col.sortable && 'cursor-pointer select-none hover:bg-neutral-100',
                  col.className
                )}
                style={{ width: col.width }}
                onClick={() => col.sortable && onSort?.(col.key)}
              >
                <div className={clsx('flex items-center gap-2', alignConfig[col.align || 'left'])}>
                  <span>{col.header}</span>
                  {col.sortable && sortKey === col.key && (
                    <svg
                      className={clsx('w-4 h-4', sortDirection === 'desc' && 'rotate-180')}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-100">
          {loading ? (
            loadingRows
          ) : data.length === 0 ? (
            empty || defaultEmpty
          ) : (
            data.map((row, i) => (
              <tr
                key={row[keyField] as string}
                className={clsx(
                  densityStyles.row,
                  striped && i % 2 === 1 && 'bg-neutral-50/50',
                  hover && 'hover:bg-primary-50/50',
                  onRowClick && 'cursor-pointer'
                )}
                onClick={() => onRowClick?.(row, i)}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={clsx(
                      densityStyles.td,
                      'text-neutral-700 whitespace-nowrap',
                      alignConfig[col.align || 'left'],
                      col.className
                    )}
                  >
                    {col.render ? col.render(row, i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* =====================================================
   DATA TABLE COMPONENT
   Advanced table with pagination, search, filters
   ===================================================== */
interface DataTableProps<T = any> extends TableProps<T> {
  pageSize?: number;
  currentPage?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  pageSizeOptions?: number[];
  onPageSizeChange?: (size: number) => void;
  search?: string;
  onSearch?: (value: string) => void;
  searchPlaceholder?: string;
  showPagination?: boolean;
  showSearch?: boolean;
}

export function DataTable<T extends Record<string, any>>({
  pageSize = 10,
  currentPage = 1,
  total = data?.length || 0,
  onPageChange,
  pageSizeOptions = [10, 25, 50, 100],
  onPageSizeChange,
  search,
  onSearch,
  searchPlaceholder = 'Buscar...',
  showPagination = true,
  showSearch = true,
  ...tableProps
}: DataTableProps<T>) {
  const totalPages = Math.ceil(total / pageSize);
  const start = (currentPage - 1) * pageSize + 1;
  const end = Math.min(currentPage * pageSize, total);

  return (
    <div className="flex flex-col gap-4">
      {/* Search Bar */}
      {showSearch && onSearch && (
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch?.(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full rounded-lg border border-neutral-200 bg-white pl-10 pr-4 py-2 text-sm
                       focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
      )}

      {/* Table */}
      <Table {...tableProps} />

      {/* Pagination */}
      {showPagination && total > 0 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-neutral-500">
            Mostrando {start} a {end} de {total} resultados
          </div>
          
          <div className="flex items-center gap-2">
            {/* Page Size Selector */}
            {onPageSizeChange && (
              <select
                value={pageSize}
                onChange={(e) => onPageSizeChange?.(Number(e.target.value))}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm
                           focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size} por página
                  </option>
                ))}
              </select>
            )}

            {/* Page Navigation */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => onPageChange?.(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm
                           hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                const page = i + 1;
                return (
                  <button
                    key={page}
                    onClick={() => onPageChange?.(page)}
                    className={clsx(
                      'rounded-md px-3 py-1.5 text-sm',
                      page === currentPage
                        ? 'bg-primary-500 text-white'
                        : 'bg-white border border-neutral-200 hover:bg-neutral-50'
                    )}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                onClick={() => onPageChange?.(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm
                           hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* =====================================================
   SORTABLE TABLE HEADER
   ===================================================== */
interface SortableHeaderProps {
  title: string;
  sortKey?: string;
  currentSort?: string;
  direction?: 'asc' | 'desc';
  onSort?: (key: string) => void;
}

export function SortableHeader({ title, sortKey, currentSort, direction, onSort }: SortableHeaderProps) {
  const isActive = currentSort === sortKey;

  return (
    <button
      onClick={() => sortKey && onSort?.(sortKey)}
      className={clsx(
        'inline-flex items-center gap-1 font-semibold',
        isActive ? 'text-primary-600' : 'text-neutral-600',
        sortKey && 'hover:text-primary-600'
      )}
    >
      <span>{title}</span>
      {isActive && (
        <svg
          className={clsx('w-4 h-4', direction === 'desc' && 'rotate-180')}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      )}
    </button>
  );
}

/* =====================================================
   EXPORT TABLE COMPONENT
   Helper for CSV/Excel export
   ===================================================== */
type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf';

interface ExportButtonProps {
  data: any[];
  filename?: string;
  columns?: Column[];
  format?: ExportFormat | ExportFormat[];
  label?: string;
}

export function ExportTableButton({ data, filename = 'export', columns, format = ['csv'], label = 'Exportar' }: ExportButtonProps) {
  const handleExport = (exportFormat: ExportFormat) => {
    let content: string;
    let mimeType: string;
    let extension: string;

    switch (exportFormat) {
      case 'csv':
        const headers = columns?.map((c) => c.header).join(',');
        const rows = data
          .map((row) => columns?.map((c) => row[c.key]).join(','))
          .join('\n');
        content = `${headers}\n${rows}`;
        mimeType = 'text/csv';
        extension = 'csv';
        break;

      case 'json':
        content = JSON.stringify(data, null, 2);
        mimeType = 'application/json';
        extension = 'json';
        break;

      default:
        return;
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.${extension}`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative group">
      <button className="inline-flex items-center gap-2 rounded-lg border border-neutral-200 bg-white px-4 py-2 text-sm font-medium hover:bg-neutral-50">
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        {label}
      </button>
      
      <div className="absolute right-0 mt-1 w-32 rounded-lg border border-neutral-200 bg-white py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        {format.map((f) => (
          <button
            key={f}
            onClick={() => handleExport(f)}
            className="w-full px-4 py-2 text-left text-sm hover:bg-neutral-50 capitalize"
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Table;