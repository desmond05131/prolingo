import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { createColumnHelper } from '@tanstack/react-table';
import { DataTable } from '@/components/ui/data-table';
import AdminActionButton from '@/components/admin/AdminActionButton';
import { useToast } from '@/hooks/use-toast';
import {
  fetchAdminTests,
  updateAdminTest,
  createAdminTest,
  deleteAdminTest,
  fetchAdminQuestions,
  updateAdminQuestion,
  createAdminQuestion,
  deleteAdminQuestion,
  fetchAdminQuestionChoices,
  updateAdminQuestionChoice,
  createAdminQuestionChoice,
  deleteAdminQuestionChoice,
  createAdminCourse,
  updateAdminCourse,
  createAdminChapter,
  updateAdminChapter,
} from '@/api';
import {
  MOCK_ADMIN_TESTS,
  ADMIN_TEST_PRIMARY_KEY,
  MOCK_ADMIN_QUESTIONS,
  ADMIN_QUESTION_PRIMARY_KEY,
  MOCK_ADMIN_QUESTION_CHOICES,
} from '@/constants';
import CourseTestFormDialog from '@/components/admin/CourseTestFormDialog';
import QuestionFormDialog from '@/components/admin/QuestionFormDialog';
import ManageQuestionsDialog from '@/components/admin/ManageQuestionsDialog';
import CourseFormDialog from '@/components/admin/CourseFormDialog';
import ChapterFormDialog from '@/components/admin/ChapterFormDialog';

const columnHelper = createColumnHelper();

