import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { createClientFeedback } from "@/client-api";

export default function FeedbackModal({ open, onOpenChange, onSubmitted }) {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setMessage("");
      setSubmitting(false);
    }
  }, [open]);

  async function handleSubmit(e) {
    e?.preventDefault?.();
    const trimmed = message.trim();
    if (!trimmed) {
      toast("Please enter your feedback message.");
      return;
    }
    try {
      setSubmitting(true);
      await createClientFeedback({ message: trimmed });
      toast("Thanks for your feedback!");
      onSubmitted?.();
      onOpenChange?.(false);
    } catch (err) {
      const msg = err?.response?.data?.detail || err?.message || "Failed to send feedback";
      toast(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0f1115] border border-[#242c36] text-slate-100 p-0 sm:rounded-2xl overflow-hidden">
        <form onSubmit={handleSubmit}>
          <DialogHeader className="px-5 py-4 border-b border-[#242c36]">
            <DialogTitle className="text-sm">Send Feedback</DialogTitle>
            <DialogDescription className="sr-only">Share your thoughts to help us improve.</DialogDescription>
          </DialogHeader>

          <div className="px-5 py-4">
            <label htmlFor="feedback_message" className="block text-xs text-slate-300 mb-2">Message</label>
            <textarea
              id="feedback_message"
              className="w-full min-h-[120px] rounded-md bg-[#111418] border border-[#272f39] p-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-600"
              placeholder="Tell us what went well or what we can improve..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              disabled={submitting}
            />
          </div>

          <DialogFooter className="px-5 py-3 border-t border-[#242c36]">
            <div className="flex w-full justify-end gap-2">
              <button
                type="button"
                onClick={() => onOpenChange?.(false)}
                className="px-4 py-2 rounded-md bg-white text-black text-sm font-medium hover:bg-slate-100 disabled:opacity-50"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-md bg-primary-600 hover:bg-primary-500 text-white text-sm font-semibold disabled:opacity-50"
                disabled={submitting}
              >
                {submitting ? "Sending..." : "Send"}
              </button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
