import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  BookOpen, 
  LineChart, 
  GraduationCap, 
  Volume2, 
  VolumeX, 
  Monitor, 
  RotateCcw, 
  Download, 
  UserCheck, 
  Sparkles,
  ChevronDown,
  HelpCircle
} from 'lucide-react';
import { educationalAudio } from '../utils/audio';
import { Student } from '../types';

export type NavTab = 'dashboard' | 'students' | 'tasks' | 'progress' | 'grades';
export type UserRole = 'teacher' | 'student';

interface NavbarProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  role: UserRole;
  onRoleChange: (role: UserRole) => void;
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
  students: Student[];
  isProjectorMode: boolean;
  onToggleProjectorMode: () => void;
  onResetData: () => void;
  onExportHtml: () => void;
  onOpenGuide: (defaultTab?: 'teacher' | 'student' | 'faq') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  role,
  onRoleChange,
  selectedStudent,
  onSelectStudent,
  students,
  isProjectorMode,
  onToggleProjectorMode,
  onResetData,
  onExportHtml,
  onOpenGuide,
}) => {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMusic = () => {
    const playing = educationalAudio.toggleBackgroundMusic();
    setIsPlayingMusic(playing);
    educationalAudio.playClickSound();
  };

  const navItems: { id: NavTab; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'students', label: 'Học sinh', icon: <Users className="w-4 h-4" /> },
    { id: 'tasks', label: 'Nhiệm vụ', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'progress', label: 'Tiến độ', icon: <LineChart className="w-4 h-4" /> },
    { id: 'grades', label: 'Điểm số', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Thông tin trường & giáo viên phụ trách */}
      <div className="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-teal-400">TRƯỜNG THPT BÙI DỤC TÀI</span>
            <span className="text-slate-500">·</span>
            <span>Môn học: <strong className="text-white font-medium">Tin học THPT</strong></span>
            <span className="text-slate-500">·</span>
            <span>Người phụ trách: <strong className="text-teal-300 font-medium">GV Trần Văn Bích</strong></span>
          </div>

          <div className="flex items-center gap-3">
            {/* Nút hướng dẫn nhanh ở thanh tiêu đề */}
            <button
              type="button"
              onClick={() => onOpenGuide(role === 'teacher' ? 'teacher' : 'student')}
              className="text-xs text-teal-300 hover:text-white flex items-center gap-1 transition-colors px-2 py-0.5 rounded bg-slate-800 border border-slate-700 hover:bg-slate-750"
              title="Mở hướng dẫn sử dụng"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hướng dẫn sử dụng</span>
            </button>

            {/* Vai trò hiện tại */}
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Chế độ xem:</span>
              <div className="inline-flex rounded-md p-0.5 bg-slate-800 border border-slate-700">
                <button
                  type="button"
                  onClick={() => {
                    educationalAudio.playClickSound();
                    onRoleChange('teacher');
                  }}
                  className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                    role === 'teacher'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Giáo viên
                </button>
                <button
                  type="button"
                  onClick={() => {
                    educationalAudio.playClickSound();
                    onRoleChange('student');
                    if (!selectedStudent && students.length > 0) {
                      onSelectStudent(students[0]);
                    }
                  }}
                  className={`px-2.5 py-0.5 text-xs font-medium rounded transition-colors ${
                    role === 'student'
                      ? 'bg-teal-600 text-white shadow-xs'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  Học sinh
                </button>
              </div>
            </div>

            {/* Nếu đang ở chế độ học sinh, cho phép chọn học sinh mô phỏng */}
            {role === 'student' && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 hidden sm:inline">Em:</span>
                <select
                  aria-label="Chọn học sinh để xem dữ liệu cá nhân"
                  value={selectedStudent?.id || ''}
                  onChange={(e) => {
                    const st = students.find((s) => s.id === e.target.value) || null;
                    onSelectStudent(st);
                    educationalAudio.playClickSound();
                  }}
                  className="bg-slate-800 border border-slate-700 text-teal-300 rounded px-2 py-0.5 text-xs font-medium focus:ring-1 focus:ring-teal-400 outline-hidden"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.fullName} ({s.className})
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Zone 1: Brand Title */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-linear-to-br from-teal-600 to-cyan-700 flex items-center justify-center text-white shadow-xs shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight truncate">
                TRỢ LÝ TIN HỌC THPT BÙI DỤC TÀI
              </h1>
            </div>
          </div>

          {/* Zone 2: Navigation Links (Teacher Mode Only or filtered for Student) */}
          <nav className="hidden md:flex items-center gap-1">
            {role === 'teacher' ? (
              navItems.map((item) => {
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      educationalAudio.playClickSound();
                      onTabChange(item.id);
                    }}
                    className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                      isActive
                        ? 'bg-teal-50 text-teal-800 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                );
              })
            ) : (
              <div className="text-xs font-medium text-teal-800 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
                Góc học tập cá nhân của học sinh: <strong className="font-semibold">{selectedStudent?.fullName || 'Học sinh'}</strong>
              </div>
            )}
          </nav>

          {/* Zone 3: Actions (Guide, Sound, Projector, Menu) */}
          <div className="flex items-center gap-2">
            {/* Nút Hướng dẫn sử dụng */}
            <button
              type="button"
              onClick={() => onOpenGuide(role === 'teacher' ? 'teacher' : 'student')}
              title="Hướng dẫn sử dụng cho giáo viên và học sinh"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 transition-colors shadow-2xs"
            >
              <HelpCircle className="w-4 h-4 text-teal-700" />
              <span>Hướng dẫn</span>
            </button>

            {/* Nút bật tắt nhạc nền giáo dục */}
            <button
              type="button"
              onClick={toggleMusic}
              title={isPlayingMusic ? 'Tắt âm thanh nền' : 'Bật âm thanh nhẹ nhàng lớp học'}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isPlayingMusic
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4 text-slate-400" />}
              <span className="hidden lg:inline">{isPlayingMusic ? 'Âm thanh: Bật' : 'Âm thanh: Tắt'}</span>
            </button>

            {/* Nút chế độ máy chiếu phòng máy (Projector Mode) */}
            <button
              type="button"
              onClick={() => {
                educationalAudio.playClickSound();
                onToggleProjectorMode();
              }}
              title="Chế độ máy chiếu / Phóng to giao diện khi giảng dạy"
              className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                isProjectorMode
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <Monitor className="w-4 h-4" />
              <span className="hidden lg:inline">Máy chiếu</span>
            </button>

            {/* Menu Tiện ích dữ liệu */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                title="Quản lý dữ liệu và xuất file"
              >
                <span>Dữ liệu</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-100"
                  onMouseLeave={() => setIsMenuOpen(false)}
                >
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onOpenGuide();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4 text-teal-600" />
                    <span>Hướng dẫn sử dụng chi tiết</span>
                  </button>
                  <div className="my-1 border-t border-slate-100" />
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onExportHtml();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-teal-50 hover:text-teal-900 flex items-center gap-2"
                  >
                    <Download className="w-4 h-4 text-teal-600" />
                    <span>Xuất file HTML độc lập (Offline)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsMenuOpen(false);
                      onResetData();
                    }}
                    className="w-full px-3.5 py-2 text-left text-xs text-slate-700 hover:bg-amber-50 hover:text-amber-900 flex items-center gap-2"
                  >
                    <RotateCcw className="w-4 h-4 text-amber-600" />
                    <span>Khôi phục dữ liệu mẫu THPT</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation bar */}
        {role === 'teacher' && (
          <div className="flex md:hidden overflow-x-auto py-2 gap-1 border-t border-slate-100 scrollbar-none">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  educationalAudio.playClickSound();
                  onTabChange(item.id);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors ${
                  activeTab === item.id
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};