export default function AdminCourses() {
  const { toast } = useToast();
  const [rows, setRows] = useState(() => []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [activeTest, setActiveTest] = useState(null);
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [activeCourse, setActiveCourse] = useState(null);
  const [activeChapter, setActiveChapter] = useState(null);
  const [parentTestId, setParentTestId] = useState(null);
  const [questionsModalTest, setQuestionsModalTest] = useState(null);

  const [questionsByTest, setQuestionsByTest] = useState({});
  const [choicesByQuestion, setChoicesByQuestion] = useState({});

  const loadTests = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const list = await fetchAdminTests();
      if (Array.isArray(list) && list.length) setRows(list);
    } catch (err) {
      setError(err?.message || 'Failed to load tests');
      toast({ description: 'Failed to load tests', variant: 'destructive' });
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadTests(); }, [loadTests]);

  const data = useMemo(() => rows, [rows]);

  const loadQuestions = useCallback(async (testId) => {
    try {
      const list = await fetchAdminQuestions(testId);
      if (!Array.isArray(list) || list.length === 0) throw new Error('No API questions');
      setQuestionsByTest(prev => ({ ...prev, [testId]: list }));
    } catch {
      const fallback = MOCK_ADMIN_QUESTIONS.filter(q => q.test_id === testId);
      setQuestionsByTest(prev => ({ ...prev, [testId]: fallback }));
    }
  }, []);

  const loadChoices = useCallback(async (questionId) => {
    try {
      const list = await fetchAdminQuestionChoices(questionId);
      if (!Array.isArray(list) || list.length === 0) throw new Error('No API choices');
      setChoicesByQuestion(prev => ({ ...prev, [questionId]: list }));
    } catch {
      const fallback = MOCK_ADMIN_QUESTION_CHOICES.filter(c => c.question_id === questionId);
      setChoicesByQuestion(prev => ({ ...prev, [questionId]: fallback }));
    }
  }, []);

  const handleSaveTest = useCallback(async (updated) => {
    const pk = ADMIN_TEST_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminTest(updated[pk], updated);
        toast({ description: 'Test updated successfully.' });
      } else {
        await createAdminTest(updated);
        toast({ description: 'Test created successfully.' });
      }
      await loadTests();
    } catch (err) {
      toast({ description: err?.message || 'Failed to save test', variant: 'destructive' });
      throw err;
    }
  }, [loadTests, toast]);

  const handleSaveQuestion = useCallback(async (updated) => {
    const pk = ADMIN_QUESTION_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        await updateAdminQuestion(updated[pk], updated);
        toast({ description: 'Question updated successfully.' });
      } else {
        await createAdminQuestion(updated);
        toast({ description: 'Question created successfully.' });
      }
      if (updated.test_id) await loadQuestions(updated.test_id);
    } catch (err) {
      toast({ description: err?.message || 'Failed to save question', variant: 'destructive' });
      throw err;
    }
  }, [loadQuestions, toast]);

  const handleSaveCourse = useCallback(async (updated) => {
    try {
      if (updated?.course_id) {
        await updateAdminCourse(updated.course_id, updated);
        toast({ description: 'Course updated successfully.' });
      } else {
        await createAdminCourse(updated);
        toast({ description: 'Course created successfully.' });
      }
      setActiveCourse(null);
    } catch (err) {
      toast({ description: err?.message || 'Failed to save course', variant: 'destructive' });
      throw err;
    }
  }, [toast]);

  const handleSaveChapter = useCallback(async (updated) => {
    try {
      if (updated?.chapter_id) {
        await updateAdminChapter(updated.chapter_id, updated);
        toast({ description: 'Chapter updated successfully.' });
      } else {
        await createAdminChapter(updated);
        toast({ description: 'Chapter created successfully.' });
      }
      setActiveChapter(null);
    } catch (err) {
      toast({ description: err?.message || 'Failed to save chapter', variant: 'destructive' });
      throw err;
    }
  }, [toast]);

  const columns = useMemo(() => [
    columnHelper.accessor('course.course_id', { header: 'Course ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('course.title', { header: 'Course', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('course.status', { header: 'Course Status' }),
    columnHelper.accessor('chapter.chapter_id', { header: 'Chapter ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('chapter.title', { header: 'Chapter', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('chapter.order_index', { header: 'Chapter Order' }),
    columnHelper.accessor('test.test_id', { header: 'Test ID', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('test.title', { header: 'Test Title', sortingFn: 'alphanumeric' }),
    columnHelper.accessor('test.order_index', { header: 'Test Order' }),
    columnHelper.accessor('test.passing_score', { header: 'Passing Score' }),
    columnHelper.display({
      id: 'q_manage', header: 'Questions', cell: info => {
        const record = info.row.original;
        return (
          <div className="flex flex-col">
            <AdminActionButton onClick={async () => {
              await loadQuestions(record.test_id);
              setQuestionsModalTest(record);
            }}>Manage Questions</AdminActionButton>
          </div>
        );
      }, enableSorting: false
    }),
    columnHelper.display({
      id: 'actions', header: 'Actions', cell: info => {
        const record = info.row.original;
        return (
          <div className="flex gap-1">
            <AdminActionButton variant="outline" onClick={() => setActiveTest(record)}>Modify</AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!record.test_id) return;
              if (!window.confirm('Delete this test?')) return;
              try {
                await deleteAdminTest(record.test_id);
                toast({ description: 'Test deleted.' });
                await loadTests();
              } catch (err) {
                toast({ description: err?.message || 'Failed to delete test', variant: 'destructive' });
              }
            }}>Delete</AdminActionButton>
          </div>
        );
      }, enableSorting: false
    })
  ], [loadTests, loadQuestions, toast]);

  return (
    <div className="space-y-10">
      <header className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <h2 className="text-2xl font-semibold">Courses & Related (Tests)</h2>
        <div className="flex gap-2">
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveCourse({ course_id: undefined, title: '', description: '', status: 'draft' })}
          >Create Course</button>
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveChapter({ chapter_id: undefined, course_id: '', title: '', description: '', learning_resource_url: '', order_index: 1 })}
          >Create Chapter</button>
          <button
            className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-neutral-800 bg-neutral-900 text-neutral-100 border border-neutral-800 hover:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            onClick={() => setActiveTest({
              test_id: undefined,
              title: '',
              passing_score: '',
              order_index: 1,
              chapter_id: '',
              chapter_title: '',
              course_id: '',
              course_title: '',
              course_status: 'draft',
            })}
          >Create Test</button>
        </div>
      </header>
      <section>
        <div className="rounded border border-neutral-800 bg-neutral-950/30 p-0">
          {error && <div className="p-3 text-sm text-destructive border-b border-destructive/30 bg-destructive/5">{error}</div>}
          {loading ? <div className="p-6 text-sm text-neutral-400">Loading tests...</div> : <DataTable columns={columns} data={data} />}
        </div>
      </section>
      <CourseTestFormDialog
        open={!!activeTest}
        onOpenChange={(o) => { if (!o) setActiveTest(null); }}
        record={activeTest}
        onSave={handleSaveTest}
      />
      <QuestionFormDialog
        open={!!activeQuestion}
        onOpenChange={(o) => { if (!o) { setActiveQuestion(null); setParentTestId(null); } }}
        record={activeQuestion}
        parentTestId={parentTestId}
        onSave={handleSaveQuestion}
      />
      <CourseFormDialog
        open={!!activeCourse}
        onOpenChange={(o) => { if (!o) setActiveCourse(null); }}
        record={activeCourse}
        onSave={handleSaveCourse}
      />
      <ChapterFormDialog
        open={!!activeChapter}
        onOpenChange={(o) => { if (!o) setActiveChapter(null); }}
        record={activeChapter}
        onSave={handleSaveChapter}
      />
      <ManageQuestionsDialog
        open={!!questionsModalTest}
        onOpenChange={(o) => { if (!o) setQuestionsModalTest(null); }}
        testRecord={questionsModalTest}
        questions={questionsModalTest ? questionsByTest[questionsModalTest.test_id] : null}
        onAddQuestion={() => {
          const testId = questionsModalTest?.test_id;
          setParentTestId(testId || null);
          const nextOrder = ((questionsByTest[testId]?.length) || 0) + 1;
          setActiveQuestion({ question_id: undefined, test_id: testId, text: '', type: 'MCQ', correct_answer_text: '', order_index: nextOrder });
        }}
        onEditQuestion={(q) => setActiveQuestion(q)}
        onDeleteQuestion={async (q) => {
          if (!window.confirm('Delete this question?')) return;
          try {
            await deleteAdminQuestion(q.question_id);
            toast({ description: 'Question deleted.' });
            if (q.test_id) await loadQuestions(q.test_id);
          } catch (err) {
            toast({ description: err?.message || 'Failed to delete question', variant: 'destructive' });
          }
        }}
        choicesByQuestion={choicesByQuestion}
        loadChoices={loadChoices}
        onAddChoice={async (question) => {
          const text = prompt('Choice text');
          if (!text) return;
          try {
            const count = (choicesByQuestion[question.question_id]?.length) || 0;
            await createAdminQuestionChoice({ question_id: question.question_id, text, order_index: count + 1 });
            await loadChoices(question.question_id);
            toast({ description: 'Choice added.' });
          } catch (err) {
            toast({ description: err?.message || 'Failed to add choice', variant: 'destructive' });
          }
        }}
        onEditChoice={async (choice) => {
          const text = prompt('Edit choice', choice.text);
          if (text == null) return;
          try {
            await updateAdminQuestionChoice(choice.choice_id, { ...choice, text });
            await loadChoices(choice.question_id);
            toast({ description: 'Choice updated.' });
          } catch (err) {
            toast({ description: err?.message || 'Failed to update choice', variant: 'destructive' });
          }
        }}
        onDeleteChoice={async (choice) => {
          if (!window.confirm('Delete this choice?')) return;
          try {
            await deleteAdminQuestionChoice(choice.choice_id);
            await loadChoices(choice.question_id);
            toast({ description: 'Choice deleted.' });
          } catch (err) {
            toast({ description: err?.message || 'Failed to delete choice', variant: 'destructive' });
          }
        }}
      />
    </div>
  );
}
