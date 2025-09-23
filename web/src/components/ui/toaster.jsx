// Replaced custom toast renderer with Sonner's Toaster
import { Toaster as SonnerToaster } from "sonner";

export function Toaster(props) {
  return (
    <SonnerToaster
      position="top-right"
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "shadow-lg border border-border bg-background",
          title: "font-medium",
          description: "text-muted-foreground",
          actionButton: "bg-primary text-primary-foreground",
          cancelButton: "bg-muted text-foreground"
        }
      }}
      {...props}
    />
  );
}
