import clsx from "clsx"

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  windowSize?: number
}

export default function Pagination({ page, totalPages, onChange, windowSize = 5 }: PaginationProps) {
  const pages = buildPageWindow(page, totalPages, windowSize)

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label="Página anterior"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-sm text-gray-500 border border-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          type="button"
          aria-current={p === page ? "page" : undefined}
          onClick={() => onChange(p)}
          className={clsx(
            "cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-sm font-medium transition-colors",
            p === page
              ? "bg-brand-base text-white border border-brand-base"
              : "text-gray-600 border border-gray-400 hover:bg-gray-100"
          )}
        >
          {p}
        </button>
      ))}
      <button
        type="button"
        aria-label="Próxima página"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-md text-sm text-gray-500 border border-gray-400 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </div>
  )
}

function buildPageWindow(page: number, totalPages: number, size: number): number[] {
  if (totalPages <= size) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const half = Math.floor(size / 2)
  let start = Math.max(1, page - half)
  const end = Math.min(totalPages, start + size - 1)
  start = Math.max(1, end - size + 1)

  return Array.from({ length: end - start + 1 }, (_, i) => start + i)
}
