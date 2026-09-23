/**
 * Dữ liệu mẫu môn Tin học 10 - Trường THPT Bùi Dục Tài
 * Giáo viên phụ trách: Trần Văn Bích
 * Giáo trình: Tin học 10 - Kết nối tri thức với cuộc sống
 */

import { Student, TaskItem, TaskSubmission, StudentGrade, ActivityLog } from '../types';

export const INITIAL_STUDENTS: Student[] = [
  { id: 'hs-1', studentCode: 'BDT-10A1-01', fullName: 'Nguyễn Văn An', className: '10A1', status: 'Xuất sắc', email: 'an.nguyen@thptbuiductai.edu.vn' },
  { id: 'hs-2', studentCode: 'BDT-10A1-02', fullName: 'Trần Thị Mai Hương', className: '10A1', status: 'Tích cực', email: 'huong.tran@thptbuiductai.edu.vn' },
  { id: 'hs-3', studentCode: 'BDT-10A1-03', fullName: 'Lê Hoàng Long', className: '10A1', status: 'Đang tiến bộ', email: 'long.le@thptbuiductai.edu.vn' },
  { id: 'hs-4', studentCode: 'BDT-10A1-04', fullName: 'Phạm Minh Quân', className: '10A1', status: 'Cần hỗ trợ', email: 'quan.pham@thptbuiductai.edu.vn' },
  { id: 'hs-5', studentCode: 'BDT-10A1-05', fullName: 'Đỗ Thị Cẩm Ly', className: '10A1', status: 'Tích cực', email: 'ly.do@thptbuiductai.edu.vn' },
  
  { id: 'hs-6', studentCode: 'BDT-10A2-01', fullName: 'Bùi Đức Trí', className: '10A2', status: 'Xuất sắc', email: 'tri.bui@thptbuiductai.edu.vn' },
  { id: 'hs-7', studentCode: 'BDT-10A2-02', fullName: 'Võ Thị Ánh Tuyết', className: '10A2', status: 'Tích cực', email: 'tuyet.vo@thptbuiductai.edu.vn' },
  { id: 'hs-8', studentCode: 'BDT-10A2-03', fullName: 'Hoàng Quốc Việt', className: '10A2', status: 'Đang tiến bộ', email: 'viet.hoang@thptbuiductai.edu.vn' },
  { id: 'hs-9', studentCode: 'BDT-10A2-04', fullName: 'Đặng Ngọc Thạch', className: '10A2', status: 'Cần hỗ trợ', email: 'thach.dang@thptbuiductai.edu.vn' },
  
  { id: 'hs-10', studentCode: 'BDT-10A3-01', fullName: 'Phan Thanh Tùng', className: '10A3', status: 'Tích cực', email: 'tung.phan@thptbuiductai.edu.vn' },
  { id: 'hs-11', studentCode: 'BDT-10A3-02', fullName: 'Lâm Khánh Chi', className: '10A3', status: 'Xuất sắc', email: 'chi.lam@thptbuiductai.edu.vn' },
  { id: 'hs-12', studentCode: 'BDT-10A3-03', fullName: 'Ngô Hải Đăng', className: '10A3', status: 'Đang tiến bộ', email: 'dang.ngo@thptbuiductai.edu.vn' },
];

