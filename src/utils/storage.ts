/**
 * Quản lý lưu trữ cục bộ LocalStorage
 * "TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI"
 */

import { AppState, Student, TaskItem, TaskSubmission, StudentGrade, ActivityLog } from '../types';
import { INITIAL_STUDENTS, INITIAL_TASKS, INITIAL_SUBMISSIONS, INITIAL_GRADES, INITIAL_LOGS } from '../data/mockData';

const STORAGE_KEY = 'bdt_tinhoc_assistant_data_v1';

export function loadAppState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: AppState = {
        students: INITIAL_STUDENTS,
        tasks: INITIAL_TASKS,
        submissions: INITIAL_SUBMISSIONS,
        grades: INITIAL_GRADES,
        activityLogs: INITIAL_LOGS,
      };
      saveAppState(initial);
      return initial;
    }
    const parsed = JSON.parse(raw);
    return {
      students: parsed.students || INITIAL_STUDENTS,
      tasks: parsed.tasks || INITIAL_TASKS,
      submissions: parsed.submissions || INITIAL_SUBMISSIONS,
      grades: parsed.grades || INITIAL_GRADES,
      activityLogs: parsed.activityLogs || INITIAL_LOGS,
    };
  } catch (e) {
    console.error('Lỗi khi đọc dữ liệu từ LocalStorage, khởi tạo lại:', e);
    return {
      students: INITIAL_STUDENTS,
      tasks: INITIAL_TASKS,
      submissions: INITIAL_SUBMISSIONS,
      grades: INITIAL_GRADES,
      activityLogs: INITIAL_LOGS,
    };
  }
}

export function saveAppState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (e) {
    console.error('Lỗi khi lưu trữ LocalStorage:', e);
  }
}

export function resetToDefaultData(): AppState {
  const initial: AppState = {
    students: INITIAL_STUDENTS,
    tasks: INITIAL_TASKS,
    submissions: INITIAL_SUBMISSIONS,
    grades: INITIAL_GRADES,
    activityLogs: [
      {
        id: `log-${Date.now()}`,
        timestamp: 'Vừa xong',
        content: 'Đã khôi phục dữ liệu mẫu chuẩn chương trình Tin học 10 THPT Bùi Dục Tài',
        category: 'system'
      },
      ...INITIAL_LOGS
    ],
  };
  saveAppState(initial);
  return initial;
}

export function clearAllData(): AppState {
  const empty: AppState = {
    students: [],
    tasks: [],
    submissions: [],
    grades: [],
    activityLogs: [{
      id: `log-${Date.now()}`,
      timestamp: 'Vừa xong',
      content: 'Đã xóa trắng dữ liệu hệ thống',
      category: 'system'
    }],
  };
  saveAppState(empty);
  return empty;
}

// Hàm tính Điểm trung bình môn Tin học
// Cách tính phổ biến THPT: (TX1 + TX2 + GK*2 + CK*3) / số hệ số có điểm
export function calculateStudentGPA(grade?: StudentGrade): { gpa: number | null; rank: string } {
  if (!grade) return { gpa: null, rank: 'Chưa có điểm' };
  
  let totalScore = 0;
  let totalWeight = 0;

  if (grade.tx1 !== null && !isNaN(grade.tx1)) {
    totalScore += grade.tx1 * 1;
    totalWeight += 1;
  }
  if (grade.tx2 !== null && !isNaN(grade.tx2)) {
    totalScore += grade.tx2 * 1;
    totalWeight += 1;
  }
  if (grade.gk !== null && !isNaN(grade.gk)) {
    totalScore += grade.gk * 2;
    totalWeight += 2;
  }
  if (grade.ck !== null && !isNaN(grade.ck)) {
    totalScore += grade.ck * 3;
    totalWeight += 3;
  }

  if (totalWeight === 0) {
    return { gpa: null, rank: 'Chưa có điểm' };
  }

  const gpa = Math.round((totalScore / totalWeight) * 10) / 10;
  let rank = 'Cần cố gắng';
  if (gpa >= 8.0) rank = 'Giỏi';
  else if (gpa >= 6.5) rank = 'Khá';
  else if (gpa >= 5.0) rank = 'Đạt';

  return { gpa, rank };
}
