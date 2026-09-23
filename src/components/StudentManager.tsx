import React, { useState, useMemo } from 'react';
import { 
  Users, 
  Search, 
  UserPlus, 
  Edit3, 
  Trash2, 
  Filter, 
  X,
  Mail,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Student, StudentStatus } from '../types';
import { ConfirmModal } from './ConfirmModal';
import { educationalAudio } from '../utils/audio';

interface StudentManagerProps {
  students: Student[];
  onAddStudent: (student: Omit<Student, 'id'>) => void;
  onUpdateStudent: (student: Student) => void;
  onDeleteStudent: (id: string) => void;
  isProjectorMode: boolean;
  initialAddModalOpen?: boolean;
  onCloseInitialAddModal?: () => void;
}

export const StudentManager: React.FC<StudentManagerProps> = ({
  students,
  onAddStudent,
  onUpdateStudent,
  onDeleteStudent,
  isProjectorMode,
  initialAddModalOpen = false,
  onCloseInitialAddModal,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState<string>('Tất cả');
  const [statusFilter, setStatusFilter] = useState<string>('Tất cả');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(initialAddModalOpen);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  // Form State
  const [formData, setFormData] = useState<{
    studentCode: string;
    fullName: string;
    className: string;
    status: StudentStatus;
    email: string;
  }>({
    studentCode: '',
    fullName: '',
    className: '10A1',
    status: 'Tích cực',
    email: '',
  });

  // Delete Confirm State
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Sync if opened from parent
  React.useEffect(() => {
    if (initialAddModalOpen) {
      handleOpenCreate();
      if (onCloseInitialAddModal) onCloseInitialAddModal();
    }
  }, [initialAddModalOpen]);

  // Unique classes list
  const classesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.className));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Filtered Students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      const matchSearch =
        s.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = classFilter === 'Tất cả' || s.className === classFilter;
      const matchStatus = statusFilter === 'Tất cả' || s.status === statusFilter;
      return matchSearch && matchClass && matchStatus;
    });
  }, [students, searchTerm, classFilter, statusFilter]);

  const handleOpenCreate = () => {
    // Generate next student code based on count
    const nextNum = students.length + 1;
    const pad = nextNum < 10 ? `0${nextNum}` : `${nextNum}`;
    setEditingStudent(null);
    setFormData({
      studentCode: `BDT-10A1-${pad}`,
      fullName: '',
      className: classFilter !== 'Tất cả' ? classFilter : '10A1',
      status: 'Tích cực',
      email: '',
    });
    setIsModalOpen(true);
    educationalAudio.playClickSound();
  };

  const handleOpenEdit = (student: Student) => {
    setEditingStudent(student);
    setFormData({
      studentCode: student.studentCode,
      fullName: student.fullName,
      className: student.className,
      status: student.status,
      email: student.email || '',
    });
    setIsModalOpen(true);
    educationalAudio.playClickSound();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.studentCode.trim()) return;

    if (editingStudent) {
      onUpdateStudent({
        ...editingStudent,
        ...formData,
      });
    } else {
      onAddStudent(formData);
    }

    educationalAudio.playSuccessSound();
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deletingId) {
      onDeleteStudent(deletingId);
      educationalAudio.playSuccessSound();
      setDeletingId(null);
    }
  };

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'text-base' : ''}`}>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-teal-600" />
            <span>Quản lý Danh sách Học sinh</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Tổng cộng: <strong className="text-slate-800 tabular-nums">{students.length}</strong> học sinh môn Tin học · Phụ trách: GV Trần Văn Bích
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors shadow-xs"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm học sinh mới</span>
        </button>
      </div>

      {/* Tìm kiếm và Bộ lọc */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Tìm kiếm */}
        <div className="relative sm:col-span-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo họ tên hoặc mã HS..."
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

        {/* Lọc theo lớp */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-lg">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="text-xs font-medium text-slate-500 shrink-0">Lớp:</span>
          <select
            value={classFilter}
            onChange={(e) => setClassFilter(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 font-medium focus:outline-hidden"
          >
            {classesList.map((cls) => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>

        {/* Lọc theo trạng thái */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 border border-slate-200 rounded-lg">
          <span className="text-xs font-medium text-slate-500 shrink-0">Trạng thái:</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-800 font-medium focus:outline-hidden"
          >
            <option value="Tất cả">Tất cả trạng thái</option>
            <option value="Xuất sắc">Xuất sắc</option>
            <option value="Tích cực">Tích cực</option>
            <option value="Đang tiến bộ">Đang tiến bộ</option>
            <option value="Cần hỗ trợ">Cần hỗ trợ</option>
          </select>
        </div>
      </div>

      {/* Bảng danh sách học sinh */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="text-center py-12 px-4">
            <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-700">Không tìm thấy học sinh nào</p>
            <p className="text-xs text-slate-500 mt-1">Hãy thử xóa bộ lọc tìm kiếm hoặc thêm học sinh mới.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                  <th className="py-3 px-4 w-12 text-center">STT</th>
                  <th className="py-3 px-4">Mã học sinh</th>
                  <th className="py-3 px-4">Họ và tên</th>
                  <th className="py-3 px-4">Lớp</th>
                  <th className="py-3 px-4">Trạng thái học tập</th>
                  <th className="py-3 px-4">Email liên hệ</th>
                  <th className="py-3 px-4 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {filteredStudents.map((student, index) => {
                  return (
                    <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 text-center text-xs text-slate-500 font-mono tabular-nums">
                        {index + 1}
                      </td>
                      <td className="py-3 px-4 font-mono text-xs font-medium text-slate-700">
                        {student.studentCode}
                      </td>
                      <td className="py-3 px-4 font-semibold text-slate-900">
                        {student.fullName}
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-teal-800 bg-teal-50 px-2 py-0.5 rounded text-xs">
                          {student.className}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {student.status === 'Xuất sắc' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            Xuất sắc
                          </span>
                        )}
                        {student.status === 'Tích cực' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-teal-700">
                            <span className="w-2 h-2 rounded-full bg-teal-500" />
                            Tích cực
                          </span>
                        )}
                        {student.status === 'Đang tiến bộ' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-700">
                            <span className="w-2 h-2 rounded-full bg-blue-500" />
                            Đang tiến bộ
                          </span>
                        )}
                        {student.status === 'Cần hỗ trợ' && (
                          <span className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-700">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Cần hỗ trợ
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-500 font-mono">
                        {student.email || '—'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 text-slate-500 hover:text-teal-700 hover:bg-slate-100 rounded-md transition-colors"
                            title="Sửa thông tin học sinh"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              educationalAudio.playClickSound();
                              setDeletingId(student.id);
                            }}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                            title="Xóa học sinh"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Thêm / Sửa học sinh */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                {editingStudent ? 'Chỉnh sửa thông tin học sinh' : 'Thêm học sinh mới'}
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
                  Mã học sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.studentCode}
                  onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
                  placeholder="Ví dụ: BDT-10A1-01"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên học sinh <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Ví dụ: Nguyễn Văn An"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Lớp <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.className}
                    onChange={(e) => setFormData({ ...formData, className: e.target.value.toUpperCase() })}
                    placeholder="Ví dụ: 10A1"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Trạng thái học tập
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as StudentStatus })}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="Xuất sắc">Xuất sắc</option>
                    <option value="Tích cực">Tích cực</option>
                    <option value="Đang tiến bộ">Đang tiến bộ</option>
                    <option value="Cần hỗ trợ">Cần hỗ trợ</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email học sinh (không bắt buộc)
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="an.nguyen@thptbuiductai.edu.vn"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
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
                  {editingStudent ? 'Lưu thay đổi' : 'Thêm học sinh'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Dialog for Delete */}
      <ConfirmModal
        isOpen={!!deletingId}
        title="Xác nhận xóa học sinh"
        message="Thầy có chắc chắn muốn xóa học sinh này khỏi danh sách lớp không? Dữ liệu nộp bài và điểm số của em cũng sẽ được xóa."
        confirmText="Xóa học sinh"
        cancelText="Giữ lại"
        isDanger={true}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
};
