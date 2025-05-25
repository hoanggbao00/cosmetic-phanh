"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SlidersHorizontal } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { DEFAULT_SORT_OPTION } from "../const";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-low-high", label: "Price: Low to High" },
  { value: "price-high-low", label: "Price: High to Low" },
  { value: "name-a-z", label: "Name: A to Z" },
  { value: "name-z-a", label: "Name: Z to A" },
  { value: "rating", label: "Highest Rated" },
];

export const SortSection = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const sortOption = searchParams.get("sort") ?? DEFAULT_SORT_OPTION;

  const onSortOptionChange = (value: string) => {
    const params = new URLSearchParams(searchParams);
    if (value === DEFAULT_SORT_OPTION) {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }

    router.replace(`?${params.toString()}`);
  };

  return (
    <div className='mb-6 flex items-center justify-end gap-4'>
      <div className='flex items-center gap-2'>
        <SlidersHorizontal className='h-4 w-4' />
        <span className='mr-2 text-sm'>Sort by:</span>
        <Select value={sortOption} onValueChange={onSortOptionChange}>
          <SelectTrigger className='h-9 w-[180px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value} className='cursor-pointer'>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};
