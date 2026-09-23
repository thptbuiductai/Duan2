/**
 * TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI
 * Người phụ trách: Giáo viên Trần Văn Bích
 * Đơn vị: Trường THPT Bùi Dục Tài
 * Môn học: Tin học THPT
 */

import React, { useState, useEffect } from 'react';
import { AppState, Student, TaskItem, StudentGrade } from './types';
import { loadAppState, saveAppState, resetToDefaultData } from './utils/storage';
import { exportStandaloneHtml } from './utils/exportHtml';
import { educationalAudio } from './utils/audio';

import { Navbar, NavTab, UserRole } from './components/Navbar';
import { Dashboard } from './components/Dashboard';
import { StudentManager } from './components/StudentManager';
import { TaskManager } from './components/TaskManager';
import { ProgressTracker } from './components/ProgressTracker';
import { GradeManager } from './components/GradeManager';
import { StudentPortal } from './components/StudentPortal';
import { ToastContainer, ToastMessage } from './components/Toast';
import { ConfirmModal } from './components/ConfirmModal';
import { UserGuideModal } from './components/UserGuideModal';

export default function App() {
  const [state, setState] = useState<AppState>(() => loadAppState());
  const [activeTab, setActiveTab] = useState<NavTab>('dashboard');
  const [role, setRole] = useState<UserRole>('teacher');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(() => {
    const loaded = loadAppState();
    return loaded.students.length > 0 ? loaded.students[0] : null;
  });

  // Projector mode (high contrast & enlarged text for classroom presentation)
  const [isProjectorMode, setIsProjectorMode] = useState<boolean>(false);

  // User Guide modal state
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [guideDefaultTab, setGuideDefaultTab] = useState<'teacher' | 'student' | 'faq'>('teacher');

  // Quick Action modal triggers from Dashboard
  const [openAddStudentModal, setOpenAddStudentModal] = useState(false);
  const [openAddTaskModal, setOpenAddTaskModal] = useState(false);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Reset confirmation modal
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Auto-save whenever state changes
  useEffect(() => {
    saveAppState(state);
  }, [state]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const newToast: ToastMessage = {
      id: `toast-${Date.now()}-${Math.random()}`,
      type,
      message,
    };
    setToasts((prev) => [...prev, newToast]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // --- Student Handlers ---
  const handleAddStudent = (newStudentData: Omit<Student, 'id'>) => {
    const newStudent: Student = {
      ...newStudentData,
      id: `hs-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      students: [...prev.students, newStudent],
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Vừa xong',
          content: `Thêm học sinh mới: ${newStudent.fullName} (${newStudent.className})`,
          category: 'student',
        },
        ...prev.activityLogs,
      ],
    }));
    addToast('success', `Đã thêm học sinh ${newStudent.fullName} vào danh sách lớp ${newStudent.className}`);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setState((prev) => ({
      ...prev,
      students: prev.students.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)),
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Vừa xong',
          content: `Cập nhật thông tin học sinh: ${updatedStudent.fullName}`,
          category: 'student',
        },
        ...prev.activityLogs,
      ],
    }));
    if (selectedStudent?.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
    addToast('success', `Đã cập nhật thông tin học sinh ${updatedStudent.fullName}`);
  };

  const handleDeleteStudent = (id: string) => {
    const student = state.students.find((s) => s.id === id);
    setState((prev) => ({
      ...prev,
      students: prev.students.filter((s) => s.id !== id),
      submissions: prev.submissions.filter((s) => s.studentId !== id),
      grades: prev.grades.filter((g) => g.studentId !== id),
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Vừa xong',
          content: `Xóa học sinh ${student?.fullName || id} khỏi danh sách`,
          category: 'student',
        },
        ...prev.activityLogs,
      ],
    }));
    if (selectedStudent?.id === id) {
      const remaining = state.students.filter((s) => s.id !== id);
      setSelectedStudent(remaining.length > 0 ? remaining[0] : null);
    }
    addToast('info', `Đã xóa học sinh khỏi danh sách`);
  };

  // --- Task Handlers ---
  const handleAddTask = (newTaskData: Omit<TaskItem, 'id'>) => {
    const newTask: TaskItem = {
      ...newTaskData,
      id: `task-${Date.now()}`,
    };
    setState((prev) => ({
      ...prev,
      tasks: [newTask, ...prev.tasks],
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Vừa xong',
          content: `Thầy Bích đã giao nhiệm vụ: ${newTask.title}`,
          category: 'task',
        },
        ...prev.activityLogs,
      ],
    }));
    addToast('success', `Đã giao bài học / nhiệm vụ mới thành công`);
  };

  const handleUpdateTask = (updatedTask: TaskItem) => {
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Vừa xong',
          content: `Cập nhật nhiệm vụ: ${updatedTask.title}`,
          category: 'task',
        },
        ...prev.activityLogs,
      ],
    }));
    addToast('success', `Đã cập nhật nội dung nhiệm vụ`);
  };

  const handleDeleteTask = (id: string) => {
    const task = state.tasks.find((t) => t.id === id);
    setState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((t) => t.id !== id),
      submissions: prev.submissions.filter((s) => s.taskId !== id),
      activityLogs: [
        {
          id: `log-${Date.now()}`,
          timestamp: 'Vừa xong',
          content: `Đã xóa nhiệm vụ: ${task?.title || id}`,
          category: 'task',
        },
        ...prev.activityLogs,
      ],
    }));
    addToast('info', `Đã xóa nhiệm vụ học tập`);
  };

  // --- Submissions Handlers ---
  const handleToggleSubmission = (taskId: string, studentId: string, completed: boolean) => {
    setState((prev) => {
      const existing = prev.submissions.find((s) => s.taskId === taskId && s.studentId === studentId);
      let newSubmissions = [...prev.submissions];

      const nowStr = new Date().toLocaleString('vi-VN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });

      if (existing) {
        newSubmissions = newSubmissions.map((s) =>
          s.taskId === taskId && s.studentId === studentId
            ? { ...s, completed, submittedAt: completed ? nowStr : '' }
            : s
        );
      } else {
        newSubmissions.push({
          id: `sub-${Date.now()}`,
          taskId,
          studentId,
          completed,
          submittedAt: completed ? nowStr : '',
        });
      }

      const st = prev.students.find((s) => s.id === studentId);
      const tk = prev.tasks.find((t) => t.id === taskId);

      return {
        ...prev,
        submissions: newSubmissions,
        activityLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: 'Vừa xong',
            content: completed
              ? `Học sinh ${st?.fullName || 'học sinh'} đã hoàn thành nhiệm vụ "${tk?.title || ''}"`
              : `Hủy trạng thái hoàn thành nhiệm vụ cho học sinh ${st?.fullName || ''}`,
            category: 'student',
          },
          ...prev.activityLogs,
        ],
      };
    });
    addToast('success', completed ? 'Đã đánh dấu hoàn thành bài tập' : 'Đã chuyển về chưa hoàn thành');
  };

  // Học sinh tự nộp bài từ góc học tập cá nhân
  const handleStudentSelfSubmit = (taskId: string, notes: string) => {
    if (!selectedStudent) return;
    const nowStr = new Date().toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });

    setState((prev) => {
      const existing = prev.submissions.find(
        (s) => s.taskId === taskId && s.studentId === selectedStudent.id
      );
      let newSubmissions = [...prev.submissions];

      if (existing) {
        newSubmissions = newSubmissions.map((s) =>
          s.taskId === taskId && s.studentId === selectedStudent.id
            ? { ...s, completed: true, submittedAt: nowStr, notes }
            : s
        );
      } else {
        newSubmissions.push({
          id: `sub-${Date.now()}`,
          taskId,
          studentId: selectedStudent.id,
          completed: true,
          submittedAt: nowStr,
          notes,
        });
      }

      const tk = prev.tasks.find((t) => t.id === taskId);

      return {
        ...prev,
        submissions: newSubmissions,
        activityLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: 'Vừa xong',
            content: `Học sinh ${selectedStudent.fullName} vừa nộp bài: ${tk?.title || ''}`,
            category: 'student',
          },
          ...prev.activityLogs,
        ],
      };
    });

    addToast('success', `Em đã nộp bài thành công cho thầy Trần Văn Bích!`);
  };

  // --- Grade Handlers ---
  const handleUpdateGrade = (newGrade: StudentGrade) => {
    setState((prev) => {
      const exists = prev.grades.some((g) => g.studentId === newGrade.studentId);
      const newGrades = exists
        ? prev.grades.map((g) => (g.studentId === newGrade.studentId ? newGrade : g))
        : [...prev.grades, newGrade];

      const st = prev.students.find((s) => s.id === newGrade.studentId);

      return {
        ...prev,
        grades: newGrades,
        activityLogs: [
          {
            id: `log-${Date.now()}`,
            timestamp: 'Vừa xong',
            content: `Cập nhật điểm và nhận xét cho học sinh ${st?.fullName || ''}`,
            category: 'grade',
          },
          ...prev.activityLogs,
        ],
      };
    });
    addToast('success', `Đã lưu điểm và nhận xét học sinh`);
  };

  // --- Reset & Export Handlers ---
  const handleResetConfirm = () => {
    const refreshed = resetToDefaultData();
    setState(refreshed);
    if (refreshed.students.length > 0) {
      setSelectedStudent(refreshed.students[0]);
    }
    setShowResetConfirm(false);
    educationalAudio.playSuccessSound();
    addToast('info', 'Đã khôi phục dữ liệu mẫu THPT Bùi Dục Tài chuẩn');
  };

  const handleExportHtml = () => {
    exportStandaloneHtml(state);
    educationalAudio.playSuccessSound();
    addToast('success', 'Đã xuất file HTML độc lập để chạy offline!');
  };

  const handleOpenGuide = (tab: 'teacher' | 'student' | 'faq' = 'teacher') => {
    setGuideDefaultTab(tab);
    setIsGuideOpen(true);
    educationalAudio.playClickSound();
  };

  return (
    <div className={`min-h-screen bg-slate-50 flex flex-col ${isProjectorMode ? 'text-lg' : ''}`}>
      {/* Thanh điều hướng chính */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setRole('teacher');
        }}
        role={role}
        onRoleChange={setRole}
        selectedStudent={selectedStudent}
        onSelectStudent={setSelectedStudent}
        students={state.students}
        isProjectorMode={isProjectorMode}
        onToggleProjectorMode={() => setIsProjectorMode(!isProjectorMode)}
        onResetData={() => setShowResetConfirm(true)}
        onExportHtml={handleExportHtml}
        onOpenGuide={handleOpenGuide}
      />

      {/* Thân trang ứng dụng */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {role === 'student' ? (
          selectedStudent ? (
            <StudentPortal
              student={selectedStudent}
              tasks={state.tasks}
              submissions={state.submissions}
              grade={state.grades.find((g) => g.studentId === selectedStudent.id)}
              onStudentSubmitTask={handleStudentSelfSubmit}
              onOpenGuide={() => handleOpenGuide('student')}
              isProjectorMode={isProjectorMode}
            />
          ) : (
            <div className="bg-white p-8 rounded-xl border border-slate-200 text-center">
              <p className="text-slate-600">Chưa có dữ liệu học sinh để hiển thị góc học tập.</p>
            </div>
          )
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                state={state}
                onNavigate={setActiveTab}
                onOpenAddStudent={() => {
                  setActiveTab('students');
                  setOpenAddStudentModal(true);
                }}
                onOpenAddTask={() => {
                  setActiveTab('tasks');
                  setOpenAddTaskModal(true);
                }}
                onOpenGuide={handleOpenGuide}
                isProjectorMode={isProjectorMode}
              />
            )}

            {activeTab === 'students' && (
              <StudentManager
                students={state.students}
                onAddStudent={handleAddStudent}
                onUpdateStudent={handleUpdateStudent}
                onDeleteStudent={handleDeleteStudent}
                isProjectorMode={isProjectorMode}
                initialAddModalOpen={openAddStudentModal}
                onCloseInitialAddModal={() => setOpenAddStudentModal(false)}
              />
            )}

            {activeTab === 'tasks' && (
              <TaskManager
                tasks={state.tasks}
                students={state.students}
                submissions={state.submissions}
                onAddTask={handleAddTask}
                onUpdateTask={handleUpdateTask}
                onDeleteTask={handleDeleteTask}
                onToggleSubmission={handleToggleSubmission}
                isProjectorMode={isProjectorMode}
                initialAddModalOpen={openAddTaskModal}
                onCloseInitialAddModal={() => setOpenAddTaskModal(false)}
              />
            )}

            {activeTab === 'progress' && (
              <ProgressTracker
                students={state.students}
                tasks={state.tasks}
                submissions={state.submissions}
                isProjectorMode={isProjectorMode}
              />
            )}

            {activeTab === 'grades' && (
              <GradeManager
                students={state.students}
                grades={state.grades}
                onUpdateGrade={handleUpdateGrade}
                isProjectorMode={isProjectorMode}
              />
            )}
          </>
        )}
      </main>

      {/* Footer chân trang */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI</span>
            <span>·</span>
            <span>Phụ trách: Thầy Trần Văn Bích</span>
          </div>
          <div className="text-slate-400">
            Ứng dụng quản trị và hỗ trợ giảng dạy môn Tin học THPT · Dữ liệu lưu cục bộ trên trình duyệt
          </div>
        </div>
      </footer>

      {/* Modal xác nhận khôi phục dữ liệu mẫu */}
      <ConfirmModal
        isOpen={showResetConfirm}
        title="Khôi phục dữ liệu mẫu chuẩn"
        message="Thao tác này sẽ tải lại danh sách học sinh mẫu, các bài thực hành Python & Inkscape chuẩn và kết quả đánh giá ban đầu. Dữ liệu mới nhập chưa xuất có thể bị thay thế."
        confirmText="Khôi phục dữ liệu"
        cancelText="Hủy bỏ"
        isDanger={false}
        onConfirm={handleResetConfirm}
        onCancel={() => setShowResetConfirm(false)}
      />

      {/* Modal Hướng dẫn sử dụng cho Thầy và Trò */}
      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        defaultTab={guideDefaultTab}
      />

      {/* Toast thông báo */}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </div>
  );
}
