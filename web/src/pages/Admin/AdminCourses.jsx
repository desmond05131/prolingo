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

  const [questionsByTest, setQuestionsByTest] = useState([]);
  const [choicesByQuestion, setChoicesByQuestion] = useState({});

  const loadTests = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const list = await fetchAdminTests();
      if (Array.isArray(list) && list.length) setRows(list);
    } catch (err) {
      setError(err?.message || 'Failed to load tests');
      toast.error('Failed to load tests');
    } finally { setLoading(false); }
  }, [toast]);

  useEffect(() => { loadTests(); }, [loadTests]);

  const data = useMemo(() => rows, [rows]);

  const loadQuestions = useCallback(async (testId) => {
    try {
      const list = await fetchAdminQuestions(testId);
      // if (!Array.isArray(list) || list.length === 0) throw new Error('No API questions');
      setQuestionsByTest(list);
    } catch {
      // const fallback = MOCK_ADMIN_QUESTIONS.filter(q => q.test_id === testId);
      setQuestionsByTest([]);
    }
  }, []);

  const loadChoices = useCallback(async (questionId) => {
    try {
      const list = await fetchAdminQuestionChoices(questionId);
      // if (!Array.isArray(list) || list.length === 0) throw new Error('No API choices');
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
        toast.success('Test updated successfully.');
      } else {
        await createAdminTest(updated);
        toast.success('Test created successfully.');
      }
      await loadTests();
    } catch (err) {
      toast.error(err?.message || 'Failed to save test');
      throw err;
    }
  }, [loadTests, toast]);

  const handleSaveQuestion = useCallback(async (updated) => {
    const pk = ADMIN_QUESTION_PRIMARY_KEY;
    try {
      if (updated[pk]) {
        const saved = await updateAdminQuestion(updated[pk], updated);
        toast.success('Question updated successfully.');
        if (updated.test_id) await loadQuestions(updated.test_id);
        return saved;
      } else {
        // New question; ensure it has correct_answer_id
        updated.correct_answer_text = updated.correct_answer_text || "-";

        const created = await createAdminQuestion(updated);
        toast.success('Question created successfully.');
        if (updated.test_id) await loadQuestions(updated.test_id);
        return created;
      }
    } catch (err) {
      toast.error(err?.message || 'Failed to save question');
      throw err;
    }
  }, [loadQuestions, toast]);

  const handleSaveCourse = useCallback(async (updated) => {
    try {
      if (updated?.course_id) {
        await updateAdminCourse(updated.course_id, updated);
        toast.success('Course updated successfully.');
        loadTests();
      } else {
        await createAdminCourse(updated);
        toast.success('Course created successfully.');
        loadTests();
      }
      setActiveCourse(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to save course');
      throw err;
    }
  }, [toast, loadTests]);

  const handleSaveChapter = useCallback(async (updated) => {
    try {
      if (updated?.chapter_id) {
        await updateAdminChapter(updated.chapter_id, updated);
        toast.success('Chapter updated successfully.');
        loadTests();
      } else {
        await createAdminChapter(updated);
        toast.success('Chapter created successfully.');
        loadTests();
      }
      setActiveChapter(null);
    } catch (err) {
      toast.error(err?.message || 'Failed to save chapter');
      throw err;
    }
  }, [toast, loadTests]);

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
        const testId = record?.test?.test_id ?? record?.test_id;
        return (
          <div className="flex flex-col">
            <AdminActionButton
              disabled={!testId}
              onClick={async () => {
                if (!testId) return;
                await loadQuestions(testId);
                setQuestionsModalTest(record);
              }}
            >
              Manage Questions
            </AdminActionButton>
          </div>
        );
      }, enableSorting: false
    }),
    columnHelper.display({
      id: 'actions', header: 'Actions', cell: info => {
        const record = info.row.original;
        const testId = record?.test?.test_id ?? record?.test_id;
        return (
          <div className="flex gap-1">
            <AdminActionButton
              variant="outline"
              onClick={() => record?.course && setActiveCourse(record.course)}
              disabled={!record?.course?.course_id}
            >
              Modify Course
            </AdminActionButton>
            <AdminActionButton
              variant="outline"
              onClick={() => record?.chapter && setActiveChapter(record.chapter)}
              disabled={!record?.chapter?.chapter_id}
            >
              Modify Chapter
            </AdminActionButton>
            <AdminActionButton
              variant="outline"
              onClick={() => setActiveTest(record)}
              disabled={!testId}
            >
              Modify Test
            </AdminActionButton>
            <AdminActionButton variant="destructive" onClick={async () => {
              if (!testId) return;
              if (!window.confirm('Delete this test?')) return;
              try {
                await deleteAdminTest(testId);
                toast.success('Test deleted.');
                await loadTests();
              } catch (err) {
                toast.error(err?.message || 'Failed to delete test');
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
        record={{
          course: activeTest?.course?.course_id,
          chapter: activeTest?.chapter?.chapter_id,
          ...activeTest?.test
        }}
        onSave={handleSaveTest}
      />
      <QuestionFormDialog
        open={!!activeQuestion}
        onOpenChange={(o) => { if (!o) { setActiveQuestion(null); setParentTestId(null); } }}
        record={activeQuestion}
        parentTestId={parentTestId}
        onSave={handleSaveQuestion}
        // Choices management props
        choices={activeQuestion?.question_id ? choicesByQuestion[activeQuestion.question_id] : []}
        loadChoices={async (qid) => { await loadChoices(qid); }}
        onAddChoice={async (qid, text, orderIndex) => {
          try {
            await createAdminQuestionChoice({ question: qid, text, order_index: orderIndex });
            await loadChoices(qid);
            toast.success('Choice added.');
          } catch (err) {
            toast.error(err?.message || 'Failed to add choice');
          }
        }}
        onEditChoice={async (choiceId, qid, newText) => {
          try {
            const choice = (choicesByQuestion[qid] || []).find(c => c.choice_id === choiceId);
            await updateAdminQuestionChoice(choiceId, { ...choice, text: newText });
            await loadChoices(qid);
            toast.success('Choice updated.');
          } catch (err) {
            toast.error(err?.message || 'Failed to update choice');
          }
        }}
        onDeleteChoice={async (choiceId, qid) => {
          try {
            await deleteAdminQuestionChoice(choiceId);
            await loadChoices(qid);
            toast.success('Choice deleted.');
          } catch (err) {
            toast.error(err?.message || 'Failed to delete choice');
          }
        }}
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
        questions={questionsModalTest ? questionsByTest.filter(x => x.test == questionsModalTest.test.test_id) : null}
        onAddQuestion={() => {
          const testId = questionsModalTest?.test.test_id;
          setParentTestId(testId || null);
          const nextOrder = ((questionsByTest.length) || 0) + 1;
          setActiveQuestion({ question_id: undefined, test: testId, text: '', type: 'mcq', correct_answer_text: '', order_index: nextOrder });
        }}
        onEditQuestion={(q) => setActiveQuestion(q)}
        onDeleteQuestion={async (q) => {
          if (!window.confirm('Delete this question?')) return;
          try {
            await deleteAdminQuestion(q.question_id);
            toast.success('Question deleted.');
            if (q.test_id) await loadQuestions(q.test_id);
          } catch (err) {
            toast.error(err?.message || 'Failed to delete question');
          }
        }}
      />
    </div>
  );
}
