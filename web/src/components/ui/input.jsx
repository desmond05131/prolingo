import * as React from "react"

import { cn } from "@/lib/utils"
import { DatePicker } from "@/components/ui/date-picker";
import { DateTimePicker } from "@/components/ui/datetime-picker";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  // Custom handling for date and datetime
  if (type === 'date') {
    const { value, onChange, name, id, disabled } = props;
    return (
      <DatePicker value={value} onChange={onChange} name={name} id={id} disabled={disabled} className={className} />
    );
  }
  if (type === 'datetime' || type === 'datetime-local') {
    const { value, onChange, name, id, disabled } = props;
    return (
      <DateTimePicker value={value} onChange={onChange} name={name} id={id} disabled={disabled} className={className} />
    );
  }

  return (
    <input
      type={type}
      className={cn(
        // Aligned with SelectTrigger styling for visual consistency
        "flex h-9 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input"

export { Input }