export const INITIAL_TASKS: TaskItem[] = [
  {
    id: 'task-1',
    title: 'Thực hành Bài 16: Cài đặt Python và chạy câu lệnh đầu tiên',
    description: 'Khởi động môi trường Python IDLE, viết chương trình Bai1.py in ra thông điệp chào mừng và thực hiện các phép toán cộng trừ nhân chia đơn giản.',
    topic: 'Chủ đề 5: Lập trình Python cơ bản',
    className: 'Tất cả',
    deadline: '2026-09-28',
    status: 'Đang diễn ra',
    maxScore: 10,
    lessonRef: 'Bài 16 - Trang 86 SGK'
  },
  {
    id: 'task-2',
    title: 'Thực hành Bài 13: Thiết kế Quốc kì Việt Nam bằng Inkscape',
    description: 'Sử dụng công cụ hình chữ nhật, ngôi sao 5 cánh (Spoke ratio 0.4), phối màu vàng và đỏ cờ, sắp xếp thứ tự lớp đối tượng (Layer) chính xác.',
    topic: 'Chủ đề 4: Ứng dụng đồ họa Inkscape',
    className: '10A1',
    deadline: '2026-09-25',
    status: 'Đang diễn ra',
    maxScore: 10,
    lessonRef: 'Bài 13 - Trang 68 SGK'
  },
  {
    id: 'task-3',
    title: 'Thực hành Bài 19: Viết chương trình rẽ nhánh tính tiền điện',
    description: 'Sử dụng câu lệnh if-else và hàm round() để tính hóa đơn tiền điện sinh hoạt theo bậc thang lũy kế như bài tập vận dụng mục 2.',
    topic: 'Chủ đề 5: Lập trình Python cơ bản',
    className: '10A1',
    deadline: '2026-10-05',
    status: 'Đang diễn ra',
    maxScore: 10,
    lessonRef: 'Bài 19 - Trang 104 SGK'
  },
  {
    id: 'task-4',
    title: 'Bài tập Bài 4: Chuyển đổi số nguyên sang hệ nhị phân',
    description: 'Thực hiện chuyển đổi các số tự nhiên 19, 76, 155 sang hệ nhị phân theo thuật toán chia lấy dư 2 và giải thích biểu diễn bù 2.',
    topic: 'Chủ đề 1: Máy tính & Xã hội tri thức',
    className: 'Tất cả',
    deadline: '2026-09-18',
    status: 'Đã kết thúc',
    maxScore: 10,
    lessonRef: 'Bài 4 - Trang 21 SGK'
  },
  {
    id: 'task-5',
    title: 'Thực hành Bài 20: Vòng lặp for và in danh sách ước số',
    description: 'Viết chương trình nhập số tự nhiên n từ bàn phím, sử dụng vòng lặp for i in range(1, n+1) để tìm và in toàn bộ ước số của n.',
    topic: 'Chủ đề 5: Lập trình Python cơ bản',
    className: '10A2',
    deadline: '2026-10-10',
    status: 'Sắp tới',
    maxScore: 10,
    lessonRef: 'Bài 20 - Trang 107 SGK'
  },
  {
    id: 'task-6',
    title: 'Thảo luận Bài 9: Nhận diện mã độc và phòng chống lừa đảo mạng',
    description: 'Viết báo cáo ngắn phân biệt virus, sâu máy tính (worm), trojan; nêu 3 biện pháp bảo vệ tài khoản mạng xã hội cá nhân.',
    topic: 'Chủ đề 3: Đạo đức, pháp luật & văn hóa số',
    className: '10A3',
    deadline: '2026-09-30',
    status: 'Đang diễn ra',
    maxScore: 10,
    lessonRef: 'Bài 9 - Trang 46 SGK'
  }
];

