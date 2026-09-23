import React, { useState, useMemo } from 'react';
import { 
  BookOpen, 
  PlusCircle, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  Edit3, 
  Trash2, 
  Filter, 
  Search, 
  X, 
  Users, 
  FileText,
  BookmarkCheck,
  Check,
  Sparkles
} from 'lucide-react';
import { TaskItem, TaskStatus, CurriculumTopic, Student, TaskSubmission } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { educationalAudio } from '../utils/audio';

interface TaskManagerProps {
  tasks: TaskItem[];
  students: Student[];
  submissions: TaskSubmission[];
  onAddTask: (task: Omit<TaskItem, 'id'>) => void;
  onUpdateTask: (task: TaskItem) => void;
  onDeleteTask: (id: string) => void;
  onToggleSubmission: (taskId: string, studentId: string, completed: boolean) => void;
  isProjectorMode: boolean;
  initialAddModalOpen?: boolean;
  onCloseInitialAddModal?: () => void;
}

const CURRICULUM_TOPICS: CurriculumTopic[] = [
  'Chủ đề 1: Máy tính & Xã hội tri thức',
  'Chủ đề 2: Mạng máy tính & Internet',
  'Chủ đề 3: Đạo đức, pháp luật & văn hóa số',
  'Chủ đề 4: Ứng dụng đồ họa Inkscape',
  'Chủ đề 5: Lập trình Python cơ bản',
  'Chủ đề 6: Hướng nghiệp với Tin học',
];

