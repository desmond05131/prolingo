import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import AdminActionButton from '@/components/admin/AdminActionButton';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';

const columnHelper = createColumnHelper();

export default function ManageQuestionsDialog({
  open,
  onOpenChange,
  testRecord,
  questions,
  onAddQuestion,
  onEditQuestion,
  onDeleteQuestion,
}) {
  if (!testRecord) return null;

  const cols = [
    columnHelper.accessor('text', { header: 'Question', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('type', { header: 'Type' }),
    columnHelper.accessor('order_index', { header: 'Order' }),
    columnHelper.accessor('correct_answer_text', { header: 'Correct Answer' }),
    columnHelper.display({
      id: 'q_actions', header: 'Actions', cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton className="text-black" variant="outline" onClick={() => onEditQuestion?.(record)}>Modify</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={() => onDeleteQuestion?.(record)}>Delete</AdminActionButton>
          </div>
        );
      }, enableSorting: false
    })
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          {/* {JSON.stringify(testRecord)} */}
          <DialogTitle>Manage Questions — {testRecord?.test?.title} ({testRecord?.test?.test_id})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-400">Course: {testRecord?.course?.title} • Chapter: {testRecord?.chapter?.title}</div>
            </div>
            <AdminActionButton onClick={onAddQuestion}>Add Question</AdminActionButton>
          </div>
          <div className="rounded border border-neutral-800 bg-black text-white p-3">
            {!questions ? (
              <div className="p-3 text-sm text-neutral-400">No questions loaded.</div>
            ) : (
              <DataTable columns={cols} data={questions} />
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