export const INITIAL_SUBMISSIONS: TaskSubmission[] = [
  // Task 1: Bai 16 Python (all classes)
  { id: 'sub-1', taskId: 'task-1', studentId: 'hs-1', submittedAt: '2026-09-21 14:30', completed: true, notes: 'Đã nộp file Bai1.py và chụp màn hình IDLE' },
  { id: 'sub-2', taskId: 'task-1', studentId: 'hs-2', submittedAt: '2026-09-21 15:10', completed: true, notes: 'Đã hoàn thành các phép toán' },
  { id: 'sub-3', taskId: 'task-1', studentId: 'hs-3', submittedAt: '2026-09-22 09:00', completed: true, notes: 'Đã chạy thử tốt trên phòng máy' },
  { id: 'sub-4', taskId: 'task-1', studentId: 'hs-4', submittedAt: '', completed: false, notes: '' },
  { id: 'sub-5', taskId: 'task-1', studentId: 'hs-5', submittedAt: '2026-09-22 10:20', completed: true, notes: 'Đầy đủ bài thực hành' },
  { id: 'sub-6', taskId: 'task-1', studentId: 'hs-6', submittedAt: '2026-09-21 16:45', completed: true, notes: 'Hoàn thành bài tập nâng cao' },
  { id: 'sub-7', taskId: 'task-1', studentId: 'hs-7', submittedAt: '2026-09-22 08:30', completed: true, notes: 'Đã kiểm tra kết quả' },
  { id: 'sub-8', taskId: 'task-1', studentId: 'hs-8', submittedAt: '', completed: false, notes: '' },
  { id: 'sub-9', taskId: 'task-1', studentId: 'hs-10', submittedAt: '2026-09-21 17:00', completed: true, notes: 'Đã nộp bài tập' },
  { id: 'sub-10', taskId: 'task-1', studentId: 'hs-11', submittedAt: '2026-09-21 14:15', completed: true, notes: 'Bài làm xuất sắc' },

  // Task 2: Inkscape (10A1)
  { id: 'sub-11', taskId: 'task-2', studentId: 'hs-1', submittedAt: '2026-09-20 16:00', completed: true, notes: 'File vector .svg đã nộp đúng kích thước' },
  { id: 'sub-12', taskId: 'task-2', studentId: 'hs-2', submittedAt: '2026-09-21 11:30', completed: true, notes: 'Ngôi sao chuẩn tỷ lệ 0.4' },
  { id: 'sub-13', taskId: 'task-2', studentId: 'hs-3', submittedAt: '', completed: false, notes: 'Chưa căn chỉnh giữa cờ' },
  { id: 'sub-14', taskId: 'task-2', studentId: 'hs-4', submittedAt: '', completed: false, notes: '' },
  { id: 'sub-15', taskId: 'task-2', studentId: 'hs-5', submittedAt: '2026-09-22 11:00', completed: true, notes: 'Màu cờ chuẩn' },

  // Task 4: Nhi phan (ended)
  { id: 'sub-16', taskId: 'task-4', studentId: 'hs-1', submittedAt: '2026-09-17 08:30', completed: true, notes: 'Đúng 100% các phép tính' },
  { id: 'sub-17', taskId: 'task-4', studentId: 'hs-2', submittedAt: '2026-09-17 09:15', completed: true, notes: 'Trình bày sạch đẹp' },
  { id: 'sub-18', taskId: 'task-4', studentId: 'hs-3', submittedAt: '2026-09-17 10:00', completed: true, notes: 'Có sai sót câu bù 2 nhưng đã sửa' },
  { id: 'sub-19', taskId: 'task-4', studentId: 'hs-4', submittedAt: '2026-09-18 13:00', completed: true, notes: 'Nộp muộn nửa ngày' },
  { id: 'sub-20', taskId: 'task-4', studentId: 'hs-5', submittedAt: '2026-09-17 14:20', completed: true, notes: 'Đầy đủ' },
  { id: 'sub-21', taskId: 'task-4', studentId: 'hs-6', submittedAt: '2026-09-17 08:00', completed: true, notes: 'Chính xác hoàn toàn' },
  { id: 'sub-22', taskId: 'task-4', studentId: 'hs-7', submittedAt: '2026-09-17 11:00', completed: true, notes: 'Tốt' },
  { id: 'sub-23', taskId: 'task-4', studentId: 'hs-8', submittedAt: '2026-09-18 16:00', completed: true, notes: 'Đạt yêu cầu' },
  { id: 'sub-24', taskId: 'task-4', studentId: 'hs-9', submittedAt: '', completed: false, notes: 'Vắng tiết luyện tập' },
  { id: 'sub-25', taskId: 'task-4', studentId: 'hs-10', submittedAt: '2026-09-17 15:40', completed: true, notes: 'Tốt' },
  { id: 'sub-26', taskId: 'task-4', studentId: 'hs-11', submittedAt: '2026-09-17 08:45', completed: true, notes: 'Hoàn thành xuất sắc' },
  { id: 'sub-27', taskId: 'task-4', studentId: 'hs-12', submittedAt: '2026-09-18 09:30', completed: true, notes: 'Đã hoàn thành' },
];

