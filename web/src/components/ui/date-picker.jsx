import * as React from "react";
import { CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";

// Utility to parse incoming ISO (date or datetime) and normalize to Date at start of day
function parseISOToDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d;
}

function toISODateString(d) {
  if (!d) return "";
  // Format YYYY-MM-DD (date only)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function DatePicker({ value, onChange, placeholder = "Pick a date", className, name, id, disabled }) {
  const date = React.useMemo(() => parseISOToDate(value), [value]);
  const [open, setOpen] = React.useState(false);

  const handleSelect = (d) => {
    const iso = d ? toISODateString(d) : "";
    // Fire a synthetic input-like event to match <Input> onChange contract
    onChange?.({ target: { name, id, value: iso } });
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          disabled={disabled}
          className={cn(
            // Match Input visual styles
            "flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            "text-left font-normal whitespace-nowrap",
            !date && "text-muted-foreground",
            className
          )}
        >
          <span className="flex items-center gap-2 min-w-0">
            <CalendarIcon className="h-4 w-4 opacity-60 shrink-0" />
            <span className={cn("truncate", !date && "text-muted-foreground")}>{date ? toISODateString(date) : placeholder}</span>
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date ?? undefined} onSelect={handleSelect} initialFocus />
      </PopoverContent>
    </Popover>
  );
}

export default DatePicker;
