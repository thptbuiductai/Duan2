import React, { useState, useMemo } from 'react';
import { 
  LineChart, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  X, 
  ChevronRight, 
  BookOpen, 
  User,
  GraduationCap
} from 'lucide-react';
import { Student, TaskItem, TaskSubmission } from '../types';
import { educationalAudio } from '../utils/audio';

interface ProgressTrackerProps {
  students: Student[];
  tasks: TaskItem[];
  submissions: TaskSubmission[];
  isProjectorMode: boolean;
}

export const ProgressTracker: React.FC<ProgressTrackerProps> = ({
  students,
  tasks,
  submissions,
  isProjectorMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('Tất cả');
  const [selectedStudentDetail, setSelectedStudentDetail] = useState<Student | null>(null);

  // Class list
  const classesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.className));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Compute progress for each student
  const studentProgressList = useMemo(() => {
    return students.map((student) => {
      // Get all tasks applicable to this student
      const applicableTasks = tasks.filter(
        (t) => t.className === 'Tất cả' || t.className === student.className
      );

      const totalAssigned = applicableTasks.length;
      let completedCount = 0;

      applicableTasks.forEach((t) => {
        const sub = submissions.find((s) => s.taskId === t.id && s.studentId === student.id);
        if (sub && sub.completed) {
          completedCount++;
        }
      });

      const pendingCount = totalAssigned - completedCount;
      const rate = totalAssigned > 0 ? Math.round((completedCount / totalAssigned) * 100) : 0;

      return {
        student,
        totalAssigned,
        completedCount,
        pendingCount,
        rate,
      };
    });
  }, [students, tasks, submissions]);

  // Filter list
  const filteredList = useMemo(() => {
    return studentProgressList.filter((item) => {
      const matchSearch =
        item.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = classFilter === 'Tất cả' || item.student.className === classFilter;
      return matchSearch && matchClass;
    });
  }, [studentProgressList, searchTerm, classFilter]);

  // Overall class summary
  const classSummary = useMemo(() => {
    const list = classFilter === 'Tất cả' 
      ? studentProgressList 
      : studentProgressList.filter((i) => i.student.className === classFilter);

    const totalStudentsInGroup = list.length;
    if (totalStudentsInGroup === 0) return { avgRate: 0, completedAll: 0, inProgress: 0, needsAttention: 0 };

    const totalRate = list.reduce((acc, curr) => acc + curr.rate, 0);
    const avgRate = Math.round(totalRate / totalStudentsInGroup);

    const completedAll = list.filter((i) => i.rate === 100).length;
    const inProgress = list.filter((i) => i.rate >= 50 && i.rate < 100).length;
    const needsAttention = list.filter((i) => i.rate < 50).length;

    return { avgRate, completedAll, inProgress, needsAttention };
  }, [studentProgressList, classFilter]);

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'text-base' : ''}`}>
      {/* Header bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <LineChart className="w-5 h-5 text-teal-600" />
            <span>Theo dõi Tiến độ Học tập Học sinh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng quan mức độ hoàn thành nhiệm vụ thực hành và lý thuyết môn Tin học THPT
          </p>
        </div>

        {/* Lọc theo lớp */}
        <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 border border-slate-200 rounded-lg">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500 shrink-0">Lớp:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="bg-transparent text-sm text-slate-800 font-semibold focus:outline-hidden"
          >
            {classesList.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Thẻ tóm tắt tiến độ lớp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Tiến độ trung bình {classFilter !== 'Tất cả' ? `Lớp ${classFilter}` : 'toàn khối'}</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-700 tabular-nums">{classSummary.avgRate}%</span>
            <span className="text-xs text-slate-500">hoàn thành</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div className="bg-teal-600 h-1.5 rounded-full" style={{ width: `${classSummary.avgRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Hoàn thành 100% nhiệm vụ</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-600 tabular-nums">{classSummary.completedAll}</span>
            <span className="text-xs text-slate-500">học sinh</span>
          </div>
          <span className="text-xs text-emerald-700 font-medium">Đạt tiến độ xuất sắc</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Đang thực hiện (≥ 50%)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-cyan-600 tabular-nums">{classSummary.inProgress}</span>
            <span className="text-xs text-slate-500">học sinh</span>
          </div>
          <span className="text-xs text-cyan-700 font-medium">Đang làm bài tập</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <span className="text-xs font-medium text-slate-500">Cần nhắc nhở (&lt; 50%)</span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600 tabular-nums">{classSummary.needsAttention}</span>
            <span className="text-xs text-slate-500">học sinh</span>
          </div>
          <span className="text-xs text-amber-700 font-medium">Chưa nộp đủ bài</span>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm học sinh để xem tiến độ cụ thể..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </div>

      {/* Danh sách tiến độ học sinh */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-4 text-center">Đã giao</th>
                <th className="py-3 px-4 text-center">Đã xong</th>
                <th className="py-3 px-4 text-center">Chưa xong</th>
                <th className="py-3 px-4 w-48">Tỷ lệ hoàn thành</th>
                <th className="py-3 px-4 text-right">Chi tiết</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredList.map((item, index) => {
                const { student, totalAssigned, completedCount, pendingCount, rate } = item;
                return (
                  <tr 
                    key={student.id} 
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                    onClick={() => {
                      educationalAudio.playClickSound();
                      setSelectedStudentDetail(student);
                    }}
                  >
                    <td className="py-3 px-4 text-center text-xs text-slate-500 font-mono tabular-nums">
                      {index + 1}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{student.fullName}</div>
                      <div className="text-xs text-slate-500 font-mono">{student.studentCode}</div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-xs">
                        {student.className}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-slate-700">
                      {totalAssigned}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold text-emerald-600">
                      {completedCount}
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-medium text-amber-600">
                      {pendingCount}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-2 rounded-full transition-all duration-300 ${
                              rate === 100
                                ? 'bg-emerald-600'
                                : rate >= 50
                                ? 'bg-teal-600'
                                : 'bg-amber-500'
                            }`}
                            style={{ width: `${rate}%` }}
                          />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 w-10 text-right tabular-nums">
                          {rate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        className="inline-flex items-center gap-1 text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-50 px-2.5 py-1 rounded-md transition-colors"
                      >
                        <span>Xem bài</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Xem chi tiết tiến độ từng bài của 1 học sinh */}
      {selectedStudentDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  {selectedStudentDetail.fullName.slice(0, 2)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedStudentDetail.fullName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mã HS: {selectedStudentDetail.studentCode} · Lớp: {selectedStudentDetail.className}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudentDetail(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chi tiết từng nhiệm vụ của em */}
            <div className="overflow-y-auto flex-1 my-4 divide-y divide-slate-100 pr-1">
              {tasks
                .filter((t) => t.className === 'Tất cả' || t.className === selectedStudentDetail.className)
                .map((task) => {
                  const sub = submissions.find(
                    (s) => s.taskId === task.id && s.studentId === selectedStudentDetail.id
                  );
                  const isDone = sub ? sub.completed : false;

                  return (
                    <div key={task.id} className="py-3.5 space-y-1.5">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <span className="text-xs text-slate-500 font-medium">
                            {task.topic}
                          </span>
                          <h4 className="text-sm font-semibold text-slate-900">
                            {task.title}
                          </h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {isDone ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                        </span>
                      </div>

                      {sub?.submittedAt && (
                        <p className="text-xs text-slate-500">
                          Thời gian nộp bài: <span className="font-medium text-slate-700">{sub.submittedAt}</span>
                        </p>
                      )}

                      {sub?.notes && (
                        <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg italic">
                          Ghi chú nộp bài: "{sub.notes}"
                        </p>
                      )}
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setSelectedStudentDetail(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