export const TaskManager: React.FC<TaskManagerProps> = ({
  tasks,
  students,
  submissions,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onToggleSubmission,
  isProjectorMode,
  initialAddModalOpen = false,
  onCloseInitialAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');
  const [topicFilter, setTopicFilter] = useState<string>('Tất cả');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialAddModalOpen);
  const [editingTask, setEditingTask] = useState<TaskItem | null>(null);

  // Xem danh sách nộp bài của 1 nhiệm vụ
  const [inspectingTask, setInspectingTask] = useState<TaskItem | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    title: string;
    description: string;
    topic: CurriculumTopic;
    className: string;
    deadline: string;
    status: TaskStatus;
    maxScore: number;
    lessonRef: string;
  }>({
    title: '',
    description: '',
    topic: 'Chủ đề 5: Lập trình Python cơ bản',
    className: 'Tất cả',
    deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
    status: 'Đang diễn ra',
    maxScore: 10,
    lessonRef: '',
  });

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialAddModalOpen) {
      handleOpenCreate();
      if (onCloseInitialAddModal) onCloseInitialAddModal();
    }
  }, [initialAddModalOpen]);

  // Unique classes for filtering
  const classesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.className));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    return tasks.filter((t) => {
      const matchSearch =
        t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (t.lessonRef && t.lessonRef.toLowerCase().includes(searchTerm.toLowerCase()));
      const matchStatus = statusFilter === 'Tất cả' || t.status === statusFilter;
      const matchTopic = topicFilter === 'Tất cả' || t.topic === topicFilter;
      return matchSearch && matchStatus && matchTopic;
    });
  }, [tasks, searchTerm, statusFilter, topicFilter]);

  const handleOpenCreate = () => {
    setEditingTask(null);
    setFormData({
      title: '',
      description: '',
      topic: 'Chủ đề 5: Lập trình Python cơ bản',
      className: 'Tất cả',
      deadline: new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0],
      status: 'Đang diễn ra',
      maxScore: 10,
      lessonRef: 'Bài 16 SGK Tin học 10',
    });
    setIsModalOpen(true);
    educationalAudio.playClickSound();
  };

  const handleOpenEdit = (task: TaskItem) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      topic: task.topic,
      className: task.className,
      deadline: task.deadline,
      status: task.status,
      maxScore: task.maxScore,
      lessonRef: task.lessonRef || '',
    });
    setIsModalOpen(true);
    educationalAudio.playClickSound();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    if (editingTask) {
      onUpdateTask({
        ...editingTask,
        ...formData,
      });
    } else {
      onAddTask(formData);
    }

    educationalAudio.playSuccessSound();
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDeleteTask(deletingId);
      educationalAudio.playSuccessSound();
      setDeletingId(null);
    }
  };

  // Helper tính tiến độ nộp bài của nhiệm vụ
  const getTaskProgress = (task: TaskItem) => {
    const applicableStudents = students.filter(
      (s) => task.className === 'Tất cả' || s.className === task.className
    );
    const completedCount = applicableStudents.filter((st) => {
      const sub = submissions.find((s) => s.taskId === task.id && s.studentId === st.id);
      return sub && sub.completed;
    }).length;

    const rate = applicableStudents.length > 0
      ? Math.round((completedCount / applicableStudents.length) * 100)
      : 0;

    return {
      completedCount,
      totalCount: applicableStudents.length,
      rate,
    };
  };

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'text-base' : ''}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <span>Quản lý Bài học & Nhiệm vụ Học tập</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: <strong className="text-slate-800 tabular-nums">{tasks.length}</strong> bài học/nhiệm vụ theo chương trình SGK Tin học 10
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Tạo nhiệm vụ mới</span>
        </button>
      </div>

      {/* Tìm kiếm và Bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tên bài học, nội dung..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-lg">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500 shrink-0">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Đang diễn ra">Đang diễn ra</option>
            <option value="Đã kết thúc">Đã kết thúc</option>
            <option value="Sắp tới">Sắp tới</option>
          </select>
        </div>

        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-lg">
          <span className="text-xs font-medium text-slate-500 shrink-0">Chủ đề:</span>
          <select
            value={topicFilter}
            onChange={(e) => setTopicFilter(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="Tất cả">Tất cả chủ đề SGK</option>
            {CURRICULUM_TOPICS.map((top) => (
              <option key={top} value={top}>{top}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid danh sách nhiệm vụ */}
      {filteredTasks.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-200 p-12 text-center shadow-xs">
          <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-700">Chưa có nhiệm vụ học tập phù hợp</p>
          <p className="text-xs text-slate-500 mt-1">Thầy có thể tạo bài tập mới bằng nút bấm bên trên.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const progress = getTaskProgress(task);
            return (
              <div
                key={task.id}
                className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-teal-300 hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Dòng tiêu đề & Trạng thái */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200">
                          {task.className === 'Tất cả' ? 'Toàn khối 10' : `Lớp ${task.className}`}
                        </span>
                        {task.lessonRef && (
                          <span className="text-xs text-slate-500 font-medium">
                            {task.lessonRef}
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-slate-900 leading-snug">
                        {task.title}
                      </h3>
                    </div>

                    {/* Status badge */}
                    <span className={`shrink-0 px-2.5 py-1 text-xs font-medium rounded-full ${
                      task.status === 'Đang diễn ra'
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : task.status === 'Đã kết thúc'
                        ? 'bg-slate-100 text-slate-700 border border-slate-200'
                        : 'bg-blue-50 text-blue-800 border border-blue-200'
                    }`}>
                      {task.status}
                    </span>
                  </div>

                  {/* Nội dung nhiệm vụ */}
                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                    {task.description}
                  </p>

                  {/* Topic badge */}
                  <div className="text-xs font-medium text-slate-500 flex items-center gap-1.5 pt-1">
                    <BookmarkCheck className="w-3.5 h-3.5 text-teal-600" />
                    <span>{task.topic}</span>
                  </div>
                </div>

                {/* Phần chân thẻ: Tiến độ hoàn thành & Hạn chót & Nút bấm */}
                <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                  {/* Thanh tiến độ nộp bài */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-slate-500">Tiến độ nộp bài:</span>
                      <span className="font-semibold text-slate-800 tabular-nums">
                        {progress.completedCount}/{progress.totalCount} học sinh ({progress.rate}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                      <div
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          progress.rate === 100 ? 'bg-emerald-600' : 'bg-teal-600'
                        }`}
                        style={{ width: `${progress.rate}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>Hạn: <strong className="text-slate-700">{task.deadline}</strong></span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          educationalAudio.playClickSound();
                          setInspectingTask(task);
                        }}
                        className="px-2.5 py-1 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors flex items-center gap-1"
                      >
                        <Users className="w-3.5 h-3.5" />
                        <span>Danh sách nộp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(task)}
                        className="p-1.5 text-slate-400 hover:text-teal-700 hover:bg-slate-100 rounded-md transition-colors"
                        title="Sửa nhiệm vụ"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          educationalAudio.playClickSound();
                          setDeletingId(task.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        title="Xóa nhiệm vụ"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Thêm / Sửa nhiệm vụ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingTask ? 'Chỉnh sửa nhiệm vụ học tập' : 'Giao nhiệm vụ học tập mới'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tên nhiệm vụ / Bài thực hành <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Ví dụ: Thực hành Bài 16: Làm quen với ngôn ngữ lập trình Python"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Chủ đề SGK Tin học 10 <span className="text-rose-500">*</span>
                </label>
                <select
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value as CurriculumTopic })}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {CURRICULUM_TOPICS.map((top) => (
                    <option key={top} value={top}>{top}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Áp dụng cho Lớp
                  </label>
                  <select
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Tất cả">Toàn khối (Tất cả lớp)</option>
                    {classesList.filter(c => c !== 'Tất cả').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Bài tham chiếu SGK
                  </label>
                  <input
                    type="text"
                    value={formData.lessonRef}
                    onChange={(e) => setFormData({ ...formData, lessonRef: e.target.value })}
                    placeholder="Bài 16 - Trang 86 SGK"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Hạn hoàn thành <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.deadline}
                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái nhiệm vụ
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as TaskStatus })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Đang diễn ra">Đang diễn ra</option>
                    <option value="Sắp tới">Sắp tới</option>
                    <option value="Đã kết thúc">Đã kết thúc</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Yêu cầu & Hướng dẫn thực hiện chi tiết
                </label>
                <textarea
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Ghi rõ các bước học sinh cần thực hiện tại phòng máy hoặc ở nhà..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs"
                >
                  {editingTask ? 'Lưu thay đổi' : 'Giao nhiệm vụ'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Chi tiết nộp bài theo từng học sinh */}
      {inspectingTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[85vh] flex flex-col">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
              <div className="min-w-0 pr-4">
                <div className="text-xs text-teal-700 font-semibold mb-1">
                  Bảng điểm danh nộp bài nhiệm vụ
                </div>
                <h3 className="text-base font-bold text-slate-900 truncate">
                  {inspectingTask.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Lớp: {inspectingTask.className} · Hạn: {inspectingTask.deadline}
                </p>
              </div>
              <button
                onClick={() => setInspectingTask(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Danh sách học sinh và nút tick hoàn thành */}
            <div className="overflow-y-auto flex-1 my-4 divide-y divide-slate-100 pr-1">
              {students
                .filter((s) => inspectingTask.className === 'Tất cả' || s.className === inspectingTask.className)
                .map((student) => {
                  const sub = submissions.find(
                    (s) => s.taskId === inspectingTask.id && s.studentId === student.id
                  );
                  const isDone = sub ? sub.completed : false;

                  return (
                    <div key={student.id} className="py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900">{student.fullName}</p>
                        <p className="text-xs text-slate-500">
                          {student.studentCode} · Lớp {student.className}
                          {sub?.submittedAt && ` · Nộp: ${sub.submittedAt}`}
                        </p>
                        {sub?.notes && (
                          <p className="text-xs text-slate-600 mt-1 italic bg-slate-50 p-1.5 rounded">
                            "{sub.notes}"
                          </p>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          educationalAudio.playClickSound();
                          onToggleSubmission(inspectingTask.id, student.id, !isDone);
                        }}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors shrink-0 ${
                          isDone
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {isDone ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Đã hoàn thành</span>
                          </>
                        ) : (
                          <span>Chưa nộp bài</span>
                        )}
                      </button>
                    </div>
                  );
                })}
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end shrink-0">
              <button
                type="button"
                onClick={() => setInspectingTask(null)}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-800 hover:bg-slate-900 rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Xác nhận xóa nhiệm vụ"
        message="Thầy có chắc chắn muốn xóa nhiệm vụ học tập này không? Toàn bộ kết quả nộp bài liên quan sẽ bị xóa theo."
        confirmText="Xóa nhiệm vụ"
        cancelText="Giữ lại"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
