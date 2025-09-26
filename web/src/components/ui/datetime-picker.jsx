import * as React from "react";
import { Clock, CalendarIcon } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Input } from "./input";

function parseISOToDate(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d.getTime())) return null;
  return d;
}

function pad(n) { return String(n).padStart(2, "0"); }

function toLocalDateTimeString(d) {
  if (!d) return "";
  // Returns YYYY-MM-DDTHH:mm (no seconds) in local time
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function DateTimePicker({ value, onChange, placeholder = "Pick date & time", className, name, id, disabled }) {
  const initial = React.useMemo(() => parseISOToDate(value), [value]);
  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState(initial ?? null);
  const [time, setTime] = React.useState(() =>
    initial
      ? `${pad(initial.getHours())}:${pad(initial.getMinutes())}:${pad(
          initial.getSeconds()
        )}`
      : ""
  );

  React.useEffect(() => {
    const d = parseISOToDate(value);
    setDate(d ?? null);
    setTime(d ? `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}` : "");
  }, [value]);

  const emitChange = (d, t) => {
    if (!d) {
      onChange?.({ target: { name, id, value: "" } });
      return;
    }
    const [hh = "00", mm = "00", ss = "00"] = (t || "").split(":");
    const next = new Date(d);
    next.setHours(Number(hh), Number(mm), Number(ss) || 0, 0);
    // Emit as ISO string in UTC with timezone (Z)
    const iso = next.toISOString().replace(/\.\d{3}Z$/, "Z");
    onChange?.({ target: { name, id, value: iso } });
  };

  const handleSelectDate = (d) => {
    setDate(d ?? null);
    emitChange(d ?? null, time);
    if (d) setOpen(false);
  };

  const handleTimeChange = (e) => {
    const val = e.target.value;
    setTime(val);
    emitChange(date, val);
  };

  const buttonText = date
    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
    : placeholder;

  return (
    <div className={cn("flex items-stretch gap-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            type="button"
            disabled={disabled}
            className={cn(
              // Match Input styles
              "flex h-9 w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              "text-left font-normal whitespace-nowrap",
              !date && "text-muted-foreground"
            )}
            aria-label="Open calendar"
          >
            <span className="flex items-center gap-2 min-w-0">
              <CalendarIcon className="h-4 w-4 opacity-60 shrink-0" />
              <span className="truncate">{buttonText}</span>
            </span>
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            captionLayout="dropdown"
            onSelect={handleSelectDate}
          />
        </PopoverContent>
        {/* <PopoverContent className="w-auto p-0" align="start">
          <Calendar mode="single" selected={date ?? undefined} onSelect={handleSelectDate} initialFocus />
        </PopoverContent> */}
      </Popover>
      <div className="flex flex-col gap-3">
        <Input
          type="time"
          id="time-picker"
          step="1"
          value={time}
          onChange={handleTimeChange}
          disabled={disabled}
          className="bg-background appearance-none [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
        />
      </div>
      {/* <div className="relative">

        <Input
          type="time"
          step="60"
          value={time}
          onChange={handleTimeChange}
          disabled={disabled}
          className="flex h-9 items-center rounded-md border border-input bg-background pl-3 pr-8 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
        <Clock className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 opacity-50" />
      </div> */}
    </div>
  );
}

export default DateTimePicker;
