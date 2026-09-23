/**
 * Các định nghĩa kiểu dữ liệu cho hệ thống
 * "TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI"
 * Phụ trách: Thầy Trần Văn Bích
 */

export type StudentStatus = 'Tích cực' | 'Đang tiến bộ' | 'Cần hỗ trợ' | 'Xuất sắc';

export interface Student {
  id: string;
  studentCode: string; // Mã học sinh, vd: BDT-10A1-01
  fullName: string;
  className: string;   // vd: 10A1, 10A2, 10A3
  status: StudentStatus;
  email?: string;
  avatarSeed?: string;
}

export type TaskStatus = 'Đang diễn ra' | 'Đã kết thúc' | 'Sắp tới';

export type CurriculumTopic = 
  | 'Chủ đề 1: Máy tính & Xã hội tri thức'
  | 'Chủ đề 2: Mạng máy tính & Internet'
  | 'Chủ đề 3: Đạo đức, pháp luật & văn hóa số'
  | 'Chủ đề 4: Ứng dụng đồ họa Inkscape'
  | 'Chủ đề 5: Lập trình Python cơ bản'
  | 'Chủ đề 6: Hướng nghiệp với Tin học';

export interface TaskItem {
  id: string;
  title: string;
  description: string;
  topic: CurriculumTopic;
  className: string; // 'Tất cả' hoặc '10A1', '10A2', '10A3'
  deadline: string;  // YYYY-MM-DD
  status: TaskStatus;
  maxScore: number;
  lessonRef?: string; // vd: Bài 16 SGK Tin học 10
}

export interface TaskSubmission {
  id: string;
  taskId: string;
  studentId: string;
  submittedAt: string;
  completed: boolean;
  notes?: string;
  fileLink?: string;
}

export interface StudentGrade {
  studentId: string;
  tx1: number | null; // Đánh giá thường xuyên 1 (Lý thuyết / Phát biểu)
  tx2: number | null; // Đánh giá thường xuyên 2 (Thực hành phòng máy)
  gk: number | null;  // Điểm Giữa kì (Hệ số 2)
  ck: number | null;  // Điểm Cuối kì (Hệ số 3)
  remarks?: string;   // Nhận xét của giáo viên
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  content: string;
  category: 'student' | 'task' | 'grade' | 'system';
}

export interface AppState {
  students: Student[];
  tasks: TaskItem[];
  submissions: TaskSubmission[];
  grades: StudentGrade[];
  activityLogs: ActivityLog[];
}
