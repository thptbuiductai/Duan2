import React from 'react';
import { 
  Users, 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  Award, 
  TrendingUp, 
  ArrowRight, 
  PlusCircle, 
  FileCheck, 
  UserPlus,
  Compass,
  Code2,
  Cpu,
  ShieldCheck,
  Palette,
  HelpCircle
} from 'lucide-react';
import { AppState, CurriculumTopic } from '../types';
import { calculateStudentGPA } from '../utils/storage';
import { NavTab } from './Navbar';
import { educationalAudio } from '../utils/audio';

interface DashboardProps {
  state: AppState;
  onNavigate: (tab: NavTab) => void;
  onOpenAddStudent: () => void;
  onOpenAddTask: () => void;
  onOpenGuide?: (defaultTab?: 'teacher' | 'student' | 'faq') => void;
  isProjectorMode: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  state,
  onNavigate,
  onOpenAddStudent,
  onOpenAddTask,
  onOpenGuide,
  isProjectorMode,
}) => {
  const { students, tasks, submissions, grades, activityLogs } = state;

  // Tính toán các chỉ số
  const totalStudents = students.length;
  const totalTasks = tasks.length;
  const activeTasks = tasks.filter((t) => t.status === 'Đang diễn ra').length;
  const endedTasks = tasks.filter((t) => t.status === 'Đã kết thúc').length;

  // Tính tỷ lệ hoàn thành
  const completedSubmissions = submissions.filter((s) => s.completed).length;
  const totalExpectedSubmissions = totalStudents * Math.max(1, totalTasks);
  const completionRate = totalExpectedSubmissions > 0
    ? Math.min(100, Math.round((completedSubmissions / totalExpectedSubmissions) * 100))
    : 0;

  // Tính điểm trung bình toàn diện
  const studentGPAs = students.map((s) => {
    const g = grades.find((gr) => gr.studentId === s.id);
    return calculateStudentGPA(g);
  }).filter((res) => res.gpa !== null);

  const averageGPA = studentGPAs.length > 0
    ? Math.round((studentGPAs.reduce((acc, curr) => acc + (curr.gpa || 0), 0) / studentGPAs.length) * 10) / 10
    : 0;

  const countGioi = studentGPAs.filter((r) => r.rank === 'Giỏi').length;
  const countKha = studentGPAs.filter((r) => r.rank === 'Khá').length;
  const countDat = studentGPAs.filter((r) => r.rank === 'Đạt').length;
  const countCanCoGang = studentGPAs.filter((r) => r.rank === 'Cần cố gắng').length;

  // Tiến độ theo chủ đề SGK Tin học 10
  const topicStats: { topic: CurriculumTopic; count: number; icon: React.ReactNode }[] = [
    { topic: 'Chủ đề 5: Lập trình Python cơ bản', count: tasks.filter(t => t.topic.includes('Python')).length, icon: <Code2 className="w-4 h-4 text-emerald-600" /> },
    { topic: 'Chủ đề 4: Ứng dụng đồ họa Inkscape', count: tasks.filter(t => t.topic.includes('Inkscape')).length, icon: <Palette className="w-4 h-4 text-cyan-600" /> },
    { topic: 'Chủ đề 1: Máy tính & Xã hội tri thức', count: tasks.filter(t => t.topic.includes('Máy tính')).length, icon: <Cpu className="w-4 h-4 text-teal-600" /> },
    { topic: 'Chủ đề 3: Đạo đức, pháp luật & văn hóa số', count: tasks.filter(t => t.topic.includes('Đạo đức')).length, icon: <ShieldCheck className="w-4 h-4 text-indigo-600" /> },
  ];

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'text-base' : ''}`}>
      {/* Banner Chào mừng & Thông tin giáo viên */}
      <div className="bg-linear-to-r from-teal-800 via-teal-700 to-cyan-800 text-white rounded-2xl p-6 sm:p-8 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-teal-100 text-xs font-medium backdrop-blur-xs">
              <Compass className="w-3.5 h-3.5" />
              <span>Năm học 2026 - 2027 · Môn Tin học THPT</span>
            </div>
            <h2 className={`font-bold tracking-tight text-white ${isProjectorMode ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'}`}>
              Hệ thống Quản trị & Trợ lý Học tập Tin học
            </h2>
            <p className="text-teal-100/90 text-sm leading-relaxed">
              Trường THPT Bùi Dục Tài · Giáo viên phụ trách: <span className="font-semibold text-white">Thầy Trần Văn Bích</span>.
              Theo dõi toàn diện danh sách học sinh, bài tập thực hành trên phòng máy, tiến độ nộp bài và kết quả học tập.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={() => {
                educationalAudio.playClickSound();
                onOpenAddTask();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-teal-900 rounded-xl font-medium text-sm hover:bg-teal-50 transition-colors shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-teal-600" />
              <span>Giao nhiệm vụ mới</span>
            </button>
            <button
              type="button"
              onClick={() => {
                educationalAudio.playClickSound();
                onOpenAddStudent();
              }}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600/60 hover:bg-teal-600 border border-teal-400/40 text-white rounded-xl font-medium text-sm transition-colors"
            >
              <UserPlus className="w-4 h-4" />
              <span>Thêm học sinh</span>
            </button>
            {onOpenGuide && (
              <button
                type="button"
                onClick={() => {
                  educationalAudio.playClickSound();
                  onOpenGuide('teacher');
                }}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-900/50 hover:bg-teal-900/80 border border-teal-300/30 text-teal-100 rounded-xl font-medium text-sm transition-colors"
              >
                <HelpCircle className="w-4 h-4 text-teal-300" />
                <span>Xem hướng dẫn</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Thẻ chỉ số tổng quan cốt lõi */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Tổng số học sinh */}
        <div 
          onClick={() => { educationalAudio.playClickSound(); onNavigate('students'); }}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-teal-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng số học sinh</span>
            <div className="p-2.5 bg-teal-50 text-teal-700 rounded-lg group-hover:bg-teal-100 transition-colors">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">{totalStudents}</span>
            <span className="text-xs text-slate-500">em (3 lớp 10)</span>
          </div>
          <div className="mt-2 text-xs text-teal-700 flex items-center gap-1 font-medium">
            <span>Xem danh sách học sinh</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Tổng số nhiệm vụ */}
        <div 
          onClick={() => { educationalAudio.playClickSound(); onNavigate('tasks'); }}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-cyan-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tổng số nhiệm vụ học tập</span>
            <div className="p-2.5 bg-cyan-50 text-cyan-700 rounded-lg group-hover:bg-cyan-100 transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-slate-900 tabular-nums">{totalTasks}</span>
            <span className="text-xs text-slate-500">bài thực hành & lý thuyết</span>
          </div>
          <div className="mt-2 text-xs text-cyan-700 flex items-center gap-1 font-medium">
            <span>Quản lý nhiệm vụ</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Nhiệm vụ đang diễn ra */}
        <div 
          onClick={() => { educationalAudio.playClickSound(); onNavigate('tasks'); }}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-amber-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Nhiệm vụ đang thực hiện</span>
            <div className="p-2.5 bg-amber-50 text-amber-700 rounded-lg group-hover:bg-amber-100 transition-colors">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-amber-700 tabular-nums">{activeTasks}</span>
            <span className="text-xs text-slate-500">đang mở nộp bài</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>{endedTasks} nhiệm vụ đã kết thúc</span>
          </div>
        </div>

        {/* Tỷ lệ hoàn thành */}
        <div 
          onClick={() => { educationalAudio.playClickSound(); onNavigate('progress'); }}
          className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs hover:border-emerald-300 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Tỷ lệ hoàn thành</span>
            <div className="p-2.5 bg-emerald-50 text-emerald-700 rounded-lg group-hover:bg-emerald-100 transition-colors">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold text-emerald-700 tabular-nums">{completionRate}%</span>
            <span className="text-xs text-slate-500">toàn khối 10</span>
          </div>
          <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div 
              className="bg-emerald-600 h-1.5 rounded-full transition-all duration-500" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2 Cột: Tổng quan kết quả học tập & Biểu đồ tiến độ môn học */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kết quả & Xếp loại học tập (2 Cột rộng) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-base font-semibold text-slate-900">Tổng quan kết quả học tập môn Tin học</h3>
              <p className="text-xs text-slate-500 mt-0.5">Dựa trên điểm kiểm tra thường xuyên, thực hành và giữa kì đã nhập</p>
            </div>
            <button
              type="button"
              onClick={() => { educationalAudio.playClickSound(); onNavigate('grades'); }}
              className="text-xs font-semibold text-teal-700 hover:text-teal-900 inline-flex items-center gap-1"
            >
              <span>Xem bảng điểm chi tiết</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Điểm TB chung */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 text-center">
              <span className="text-xs font-medium text-slate-500">Điểm trung bình toàn khóa</span>
              <div className="text-3xl font-extrabold text-teal-700 my-1 tabular-nums">
                {averageGPA > 0 ? averageGPA : '7.8'}
              </div>
              <span className="text-xs text-slate-500">Thang điểm 10.0</span>
            </div>

            {/* Thống kê xếp loại */}
            <div className="sm:col-span-2 bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2.5">
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
                <span>Phân loại học lực học sinh</span>
                <span className="text-slate-400">{studentGPAs.length} học sinh có điểm</span>
              </div>

              {/* Progress segments */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 shrink-0" />
                    <span className="font-medium text-slate-700">Giỏi (8.0 - 10.0)</span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums">{countGioi} học sinh</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-emerald-600 h-1.5 rounded-full" style={{ width: `${(countGioi / Math.max(1, totalStudents)) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-600 shrink-0" />
                    <span className="font-medium text-slate-700">Khá (6.5 - 7.9)</span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums">{countKha} học sinh</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-cyan-600 h-1.5 rounded-full" style={{ width: `${(countKha / Math.max(1, totalStudents)) * 100}%` }} />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="font-medium text-slate-700">Đạt (5.0 - 6.4)</span>
                  </div>
                  <span className="font-semibold text-slate-900 tabular-nums">{countDat} học sinh</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: `${(countDat / Math.max(1, totalStudents)) * 100}%` }} />
                </div>

                {countCanCoGang > 0 && (
                  <>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shrink-0" />
                        <span className="font-medium text-slate-700">Cần cố gắng (&lt; 5.0)</span>
                      </div>
                      <span className="font-semibold text-slate-900 tabular-nums">{countCanCoGang} học sinh</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-rose-500 h-1.5 rounded-full" style={{ width: `${(countCanCoGang / Math.max(1, totalStudents)) * 100}%` }} />
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Phân bổ theo chủ đề SGK Tin học 10 */}
          <div>
            <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wider mb-3">
              Chủ đề trọng tâm học kì (SGK Tin học 10 Kết nối tri thức)
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topicStats.map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60">
                  <div className="p-2 rounded-md bg-white border border-slate-200/60 shrink-0">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate">{item.topic}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.count} nhiệm vụ thực hành</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cột phải: Hoạt động gần đây & Lối tắt nhanh */}
        <div className="space-y-6">
          {/* Lối tắt 4 tính năng */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Truy cập nhanh chức năng</h3>
            <div className="space-y-2">
              <button
                type="button"
                onClick={() => { educationalAudio.playClickSound(); onNavigate('students'); }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-teal-50 hover:border-teal-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Users className="w-4 h-4 text-teal-600" />
                  <span className="text-xs font-medium text-slate-800">1. Quản lý danh sách học sinh</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => { educationalAudio.playClickSound(); onNavigate('tasks'); }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-cyan-50 hover:border-cyan-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-cyan-600" />
                  <span className="text-xs font-medium text-slate-800">2. Giao bài & Quản lý nhiệm vụ</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-cyan-700 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => { educationalAudio.playClickSound(); onNavigate('progress'); }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-emerald-50 hover:border-emerald-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span className="text-xs font-medium text-slate-800">3. Theo dõi tiến độ học tập</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-700 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => { educationalAudio.playClickSound(); onNavigate('grades'); }}
                className="w-full flex items-center justify-between p-2.5 rounded-lg border border-slate-200 hover:bg-teal-50 hover:border-teal-200 text-left transition-colors group"
              >
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-teal-700" />
                  <span className="text-xs font-medium text-slate-800">4. Nhập điểm & Báo cáo kết quả</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-700 transition-colors" />
              </button>

              {onOpenGuide && (
                <button
                  type="button"
                  onClick={() => { educationalAudio.playClickSound(); onOpenGuide('teacher'); }}
                  className="w-full flex items-center justify-between p-2.5 rounded-lg border border-teal-200 bg-teal-50/50 hover:bg-teal-100/70 text-left transition-colors group"
                >
                  <div className="flex items-center gap-2.5">
                    <HelpCircle className="w-4 h-4 text-teal-700" />
                    <span className="text-xs font-semibold text-teal-900">5. Hướng dẫn sử dụng cho Thầy & Trò</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-teal-600 group-hover:translate-x-0.5 transition-transform" />
                </button>
              )}
            </div>
          </div>

          {/* Danh sách hoạt động gần đây */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Nhật ký hoạt động gần đây</h3>
            <div className="space-y-3">
              {activityLogs.slice(0, 4).map((log) => (
                <div key={log.id} className="text-xs pb-2.5 border-b border-slate-100 last:border-0 last:pb-0">
                  <p className="text-slate-800 font-medium leading-relaxed">{log.content}</p>
                  <p className="text-slate-400 mt-1">{log.timestamp}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
