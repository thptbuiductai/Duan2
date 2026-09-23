import React, { useState, useMemo } from 'react';
import { 
  GraduationCap, 
  Search, 
  Filter, 
  Edit3, 
  Printer, 
  Download, 
  X, 
  Save, 
  BarChart3,
  Award,
  CheckCircle2
} from 'lucide-react';
import { Student, StudentGrade } from '../types';
import { calculateStudentGPA } from '../utils/storage';
import { educationalAudio } from '../utils/audio';

interface GradeManagerProps {
  students: Student[];
  grades: StudentGrade[];
  onUpdateGrade: (grade: StudentGrade) => void;
  isProjectorMode: boolean;
}

export const GradeManager: React.FC<GradeManagerProps> = ({
  students,
  grades,
  onUpdateGrade,
  isProjectorMode,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('Tất cả');

  // Modal Sửa điểm
  const [editingGrade, setEditingGrade] = useState<{
    student: Student;
    grade: StudentGrade;
  } | null>(null);

  const [formData, setFormData] = useState<{
    tx1: string;
    tx2: string;
    gk: string;
    ck: string;
    remarks: string;
  }>({
    tx1: '',
    tx2: '',
    gk: '',
    ck: '',
    remarks: '',
  });

  // Class list
  const classesList = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => set.add(s.className));
    return ['Tất cả', ...Array.from(set).sort()];
  }, [students]);

  // Combined student and grade records
  const records = useMemo(() => {
    return students.map((student) => {
      const grade = grades.find((g) => g.studentId === student.id) || {
        studentId: student.id,
        tx1: null,
        tx2: null,
        gk: null,
        ck: null,
        remarks: '',
      };
      const { gpa, rank } = calculateStudentGPA(grade);
      return {
        student,
        grade,
        gpa,
        rank,
      };
    });
  }, [students, grades]);

  // Filtered records
  const filteredRecords = useMemo(() => {
    return records.filter((r) => {
      const matchSearch =
        r.student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.student.studentCode.toLowerCase().includes(searchTerm.toLowerCase());
      const matchClass = classFilter === 'Tất cả' || r.student.className === classFilter;
      return matchSearch && matchClass;
    });
  }, [records, searchTerm, classFilter]);

  // Thống kê phân phối điểm
  const distribution = useMemo(() => {
    const validGPAs = filteredRecords
      .map((r) => r.gpa)
      .filter((g): g is number => g !== null);

    const countBelow5 = validGPAs.filter((g) => g < 5.0).length;
    const count5to65 = validGPAs.filter((g) => g >= 5.0 && g < 6.5).length;
    const count65to8 = validGPAs.filter((g) => g >= 6.5 && g < 8.0).length;
    const count8to10 = validGPAs.filter((g) => g >= 8.0).length;

    const total = validGPAs.length || 1;
    const avg = validGPAs.length > 0 
      ? Math.round((validGPAs.reduce((a, b) => a + b, 0) / validGPAs.length) * 10) / 10 
      : 0;

    return {
      countBelow5,
      count5to65,
      count65to8,
      count8to10,
      totalCount: validGPAs.length,
      average: avg,
      pctBelow5: Math.round((countBelow5 / total) * 100),
      pct5to65: Math.round((count5to65 / total) * 100),
      pct65to8: Math.round((count65to8 / total) * 100),
      pct8to10: Math.round((count8to10 / total) * 100),
    };
  }, [filteredRecords]);

  const handleOpenEdit = (student: Student, grade: StudentGrade) => {
    setEditingGrade({ student, grade });
    setFormData({
      tx1: grade.tx1 !== null ? grade.tx1.toString() : '',
      tx2: grade.tx2 !== null ? grade.tx2.toString() : '',
      gk: grade.gk !== null ? grade.gk.toString() : '',
      ck: grade.ck !== null ? grade.ck.toString() : '',
      remarks: grade.remarks || '',
    });
    educationalAudio.playClickSound();
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingGrade) return;

    const parseNum = (val: string) => {
      const trimmed = val.trim();
      if (!trimmed) return null;
      const num = parseFloat(trimmed);
      return isNaN(num) ? null : Math.max(0, Math.min(10, num));
    };

    const updated: StudentGrade = {
      studentId: editingGrade.student.id,
      tx1: parseNum(formData.tx1),
      tx2: parseNum(formData.tx2),
      gk: parseNum(formData.gk),
      ck: parseNum(formData.ck),
      remarks: formData.remarks.trim(),
    };

    onUpdateGrade(updated);
    educationalAudio.playSuccessSound();
    setEditingGrade(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`space-y-6 ${isProjectorMode ? 'text-base' : ''}`}>
      {/* Header bar */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-teal-600" />
            <span>Điểm & Kết quả Học tập Môn Tin học</span>
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Quy chế tính điểm THPT: ĐGTX (hệ số 1), Giữa kì (hệ số 2), Cuối kì (hệ số 3)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4 text-slate-500" />
            <span>In bảng điểm</span>
          </button>
        </div>
      </div>

      {/* Biểu đồ phân bổ điểm số đơn giản & trực quan */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-teal-600" />
              <span>Biểu đồ Phân phối Phổ điểm</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Phạm vi: {classFilter !== 'Tất cả' ? `Lớp ${classFilter}` : 'Toàn khối 10'} · Điểm TB: <strong className="text-teal-700 tabular-nums">{distribution.average}</strong>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Lọc lớp:</span>
            <select
              value={classFilter}
              onChange={(e) => setClassFilter(e.target.value)}
              className="px-2.5 py-1 text-xs border border-slate-200 rounded-lg bg-slate-50 font-semibold text-slate-800"
            >
              {classesList.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>

        {/* 4 Cột phân phối */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-semibold text-emerald-700">Giỏi (8.0 - 10)</span>
              <span className="tabular-nums font-bold text-slate-900">{distribution.count8to10} HS</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-emerald-600 h-2 rounded-full" style={{ width: `${distribution.pct8to10}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 mt-1 tabular-nums">{distribution.pct8to10}% tổng số</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-semibold text-cyan-700">Khá (6.5 - 7.9)</span>
              <span className="tabular-nums font-bold text-slate-900">{distribution.count65to8} HS</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-cyan-600 h-2 rounded-full" style={{ width: `${distribution.pct65to8}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 mt-1 tabular-nums">{distribution.pct65to8}% tổng số</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-semibold text-amber-700">Đạt (5.0 - 6.4)</span>
              <span className="tabular-nums font-bold text-slate-900">{distribution.count5to65} HS</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${distribution.pct5to65}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 mt-1 tabular-nums">{distribution.pct5to65}% tổng số</div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
            <div className="flex items-center justify-between text-xs text-slate-600 mb-1">
              <span className="font-semibold text-rose-700">Chưa đạt (&lt; 5.0)</span>
              <span className="tabular-nums font-bold text-slate-900">{distribution.countBelow5} HS</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
              <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${distribution.pctBelow5}%` }} />
            </div>
            <div className="text-[11px] text-slate-400 mt-1 tabular-nums">{distribution.pctBelow5}% tổng số</div>
          </div>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Tìm học sinh để nhập hoặc sửa điểm..."
          className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
        />
      </div>

      {/* Bảng điểm chi tiết */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-12 text-center">STT</th>
                <th className="py-3 px-4">Mã HS</th>
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Lớp</th>
                <th className="py-3 px-3 text-center">ĐGTX 1</th>
                <th className="py-3 px-3 text-center">ĐGTX 2 (Máy)</th>
                <th className="py-3 px-3 text-center">Giữa kì</th>
                <th className="py-3 px-3 text-center">Cuối kì</th>
                <th className="py-3 px-3 text-center bg-teal-50/60 text-teal-900">Điểm TB</th>
                <th className="py-3 px-3 text-center">Xếp loại</th>
                <th className="py-3 px-4">Nhận xét của GV Trần Văn Bích</th>
                <th className="py-3 px-3 text-right print:hidden">Nhập điểm</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredRecords.map((r, idx) => {
                const { student, grade, gpa, rank } = r;
                return (
                  <tr key={student.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-center text-xs text-slate-500 font-mono tabular-nums">
                      {idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-slate-700">
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
                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">
                      {grade.tx1 !== null ? grade.tx1 : '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">
                      {grade.tx2 !== null ? grade.tx2 : '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">
                      {grade.gk !== null ? grade.gk : '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono tabular-nums text-slate-700">
                      {grade.ck !== null ? grade.ck : '—'}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-teal-700 bg-teal-50/40 tabular-nums">
                      {gpa !== null ? gpa : '—'}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {rank === 'Giỏi' && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Giỏi
                        </span>
                      )}
                      {rank === 'Khá' && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-cyan-50 text-cyan-700 border border-cyan-200">
                          Khá
                        </span>
                      )}
                      {rank === 'Đạt' && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-amber-50 text-amber-700 border border-amber-200">
                          Đạt
                        </span>
                      )}
                      {rank === 'Cần cố gắng' && (
                        <span className="px-2 py-0.5 text-xs font-semibold rounded bg-rose-50 text-rose-700 border border-rose-200">
                          Cần cố gắng
                        </span>
                      )}
                      {rank === 'Chưa có điểm' && (
                        <span className="text-xs text-slate-400">Chưa xét</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-xs text-slate-600 max-w-xs truncate">
                      {grade.remarks || <span className="text-slate-400 italic">Chưa có nhận xét</span>}
                    </td>
                    <td className="py-3 px-3 text-right print:hidden">
                      <button
                        type="button"
                        onClick={() => handleOpenEdit(student, grade)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-teal-700 hover:text-teal-900 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Sửa</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Nhập & Sửa Điểm */}
      {editingGrade && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cập nhật điểm học sinh
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {editingGrade.student.fullName} ({editingGrade.student.studentCode}) · Lớp {editingGrade.student.className}
                </p>
              </div>
              <button
                onClick={() => setEditingGrade(null)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveGrade} className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ĐGTX 1 (Lý thuyết / Thảo luận)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.tx1}
                    onChange={(e) => setFormData({ ...formData, tx1: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    ĐGTX 2 (Thực hành máy tính)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.tx2}
                    onChange={(e) => setFormData({ ...formData, tx2: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kiểm tra Giữa kì (Hệ số 2)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.gk}
                    onChange={(e) => setFormData({ ...formData, gk: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kiểm tra Cuối kì (Hệ số 3)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={formData.ck}
                    onChange={(e) => setFormData({ ...formData, ck: e.target.value })}
                    placeholder="0 - 10"
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nhận xét & Dặn dò của Thầy Trần Văn Bích
                </label>
                <textarea
                  rows={3}
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  placeholder="Ghi nhận sự tiến bộ hoặc nhắc nhở em rèn luyện thêm bài tập..."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingGrade(null)}
                  className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg transition-colors shadow-xs flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>Lưu điểm số</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
