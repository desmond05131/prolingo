// Simplified hook to align with Sonner API.
// Provides backward-compatible shape: { toast } so existing calls using const { toast } = useToast() continue to work.
import { toast as sonnerToast } from "sonner";

export function useToast() {
  return { toast: sonnerToast };
}

export const toast = sonnerToast;
