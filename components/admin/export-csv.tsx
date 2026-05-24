"use client";

import { ActionButton } from "@/components/ui/button";

/** Builds a CSV from already-loaded rows and triggers a download (no endpoint). */
export function ExportCsv({
  rows,
  columns,
  filename,
}: {
  rows: Record<string, unknown>[];
  columns: string[];
  filename: string;
}) {
  function download() {
    const esc = (v: unknown) => {
      const s = v == null ? "" : String(v);
      return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [
      columns.join(","),
      ...rows.map((r) => columns.map((c) => esc(r[c])).join(",")),
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" })
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <ActionButton variant="outline" size="sm" onClick={download} disabled={rows.length === 0}>
      Export CSV
    </ActionButton>
  );
}
