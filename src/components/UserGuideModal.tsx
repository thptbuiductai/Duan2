import React, { useState } from 'react';
import { 
  BookOpen, 
  Users, 
  CheckCircle2, 
  GraduationCap, 
  HelpCircle, 
  X, 
  Monitor, 
  Download, 
  Volume2, 
  Sparkles, 
  Check, 
  ArrowRight,
  Laptop,
  Lightbulb
} from 'lucide-react';
import { educationalAudio } from '../utils/audio';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'teacher' | 'student' | 'faq';
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'teacher',
}) => {
  const [activeTab, setActiveTab] = useState<'teacher' | 'student' | 'faq'>(defaultTab);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between pb-4 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-teal-50 text-teal-700">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Hướng dẫn Sử dụng Trợ lý Học tập Tin học
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Trường THPT Bùi Dục Tài · Giáo viên phụ trách: <span className="font-semibold text-teal-700">Trần Văn Bích</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              educationalAudio.playClickSound();
              onClose();
            }}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            title="Đóng hướng dẫn"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selectors */}
        <div className="flex items-center gap-2 pt-4 pb-3 border-b border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => {
              educationalAudio.playClickSound();
              setActiveTab('teacher');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'teacher'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>Dành cho Giáo viên (Thầy Bích)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              educationalAudio.playClickSound();
              setActiveTab('student');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'student'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Dành cho Học sinh</span>
          </button>

          <button
            type="button"
            onClick={() => {
              educationalAudio.playClickSound();
              setActiveTab('faq');
            }}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
              activeTab === 'faq'
                ? 'bg-teal-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>Thực hành phòng máy & Mẹo</span>
          </button>
        </div>

        {/* Content Container */}
        <div className="overflow-y-auto flex-1 my-4 space-y-6 pr-1 text-slate-700 text-sm">
          {/* TAB 1: GIÁO VIÊN */}
          {activeTab === 'teacher' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-teal-50/70 border border-teal-200/80">
                <h4 className="font-bold text-teal-950 text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-teal-600" />
                  <span>Tổng quan quy trình giảng dạy của Giáo viên</span>
                </h4>
                <p className="text-xs text-teal-900 mt-1 leading-relaxed">
                  Web app giúp thầy quản lý học sinh theo từng lớp (10A1, 10A2, 10A3), giao các nhiệm vụ thực hành sát chương trình SGK Tin học 10 (Python, Inkscape, Mạng...), theo dõi tỷ lệ hoàn thành theo thời gian thực và nhập điểm có nhận xét cá nhân hóa.
                </p>
              </div>

              {/* 5 Bước chi tiết */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Quản lý và Lọc danh sách học sinh</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Vào mục <strong>Học sinh</strong>: Thầy có thể bấm nút <strong>"Thêm học sinh mới"</strong> để bổ sung học sinh vào lớp. Sử dụng ô tìm kiếm để tìm nhanh theo họ tên hoặc mã học sinh, và dùng bộ lọc lớp để lọc riêng 10A1, 10A2, 10A3. Bấm biểu tượng cây bút để sửa thông tin hoặc biểu tượng thùng rác để xóa (hệ thống sẽ hỏi xác nhận an toàn trước khi xóa).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Giao nhiệm vụ & Đánh dấu nộp bài tại phòng máy</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Vào mục <strong>Nhiệm vụ</strong>: Bấm <strong>"Tạo nhiệm vụ mới"</strong>, chọn chủ đề SGK (như Chủ đề 5: Lập trình Python, Chủ đề 4: Inkscape), chọn lớp áp dụng và đặt hạn hoàn thành. Trong giờ thực hành tại phòng máy, thầy bấm nút <strong>"Danh sách nộp"</strong> trên từng nhiệm vụ để tick chọn các em đã chạy được chương trình thành công.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Theo dõi tiến độ và nắm bắt học sinh cần hỗ trợ</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Vào mục <strong>Tiến độ</strong>: Xem thanh tỷ lệ hoàn thành (%) của cả lớp và từng em. Những em có tỷ lệ dưới 50% sẽ được cảnh báo để thầy kịp thời nhắc nhở hoặc phụ đạo thêm. Bấm vào tên bất kỳ học sinh nào để xem danh sách chi tiết các bài em đã làm hoặc còn nợ.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Nhập điểm & In bảng điểm môn Tin học</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Vào mục <strong>Điểm số</strong>: Nhập điểm ĐGTX 1 (Lý thuyết), ĐGTX 2 (Thực hành máy tính), Giữa kì và Cuối kì. Hệ thống tự động tính điểm Trung bình môn theo đúng quy chế THPT và tự động phân loại xếp loại Giỏi/Khá/Đạt. Thầy có thể ghi nhận xét riêng cho từng em và bấm nút <strong>"In bảng điểm"</strong> để xuất bản in A4 nộp cho nhà trường.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-teal-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    5
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Chế độ máy chiếu & Xuất file dùng Offline</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      - Bấm nút <strong>"Máy chiếu"</strong> trên thanh trên cùng để phóng to cỡ chữ, tối ưu độ tương phản cho học sinh ngồi cuối phòng máy nhìn rõ.<br />
                      - Bấm menu <strong>"Dữ liệu" → "Xuất file HTML độc lập (Offline)"</strong> để tải về 1 file .html duy nhất. Thầy có thể copy file này vào USB và mở trên máy tính phòng máy mà không cần kết nối Internet.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: HỌC SINH */}
          {activeTab === 'student' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-cyan-50/70 border border-cyan-200/80">
                <h4 className="font-bold text-cyan-950 text-sm flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-600" />
                  <span>Hướng dẫn dành cho các em học sinh</span>
                </h4>
                <p className="text-xs text-cyan-900 mt-1 leading-relaxed">
                  Góc học tập cá nhân giúp các em xem toàn bộ các bài thực hành và bài tập về nhà môn Tin học do thầy Trần Văn Bích giao, báo cáo nộp bài sau khi làm xong và xem kết quả điểm số cùng lời dặn dò của thầy.
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    1
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Chọn danh tính của bản thân</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Trên thanh điều hướng trên cùng, ở góc bên phải dòng "Chế độ xem", chọn nút <strong>"Học sinh"</strong>. Sau đó chọn đúng <strong>Họ tên và Lớp của em</strong> trong danh sách (Ví dụ: <em>Nguyễn Văn An - 10A1</em>) để mở giao diện học tập của riêng em.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    2
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Xem các nhiệm vụ và bài thực hành được giao</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Em sẽ thấy danh sách các bài tập của lớp mình, kèm theo:
                      <br />• Tên bài và số trang tham chiếu trong SGK Tin học 10 Kết nối tri thức.
                      <br />• Hạn nộp bài và hướng dẫn yêu cầu chi tiết của thầy Trần Văn Bích.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    3
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Báo cáo nộp bài sau khi thực hành xong</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Khi đã hoàn thành bài tập (ví dụ: đã gõ xong chương trình Python trên máy hoặc vẽ xong logo trên Inkscape), em bấm nút <strong>"Nộp bài / Báo cáo hoàn thành"</strong>, điền ghi chú ngắn (ví dụ: <em>"Em đã lưu file Bai1.py trên máy số 05 phòng máy 1"</em>) và bấm xác nhận để thầy Bích kiểm tra.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 bg-white">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    4
                  </div>
                  <div>
                    <h5 className="font-semibold text-slate-900 text-sm">Xem kết quả điểm số và lời nhận xét của thầy Bích</h5>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      Ở cột bên phải, em có thể xem bảng điểm chi tiết các cột ĐGTX, Giữa kì, Cuối kì và Điểm trung bình môn. Đặc biệt, hãy đọc kỹ phần <strong>"Lời dặn dò của Thầy Trần Văn Bích"</strong> để biết những điểm cần phát huy và khắc phục trong các tiết học tiếp theo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: THỰC HÀNH PHÒNG MÁY & MẸO */}
          {activeTab === 'faq' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Laptop className="w-4 h-4 text-teal-600" />
                  <span>Dữ liệu có bị mất khi tắt máy hoặc tải lại trang (F5) không?</span>
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  <strong>Không bị mất.</strong> Mọi thông tin thêm/sửa học sinh, nhiệm vụ, tiến độ và điểm số đều được lưu trữ tự động trên <em>LocalStorage</em> của trình duyệt máy tính. Khi thầy mở lại trang web trên cùng trình duyệt, toàn bộ dữ liệu đã nhập vẫn được giữ nguyên đầy đủ.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Download className="w-4 h-4 text-teal-600" />
                  <span>Cách dùng file HTML độc lập trên máy phòng máy khi không có mạng Internet?</span>
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Thầy bấm vào <strong>"Dữ liệu" → "Xuất file HTML độc lập (Offline)"</strong>. Trình duyệt sẽ tải về file <code className="bg-slate-100 px-1 py-0.5 rounded text-teal-800 font-mono">Tro_Ly_Tin_Hoc_THPT_Bui_Duc_Tai.html</code>. Thầy chỉ cần chép file này vào USB và bấm đúp chuột mở trực tiếp bằng Google Chrome, Cốc Cốc hoặc Microsoft Edge là có thể sử dụng ngay mà không cần cài đặt thêm phần mềm nào.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Volume2 className="w-4 h-4 text-teal-600" />
                  <span>Quy định về âm thanh trong giờ học</span>
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hệ thống tích hợp âm thanh synthesizer nhẹ nhàng theo phong cách học tập thư giãn (Study Lofi). Âm thanh <strong>mặc định luôn tắt</strong> để không làm gián đoạn bài giảng. Thầy hoặc học sinh có thể bấm nút <strong>"Âm thanh: Tắt/Bật"</strong> trên thanh công cụ để bật giai điệu nhẹ nhàng khi học sinh đang tự làm bài thực hành.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-teal-600" />
                  <span>Làm sao để đưa dữ liệu về danh sách mẫu ban đầu?</span>
                </h5>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Khi cần đưa hệ thống về lại dữ liệu ban đầu gồm 12 học sinh mẫu và các bài tập SGK Tin học 10 chuẩn, thầy chỉ cần bấm <strong>"Dữ liệu" → "Khôi phục dữ liệu mẫu THPT"</strong> và bấm xác nhận.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between shrink-0">
          <span className="text-xs text-slate-400">
            Trường THPT Bùi Dục Tài · Môn Tin học
          </span>
          <button
            type="button"
            onClick={() => {
              educationalAudio.playClickSound();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg transition-colors shadow-xs"
          >
            Đã hiểu & Đóng hướng dẫn
          </button>
        </div>
      </div>
    </div>
  );
};
