'use client';

import { SortOrder } from "@/types/cat";

interface SortSelectProps {
  value: SortOrder;
  onChange: (order: SortOrder) => void;
}

export default function SortSelect({value, onChange}: SortSelectProps) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value as SortOrder)}
      className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
    >
      <option value="rand">Random</option>
      <option value="asc">Ascending</option>
      <option value="desc">Descending</option>
    </select>
  );
}