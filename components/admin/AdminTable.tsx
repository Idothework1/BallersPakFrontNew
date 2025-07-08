"use client";

import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

interface AdminTableProps {
  data: Record<string, string>[];
}

export default function AdminTable({ data }: AdminTableProps) {
  const [filter, setFilter] = useState("");
  const [sortKey, setSortKey] = useState<string>(data[0] ? Object.keys(data[0])[0] : "");
  const [asc, setAsc] = useState<boolean>(true);

  const headers = useMemo(() => (data[0] ? Object.keys(data[0]) : []), [data]);
  const label = (key: string) =>
    key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, (s) => s.toUpperCase());

  // group keys into cohesive sections for expanded view
  const detailSections = [
    { title: "Meta", keys: ["timestamp"] },
    {
      title: "Personal Info",
      keys: [
        "firstName",
        "lastName",
        "gender",
        "location",
        "email",
        "phone",
      ],
    },
    {
      title: "Experience",
      keys: [
        "playedBefore",
        "playedClub",
        "experienceLevel",
        "clubName",
        "position",
      ],
    },
    { title: "Additional", keys: ["hasDisability", "goal", "whyJoin"] },
  ];

  const formatValue = (key: string, value: string) => {
    if (key === "timestamp" && value) {
      const d = new Date(value);
      if (!isNaN(d.getTime())) {
        return d.toLocaleString("en-GB", {
          dateStyle: "medium",
          timeStyle: "short",
        });
      }
    }
    return value;
  };
  const visibleHeaders = headers.slice(0, 4); // show only first few columns in compact view

  // selection state
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const toggleSelect = (idx: number) => {
    setSelected((prev) => {
      const set = new Set(prev);
      if (set.has(idx)) set.delete(idx); else set.add(idx);
      return set;
    });
  };

  const selectAll = () => {
    if (selected.size === sorted.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(sorted.map((_, i) => i)));
    }
  };

  // expanded row
  const [expanded, setExpanded] = useState<number | null>(null);

  const filtered = useMemo(() => {
    if (!filter) return data;
    const query = filter.toLowerCase();
    return data.filter((row) =>
      Object.values(row).some((v) => v.toLowerCase().includes(query))
    );
  }, [data, filter]);

  const sorted = useMemo(() => {
    if (!sortKey) return filtered;
    const arr = [...filtered];
    arr.sort((a, b) => {
      const va = a[sortKey] ?? "";
      const vb = b[sortKey] ?? "";
      return asc ? String(va).localeCompare(String(vb)) : String(vb).localeCompare(String(va));
    });
    return arr;
  }, [filtered, sortKey, asc]);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4 flex-wrap mb-2">
        <Input
          placeholder="Search..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-64 bg-neutral-800 text-white placeholder:text-gray-400 border-neutral-700 focus-visible:ring-emerald-500"
        />
        <span className="text-sm text-gray-400">{sorted.length} results</span>

        {selected.size > 0 && (
          <>
            <Button
              size="sm"
              onClick={() => {
                const csvHeaders = headers.map(label).join(",") + "\n";
                const csvRows = Array.from(selected)
                  .map((idx) => headers.map((h) => `"${sorted[idx][h]}"`).join(","))
                  .join("\n");
                const csvContent = csvHeaders + csvRows;
                const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `signups_selection_${Date.now()}.csv`;
                a.click();
                URL.revokeObjectURL(url);
              }}
            >
              Export Selection ({selected.size})
            </Button>

            <Button
              size="sm"
              variant="secondary"
              onClick={() => {
                  const ballersHeaders = [
                    "Team Name",
                    "First Name",
                    "Last Name",
                    "Gender",
                    "Email",
                    "Disability",
                  ];

                  const mapRowToTemplate = (row: Record<string, string>): string[] => [
                    "BallersPak",
                    row["firstName"] || "N/A",
                    row["lastName"] || "N/A",
                    row["gender"] || "N/A",
                    row["email"] || "N/A",
                    String(row["hasDisability"]).toLowerCase() === "true" ? "Yes" : "No",
                  ];

                  const csvHeaders = ballersHeaders.join(",") + "\n";
                  const csvRows = Array.from(selected)
                    .map((idx) => mapRowToTemplate(sorted[idx]).map((v) => `"${v}"`).join(","))
                    .join("\n");

                  const csvContent = csvHeaders + csvRows;
                  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = `ballers_export_${Date.now()}.csv`;
                  a.click();
                  URL.revokeObjectURL(url);
                }}
            >
              Export to Ballers CSV ({selected.size})
            </Button>
          </>
        )}
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-8 text-center">
              <Checkbox
                checked={
                  selected.size === 0
                    ? false
                    : selected.size === sorted.length
                    ? true
                    : "indeterminate"
                }
                onCheckedChange={selectAll}
              />
            </TableHead>
            {visibleHeaders.map((header) => (
              <TableHead
                key={header}
                className={cn(
                  "whitespace-nowrap px-2", // extra padding
                  sortKey === header ? "text-emerald-400" : "text-gray-300"
                )}
              >
                <Button
                  variant="ghost"
                  className="group px-1 h-6 hover:bg-transparent"
                  onClick={() => {
                    if (sortKey === header) {
                      setAsc(!asc);
                    } else {
                      setSortKey(header);
                      setAsc(true);
                    }
                  }}
                >
                  {label(header)}
                  {sortKey === header ? (
                    asc ? (
                      <ArrowUp className="ml-1 h-3 w-3" />
                    ) : (
                      <ArrowDown className="ml-1 h-3 w-3" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-1 h-3 w-3 opacity-40 group-hover:opacity-70" />
                  )}
                </Button>
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sorted.map((row, idx) => (
            <React.Fragment key={idx}>
              <TableRow key={"base-" + idx} className="hover:bg-neutral-800/40 text-sm">
                <TableCell className="w-8 text-center">
                  <Checkbox
                    checked={selected.has(idx)}
                    onCheckedChange={() => toggleSelect(idx)}
                  />
                </TableCell>
                {visibleHeaders.map((header) => (
                  <TableCell key={header} className="whitespace-nowrap px-2 py-3">
                    {formatValue(header, row[header])}
                  </TableCell>
                ))}
                <TableCell className="w-32 px-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpanded(expanded === idx ? null : idx)}
                  >
                    {expanded === idx ? "Hide Details" : "View Details"}
                  </Button>
                </TableCell>
              </TableRow>
              {expanded === idx && (
                <TableRow key={"detail-" + idx} className="bg-neutral-800 text-sm">
                  <TableCell colSpan={headers.length + 2}>
                    <div className="max-h-64 overflow-y-auto pr-2" data-lenis-prevent>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 p-4">
                        {detailSections.map((section) => {
                          const keysInSection = section.keys.filter((k) => row[k] !== undefined);
                          if (keysInSection.length === 0) return null;
                          return (
                            <div key={section.title} className="mb-4 first:mt-0 sm:col-span-2">
                              <h4 className="mb-2 text-sm font-semibold text-gray-300 uppercase tracking-wide">
                                {section.title}
                              </h4>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2">
                                {keysInSection.map((k) => (
                                  <div key={k}>
                                    <span className="font-medium text-emerald-400 mr-1">
                                      {label(k)}:
                                    </span>
                                    <span>{formatValue(k, row[k])}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </React.Fragment>
          ))}
          {sorted.length === 0 && (
            <TableRow>
              <TableCell colSpan={headers.length + 2} className="text-center py-8">
                No results found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
} 