export const INITIAL_GRADES: StudentGrade[] = [
  { studentId: 'hs-1', tx1: 9.5, tx2: 10.0, gk: 9.0, ck: null, remarks: 'Nắm vững cú pháp Python, tư duy thuật toán rất nhanh nhạy' },
  { studentId: 'hs-2', tx1: 8.5, tx2: 9.0, gk: 8.5, ck: null, remarks: 'Thao tác Inkscape khéo léo, chăm chỉ trong giờ thực hành' },
  { studentId: 'hs-3', tx1: 7.0, tx2: 7.5, gk: 7.0, ck: null, remarks: 'Cần chú ý thụt dòng (indentation) khi viết lệnh rẽ nhánh if' },
  { studentId: 'hs-4', tx1: 5.5, tx2: 6.0, gk: 5.0, ck: null, remarks: 'Cần rèn luyện thêm kỹ năng gõ code tại phòng máy' },
  { studentId: 'hs-5', tx1: 8.0, tx2: 8.5, gk: 8.0, ck: null, remarks: 'Tham gia phát biểu xây dựng bài sôi nổi' },

  { studentId: 'hs-6', tx1: 10.0, tx2: 9.5, gk: 9.5, ck: null, remarks: 'Có năng khiếu lập trình, hoàn thành bài tập nâng cao' },
  { studentId: 'hs-7', tx1: 8.0, tx2: 8.5, gk: 8.0, ck: null, remarks: 'Thực hành đều tay, bài tập về nhà nộp đúng hạn' },
  { studentId: 'hs-8', tx1: 6.5, tx2: 7.0, gk: 6.5, ck: null, remarks: 'Có tiến bộ rõ rệt so với đầu năm học' },
  { studentId: 'hs-9', tx1: 5.0, tx2: 5.5, gk: 5.0, ck: null, remarks: 'Cần thầy hướng dẫn thêm về hệ nhị phân và biến Python' },

  { studentId: 'hs-10', tx1: 8.0, tx2: 8.0, gk: 7.5, ck: null, remarks: 'Thực hành nghiêm túc, hiểu rõ khái niệm' },
  { studentId: 'hs-11', tx1: 9.5, tx2: 9.5, gk: 9.0, ck: null, remarks: 'Học sinh giỏi toàn diện, hỗ trợ bạn bè nhiệt tình' },
  { studentId: 'hs-12', tx1: 7.0, tx2: 7.5, gk: 7.0, ck: null, remarks: 'Chăm chỉ, làm bài tập đầy đủ' },
];

export const INITIAL_LOGS: ActivityLog[] = [
  { id: 'log-1', timestamp: 'Hôm nay lúc 15:40', content: 'Thầy Trần Văn Bích đã giao nhiệm vụ mới: Thực hành Bài 20 Vòng lặp for (10A2)', category: 'task' },
  { id: 'log-2', timestamp: 'Hôm nay lúc 14:20', content: 'Học sinh Đỗ Thị Cẩm Ly (10A1) đã nộp bài: Thực hành Bài 16 Python', category: 'student' },
  { id: 'log-3', timestamp: 'Hôm qua lúc 16:30', content: 'Cập nhật điểm đánh giá thường xuyên môn Tin học lớp 10A1', category: 'grade' },
  { id: 'log-4', timestamp: '20/09 lúc 09:15', content: 'Tạo danh sách lớp 10A1, 10A2, 10A3 năm học 2026 - 2027', category: 'system' },
];
