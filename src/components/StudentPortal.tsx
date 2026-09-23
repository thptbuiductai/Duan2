import React, { useState } from 'react';
import { 
  Student, 
  TaskItem, 
  TaskSubmission, 
  StudentGrade 
} from '../types';
import { calculateStudentGPA } from '../utils/storage';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  Calendar, 
  Send, 
  Check, 
  AlertCircle,
  FileCheck,
  User,
  GraduationCap,
  HelpCircle
} from 'lucide-react';
import { educationalAudio } from '../utils/audio';

interface StudentPortalProps {
  student: Student;
  tasks: TaskItem[];
  submissions: TaskSubmission[];
  grade?: StudentGrade;
  onStudentSubmitTask: (taskId: string, notes: string) => void;
  onOpenGuide?: () => void;
  isProjectorMode: boolean;
}

export const StudentPortal: React.FC<StudentPortalProps> = ({
  student,
  tasks,
  submissions,
  grade,
  onStudentSubmitTask,
  onOpenGuide,
  isProjectorMode,
}) => {
  const [submittingTaskId, setSubmittingTaskId] = useState<string | null>(null);
  const [submissionNote, setSubmissionNote] = useState('');

  // Lọc nhiệm vụ thuộc về lớp của em hoặc toàn khối
  const myTasks = tasks.filter(
    (t) => t.className === 'Tất cả' || t.className === student.className
  );

  // Tính tiến độ cá nhân
  const completedTasksCount = myTasks.filter((t) => {
    const sub = submissions.find((s) => s.taskId === t.id && s.studentId === student.id);
    return sub && sub.completed;
  }).length;

  const totalAssigned = myTasks.length;
  const progressRate = totalAssigned > 0
    ? Math.round((completedTasksCount / totalAssigned) * 100)
    : 0;

  // Tính GPA cá nhân
  const { gpa, rank } = calculateStudentGPA(grade);

  const handleSubmit = (taskId: string) => {
    onStudentSubmitTask(taskId, submissionNote);
    educationalAudio.playSuccessSound();
    setSubmittingTaskId(null);
    setSubmissionNote('');
  };

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'text-base' : ''}`}>
      {/* Banner Chào mừng cá nhân */}
      <div className="bg-linear-to-r from-teal-800 to-cyan-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-medium backdrop-blur-xs">
                <User className="w-3.5 h-3.5" />
                <span>Góc học tập cá nhân · Học sinh THPT Bùi Dục Tài</span>
              </div>
              {onOpenGuide && (
                <button
                  type="button"
                  onClick={() => {
                    educationalAudio.playClickSound();
                    onOpenGuide();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/60 hover:bg-teal-900 text-teal-100 text-xs font-medium border border-teal-300/30 transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-teal-300" />
                  <span>Hướng dẫn nộp bài & xem điểm</span>
                </button>
              )}
            </div>
            <h2 className={`font-bold tracking-tight text-white ${isProjectorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              Xin chào, {student.fullName}!
            </h2>
            <p className="text-teal-100/90 text-sm leading-relaxed max-w-2xl">
              Mã học sinh: <strong className="text-white font-mono">{student.studentCode}</strong> · Lớp: <strong className="text-white">{student.className}</strong>
              <br />
              Giáo viên phụ trách môn: <span className="font-semibold text-white">Thầy Trần Văn Bích</span>. Chúc em học tốt và rèn luyện kỹ năng Tin học thật xuất sắc!
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs border border-white/20 p-4 rounded-xl text-center shrink-0">
            <span className="text-xs font-medium text-teal-100">Điểm Tin học hiện tại</span>
            <div className="text-3xl font-extrabold text-white my-1 tabular-nums">
              {gpa !== null ? gpa : '—'}
            </div>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/20 text-white">
              Xếp loại: {rank}
            </span>
          </div>
        </div>
      </div>

      {/* 3 Thẻ tiến độ cá nhân */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tiến độ hoàn thành nhiệm vụ</span>
            <div className="p-2 bg-teal-50 text-teal-700 rounded-lg">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-teal-700 tabular-nums">{progressRate}%</span>
            <span className="text-xs text-slate-500">đã xong</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${progressRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nhiệm vụ đã hoàn thành</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <FileCheck className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 tabular-nums">{completedTasksCount}</span>
            <span className="text-xs text-slate-500">/ {totalAssigned} bài được giao</span>
          </div>
          <p className="mt-2 text-xs text-emerald-700 font-medium">
            {completedTasksCount === totalAssigned ? 'Em đã hoàn thành xuất sắc tất cả bài tập!' : 'Tiếp tục cố gắng hoàn thành nhé!'}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nhiệm vụ cần nộp</span>
            <div className="p-2 bg-amber-50 text-amber-700 rounded-lg">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700 tabular-nums">{totalAssigned - completedTasksCount}</span>
            <span className="text-xs text-slate-500">bài chưa xong</span>
          </div>
          <p className="mt-2 text-xs text-slate-500">
            Xem danh sách bài tập bên dưới để nộp bài
          </p>
        </div>
      </div>

      {/* 2 Phần chính: Danh sách nhiệm vụ của em & Kết quả điểm số */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cột 1 & 2: Danh sách nhiệm vụ được giao */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-teal-600" />
                <span>Nhiệm vụ học tập môn Tin học được giao</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">
                {myTasks.length} bài tập
              </span>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {myTasks.map((task) => {
                const sub = submissions.find(
                  (s) => s.taskId === task.id && s.studentId === student.id
                );
                const isCompleted = sub && sub.completed;

                return (
                  <div key={task.id} className="py-4 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                            {task.topic}
                          </span>
                          {task.lessonRef && (
                            <span className="text-xs text-slate-500 font-medium">
                              {task.lessonRef}
                            </span>
                          )}
                        </div>
                        <h4 className="text-base font-bold text-slate-900 leading-snug">
                          {task.title}
                        </h4>
                      </div>

                      <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                        isCompleted
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {isCompleted ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                      {task.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Hạn nộp: <strong className="text-slate-700">{task.deadline}</strong></span>
                      </div>

                      {isCompleted ? (
                        <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-semibold bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                          <Check className="w-4 h-4 text-emerald-600" />
                          <span>Em đã nộp bài thành công</span>
                          {sub?.submittedAt && <span className="text-slate-500 font-normal">({sub.submittedAt})</span>}
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => {
                            educationalAudio.playClickSound();
                            setSubmittingTaskId(task.id);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Nộp bài / Báo cáo hoàn thành</span>
                        </button>
                      )}
                    </div>

                    {/* Hiển thị form nộp bài nếu đang mở cho nhiệm vụ này */}
                    {submittingTaskId === task.id && (
                      <div className="mt-3 p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3 animate-in fade-in duration-150">
                        <h5 className="text-xs font-bold text-teal-900">
                          Xác nhận hoàn thành bài tập môn Tin học
                        </h5>
                        <div>
                          <label className="block text-xs font-medium text-slate-700 mb-1">
                            Ghi chú nộp bài (Ví dụ: "Em đã lưu file code Bai1.py trên máy 12 phòng máy số 2"):
                          </label>
                          <textarea
                            rows={2}
                            value={submissionNote}
                            onChange={(e) => setSubmissionNote(e.target.value)}
                            placeholder="Ghi chú bài làm cho thầy Trần Văn Bích..."
                            className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                          />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setSubmittingTaskId(null)}
                            className="px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 rounded-md transition-colors"
                          >
                            Hủy bỏ
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSubmit(task.id)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-teal-700 hover:bg-teal-800 rounded-md transition-colors flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Xác nhận nộp bài</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Cột 3: Bảng điểm cá nhân & Nhận xét của thầy */}
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 pb-3 border-b border-slate-100">
              <Award className="w-5 h-5 text-teal-600" />
              <span>Kết quả học tập môn Tin học</span>
            </h3>

            {/* Chi tiết từng cột điểm */}
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600">ĐGTX 1 (Lý thuyết / Thảo luận)</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">
                  {grade?.tx1 !== null && grade?.tx1 !== undefined ? grade.tx1 : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600">ĐGTX 2 (Thực hành máy tính)</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">
                  {grade?.tx2 !== null && grade?.tx2 !== undefined ? grade.tx2 : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600">Điểm Giữa kì (Hệ số 2)</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">
                  {grade?.gk !== null && grade?.gk !== undefined ? grade.gk : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <span className="text-xs text-slate-600">Điểm Cuối kì (Hệ số 3)</span>
                <span className="font-bold text-slate-900 font-mono tabular-nums">
                  {grade?.ck !== null && grade?.ck !== undefined ? grade.ck : '—'}
                </span>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-teal-50 border border-teal-200">
                <span className="text-xs font-bold text-teal-900">Điểm trung bình môn</span>
                <span className="font-extrabold text-teal-800 text-lg font-mono tabular-nums">
                  {gpa !== null ? gpa : '—'}
                </span>
              </div>
            </div>

            {/* Lời dặn dò của giáo viên Trần Văn Bích */}
            <div className="pt-2">
              <h4 className="text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                Lời dặn dò của Thầy Trần Văn Bích:
              </h4>
              <div className="p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl text-xs text-slate-700 leading-relaxed">
                {grade?.remarks ? (
                  <p className="italic">"{grade.remarks}"</p>
                ) : (
                  <p className="text-slate-500 italic">
                    "Em hãy cố gắng luyện tập thêm các bài thực hành Python và Inkscape để đạt kết quả tốt nhất nhé!"
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
