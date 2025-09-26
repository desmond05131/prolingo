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
  choicesByQuestion,
  loadChoices,
  onAddChoice,
  onEditChoice,
  onDeleteChoice,
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
            <AdminActionButton variant="outline" onClick={() => onEditQuestion?.(record)}>Modify</AdminActionButton>
            <AdminActionButton onClick={async () => { await loadChoices?.(record.question_id); }}>Load Choices</AdminActionButton>
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
          <DialogTitle>Manage Questions — {testRecord?.title} ({testRecord?.test_id})</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-neutral-400">Course: {testRecord?.course_title} • Chapter: {testRecord?.chapter_title}</div>
            </div>
            <AdminActionButton onClick={onAddQuestion}>Add Question</AdminActionButton>
          </div>
          <div className="rounded border border-neutral-800 bg-neutral-950/40 p-3">
            {!questions ? (
              <div className="p-3 text-sm text-neutral-400">No questions loaded.</div>
            ) : (
              <DataTable columns={cols} data={questions} />
            )}
          </div>
          {questions?.filter(q => q.type === 'MCQ').map(q => {
            const choices = choicesByQuestion?.[q.question_id];
            return (
              <div key={q.question_id} className="rounded border border-neutral-800 bg-neutral-950/30 p-3">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="text-sm font-semibold">Choices for: {q.text}</h5>
                  <AdminActionButton onClick={() => onAddChoice?.(q)}>Add Choice</AdminActionButton>
                </div>
                {!choices ? (
                  <div className="p-2 text-sm text-neutral-400">No choices loaded.</div>
                ) : (
                  <ul className="space-y-1">
                    {choices.map(ch => (
                      <li key={ch.choice_id} className="flex items-center justify-between text-sm">
                        <span>#{ch.order_index} — {ch.text}</span>
                        <div className="flex gap-1">
                          <AdminActionButton variant="outline" onClick={() => onEditChoice?.(ch)}>Modify</AdminActionButton>
                          <AdminActionButton variant="destructive" onClick={() => onDeleteChoice?.(ch)}>Delete</AdminActionButton>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
}
