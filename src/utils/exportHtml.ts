/**
 * Xuất toàn bộ web app thành 1 file HTML độc lập duy nhất
 * Giáo viên có thể lưu file .html này và mở trực tiếp trên mọi máy tính không cần internet hay máy chủ
 */

import { AppState } from '../types';

export function exportStandaloneHtml(state: AppState): void {
  const jsonState = JSON.stringify(state, null, 2);

  const htmlContent = `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI - GV: Trần Văn Bích</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif; }
    .tab-btn.active { background-color: #f0fdfa; color: #115e59; font-weight: 600; }
  </style>
</head>
<body class="bg-slate-50 text-slate-900 min-h-screen flex flex-col">
  <!-- Top bar -->
  <header class="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
    <div class="bg-slate-900 text-slate-200 text-xs py-1.5 px-4 sm:px-6">
      <div class="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div class="flex items-center gap-2">
          <span class="font-semibold text-teal-400">TRƯỜNG THPT BÙI DỤC TÀI</span>
          <span>·</span>
          <span>Môn: <strong>Tin học THPT</strong></span>
          <span>·</span>
          <span>GV phụ trách: <strong class="text-teal-300">Trần Văn Bích</strong></span>
        </div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400">Chế độ:</span>
          <button id="btnRoleTeacher" onclick="switchRole('teacher')" class="px-2 py-0.5 rounded text-xs font-semibold bg-teal-600 text-white">Giáo viên</button>
          <button id="btnRoleStudent" onclick="switchRole('student')" class="px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300">Học sinh</button>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
      <div class="flex items-center gap-2.5">
        <div class="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white font-bold">
          BDT
        </div>
        <h1 class="text-base sm:text-lg font-bold text-slate-900">TRỢ LÝ TIN HỌC THPT BÙI DỤC TÀI</h1>
      </div>

      <div class="flex items-center gap-2">
        <nav id="navTabs" class="flex items-center gap-1 overflow-x-auto">
          <button onclick="setTab('dashboard')" class="tab-btn active px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900" data-tab="dashboard">Dashboard</button>
          <button onclick="setTab('students')" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900" data-tab="students">Học sinh</button>
          <button onclick="setTab('tasks')" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900" data-tab="tasks">Nhiệm vụ</button>
          <button onclick="setTab('progress')" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900" data-tab="progress">Tiến độ</button>
          <button onclick="setTab('grades')" class="tab-btn px-3 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900" data-tab="grades">Điểm số</button>
        </nav>
        <button onclick="openGuideModal()" class="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-teal-50 text-teal-800 border border-teal-200 hover:bg-teal-100 flex items-center gap-1">
          📖 Hướng dẫn
        </button>
      </div>
    </div>
  </header>

  <!-- Modal Hướng dẫn sử dụng Offline -->
  <div id="guideModal" style="display:none;" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
    <div class="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 max-h-[85vh] overflow-y-auto">
      <div class="flex justify-between items-center pb-3 border-b border-slate-100">
        <h3 class="font-bold text-slate-900 text-base">Hướng dẫn Sử dụng Trợ lý Học tập Tin học</h3>
        <button onclick="closeGuideModal()" class="text-slate-400 hover:text-slate-600 p-1">✕</button>
      </div>
      <div class="py-4 space-y-4 text-xs text-slate-700 leading-relaxed">
        <div class="p-3 bg-teal-50 rounded-xl border border-teal-200">
          <strong class="text-teal-900 text-sm">1. Dành cho Giáo viên (Thầy Trần Văn Bích):</strong>
          <ul class="list-disc list-inside mt-1 space-y-1 text-teal-950">
            <li>Quản lý danh sách học sinh theo từng lớp (10A1, 10A2, 10A3).</li>
            <li>Giao nhiệm vụ thực hành (Python, Inkscape, Mạng) và theo dõi tiến độ nộp bài.</li>
            <li>Nhập điểm ĐGTX 1, ĐGTX 2, Giữa kì, Cuối kì, hệ thống tự động tính điểm TB môn.</li>
          </ul>
        </div>
        <div class="p-3 bg-cyan-50 rounded-xl border border-cyan-200">
          <strong class="text-cyan-900 text-sm">2. Dành cho Học sinh:</strong>
          <ul class="list-disc list-inside mt-1 space-y-1 text-cyan-950">
            <li>Bấm nút "Học sinh" ở góc trên bên phải thanh tiêu đề để chuyển giao diện.</li>
            <li>Chọn đúng tên của em để xem bài tập thầy Bích giao và điểm số cá nhân.</li>
            <li>Bấm hoàn thành sau khi thực hành xong tại phòng máy.</li>
          </ul>
        </div>
        <div class="p-3 bg-slate-50 rounded-xl border border-slate-200">
          <strong class="text-slate-900 text-sm">3. Lưu trữ & Mở file:</strong>
          <p class="mt-1 text-slate-600">File HTML này hoạt động độc lập không cần Internet. Thầy có thể lưu trên máy hoặc USB để sử dụng lâu dài.</p>
        </div>
      </div>
      <div class="pt-3 border-t border-slate-100 text-right">
        <button onclick="closeGuideModal()" class="px-4 py-1.5 bg-teal-700 text-white rounded-lg text-xs font-semibold">Đã hiểu</button>
      </div>
    </div>
  </div>

  <!-- Main View Container -->
  <main class="max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 flex-1" id="mainContainer">
    <!-- Rendered by JS below -->
  </main>

  <footer class="bg-white border-t border-slate-200 py-4 text-center text-xs text-slate-400">
    © Trường THPT Bùi Dục Tài · Giáo viên Trần Văn Bích · Môn Tin học THPT
  </footer>

  <script>
    // Dữ liệu nhúng trực tiếp
    let appData = ${jsonState};
    let currentRole = 'teacher';
    let currentTab = 'dashboard';
    let selectedStudentId = appData.students.length > 0 ? appData.students[0].id : null;

    function save() {
      try {
        localStorage.setItem('bdt_offline_data', JSON.stringify(appData));
      } catch (e) {}
    }

    function openGuideModal() {
      document.getElementById('guideModal').style.display = 'flex';
    }

    function closeGuideModal() {
      document.getElementById('guideModal').style.display = 'none';
    }

    function switchRole(role) {
      currentRole = role;
      document.getElementById('btnRoleTeacher').className = role === 'teacher' ? 'px-2 py-0.5 rounded text-xs font-semibold bg-teal-600 text-white' : 'px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300';
      document.getElementById('btnRoleStudent').className = role === 'student' ? 'px-2 py-0.5 rounded text-xs font-semibold bg-teal-600 text-white' : 'px-2 py-0.5 rounded text-xs font-semibold bg-slate-800 text-slate-300';
      document.getElementById('navTabs').style.display = role === 'teacher' ? 'flex' : 'none';
      render();
    }

    function setTab(tab) {
      currentTab = tab;
      document.querySelectorAll('.tab-btn').forEach(btn => {
        if (btn.getAttribute('data-tab') === tab) {
          btn.classList.add('active');
        } else {
          btn.classList.remove('active');
        }
      });
      render();
    }

    function calculateGPA(gr) {
      if (!gr) return { gpa: '—', rank: 'Chưa có điểm' };
      let total = 0, weight = 0;
      if (gr.tx1 !== null) { total += gr.tx1 * 1; weight += 1; }
      if (gr.tx2 !== null) { total += gr.tx2 * 1; weight += 1; }
      if (gr.gk !== null) { total += gr.gk * 2; weight += 2; }
      if (gr.ck !== null) { total += gr.ck * 3; weight += 3; }
      if (weight === 0) return { gpa: '—', rank: 'Chưa có điểm' };
      const gpa = Math.round((total / weight) * 10) / 10;
      let rank = 'Cần cố gắng';
      if (gpa >= 8.0) rank = 'Giỏi';
      else if (gpa >= 6.5) rank = 'Khá';
      else if (gpa >= 5.0) rank = 'Đạt';
      return { gpa, rank };
    }

    function render() {
      const container = document.getElementById('mainContainer');
      if (currentRole === 'student') {
        const student = appData.students.find(s => s.id === selectedStudentId) || appData.students[0];
        if (!student) {
          container.innerHTML = '<div class="p-8 bg-white rounded-xl text-center">Chưa có học sinh</div>';
          return;
        }
        const studentTasks = appData.tasks.filter(t => t.className === 'Tất cả' || t.className === student.className);
        const grade = appData.grades.find(g => g.studentId === student.id);
        const { gpa, rank } = calculateGPA(grade);

        container.innerHTML = \`
          <div class="space-y-6">
            <div class="bg-linear-to-r from-teal-800 to-cyan-800 text-white rounded-2xl p-6 shadow-sm">
              <div class="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <span class="text-xs px-2.5 py-0.5 rounded-full bg-white/20">Góc học sinh</span>
                  <h2 class="text-xl font-bold mt-1">Xin chào em \${student.fullName} (\${student.className})</h2>
                  <p class="text-xs text-teal-100 mt-1">Mã HS: \${student.studentCode} · Phụ trách: GV Trần Văn Bích</p>
                </div>
                <div class="bg-white/10 px-4 py-2.5 rounded-xl text-center">
                  <div class="text-xs text-teal-100">Điểm Tin học</div>
                  <div class="text-2xl font-bold">\${gpa}</div>
                  <div class="text-xs font-semibold">\${rank}</div>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-5 border border-slate-200">
              <h3 class="text-base font-bold mb-3">Nhiệm vụ được giao</h3>
              <div class="divide-y divide-slate-100">
                \${studentTasks.map(t => {
                  const sub = appData.submissions.find(s => s.taskId === t.id && s.studentId === student.id);
                  const done = sub && sub.completed;
                  return \`
                    <div class="py-3 flex items-center justify-between gap-4">
                      <div>
                        <div class="text-xs text-teal-700 font-semibold">\${t.topic}</div>
                        <div class="text-sm font-bold text-slate-800">\${t.title}</div>
                        <div class="text-xs text-slate-500 mt-0.5">Hạn: \${t.deadline}</div>
                      </div>
                      <span class="px-2.5 py-1 text-xs font-semibold rounded-full \${done ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}">
                        \${done ? 'Đã hoàn thành' : 'Chưa nộp'}
                      </span>
                    </div>
                  \`;
                }).join('')}
              </div>
            </div>
          </div>
        \`;
        return;
      }

      // Teacher tabs
      if (currentTab === 'dashboard') {
        const completedSubs = appData.submissions.filter(s => s.completed).length;
        const totalPossible = appData.students.length * Math.max(1, appData.tasks.length);
        const rate = totalPossible > 0 ? Math.round((completedSubs / totalPossible) * 100) : 0;

        container.innerHTML = \`
          <div class="space-y-6">
            <div class="bg-teal-700 text-white rounded-2xl p-6">
              <h2 class="text-xl font-bold">TRỢ LÝ HỌC TẬP TIN HỌC THPT BÙI DỤC TÀI</h2>
              <p class="text-xs text-teal-100 mt-1">Giáo viên phụ trách: Thầy Trần Văn Bích · Đơn vị: Trường THPT Bùi Dục Tài</p>
            </div>

            <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <div class="text-xs text-slate-500">Tổng học sinh</div>
                <div class="text-2xl font-bold text-slate-900 mt-1">\${appData.students.length}</div>
              </div>
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <div class="text-xs text-slate-500">Tổng nhiệm vụ</div>
                <div class="text-2xl font-bold text-slate-900 mt-1">\${appData.tasks.length}</div>
              </div>
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <div class="text-xs text-slate-500">Đang thực hiện</div>
                <div class="text-2xl font-bold text-amber-600 mt-1">\${appData.tasks.filter(t => t.status === 'Đang diễn ra').length}</div>
              </div>
              <div class="bg-white p-4 rounded-xl border border-slate-200">
                <div class="text-xs text-slate-500">Tỷ lệ hoàn thành</div>
                <div class="text-2xl font-bold text-emerald-600 mt-1">\${rate}%</div>
              </div>
            </div>

            <div class="bg-white rounded-xl p-5 border border-slate-200">
              <h3 class="text-sm font-bold text-slate-800 mb-3">Chủ đề SGK Tin học 10 Kết nối tri thức</h3>
              <div class="space-y-2 text-xs">
                <div class="p-2 bg-slate-50 rounded flex justify-between font-medium"><span>Chủ đề 5: Lập trình Python</span><span class="text-teal-700">Trọng tâm học kì</span></div>
                <div class="p-2 bg-slate-50 rounded flex justify-between font-medium"><span>Chủ đề 4: Đồ họa Inkscape</span><span class="text-teal-700">Thực hành phòng máy</span></div>
                <div class="p-2 bg-slate-50 rounded flex justify-between font-medium"><span>Chủ đề 1: Máy tính & Xã hội tri thức</span><span class="text-teal-700">Lý thuyết & Nhị phân</span></div>
              </div>
            </div>
          </div>
        \`;
      } else if (currentTab === 'students') {
        container.innerHTML = \`
          <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <div class="flex items-center justify-between">
              <h3 class="text-base font-bold text-slate-900">Danh sách Học sinh (\${appData.students.length})</h3>
            </div>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="bg-slate-50 text-xs text-slate-600 uppercase">
                    <th class="p-3">STT</th>
                    <th class="p-3">Mã HS</th>
                    <th class="p-3">Họ và tên</th>
                    <th class="p-3">Lớp</th>
                    <th class="p-3">Trạng thái</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${appData.students.map((s, idx) => \`
                    <tr>
                      <td class="p-3 text-xs text-slate-500 font-mono">\${idx + 1}</td>
                      <td class="p-3 font-mono text-xs">\${s.studentCode}</td>
                      <td class="p-3 font-semibold">\${s.fullName}</td>
                      <td class="p-3"><span class="px-2 py-0.5 rounded text-xs bg-teal-50 text-teal-800 font-medium">\${s.className}</span></td>
                      <td class="p-3 text-xs text-slate-700">\${s.status}</td>
                    </tr>
                  \`).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      } else if (currentTab === 'tasks') {
        container.innerHTML = \`
          <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 class="text-base font-bold text-slate-900">Quản lý Nhiệm vụ Học tập (\${appData.tasks.length})</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              \${appData.tasks.map(t => \`
                <div class="p-4 rounded-xl border border-slate-200 space-y-2">
                  <div class="flex justify-between items-start">
                    <span class="text-xs px-2 py-0.5 bg-teal-50 text-teal-800 rounded font-medium">\${t.className}</span>
                    <span class="text-xs px-2 py-0.5 bg-amber-50 text-amber-800 rounded font-medium">\${t.status}</span>
                  </div>
                  <h4 class="font-bold text-slate-900 text-sm">\${t.title}</h4>
                  <p class="text-xs text-slate-600 leading-relaxed">\${t.description}</p>
                  <div class="text-xs text-slate-400 pt-2 border-t border-slate-100">Hạn: \${t.deadline} · \${t.topic}</div>
                </div>
              \`).join('')}
            </div>
          </div>
        \`;
      } else if (currentTab === 'progress') {
        container.innerHTML = \`
          <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 class="text-base font-bold text-slate-900">Theo dõi Tiến độ Học sinh</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="bg-slate-50 text-xs text-slate-600 uppercase">
                    <th class="p-3">Học sinh</th>
                    <th class="p-3">Lớp</th>
                    <th class="p-3 text-center">Hoàn thành</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${appData.students.map(s => {
                    const applicable = appData.tasks.filter(t => t.className === 'Tất cả' || t.className === s.className);
                    const completed = applicable.filter(t => {
                      const sub = appData.submissions.find(sub => sub.taskId === t.id && sub.studentId === s.id);
                      return sub && sub.completed;
                    }).length;
                    const pct = applicable.length > 0 ? Math.round((completed / applicable.length) * 100) : 0;
                    return \`
                      <tr>
                        <td class="p-3 font-semibold">\${s.fullName} <span class="text-xs text-slate-400 font-mono">(\${s.studentCode})</span></td>
                        <td class="p-3 text-xs">\${s.className}</td>
                        <td class="p-3 text-center font-bold text-teal-700">\${completed}/\${applicable.length} (\${pct}%)</td>
                      </tr>
                    \`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      } else if (currentTab === 'grades') {
        container.innerHTML = \`
          <div class="bg-white rounded-xl border border-slate-200 p-5 space-y-4">
            <h3 class="text-base font-bold text-slate-900">Điểm số Môn Tin học THPT</h3>
            <div class="overflow-x-auto">
              <table class="w-full text-left text-sm">
                <thead>
                  <tr class="bg-slate-50 text-xs text-slate-600 uppercase">
                    <th class="p-3">Học sinh</th>
                    <th class="p-3">Lớp</th>
                    <th class="p-3 text-center">ĐGTX 1</th>
                    <th class="p-3 text-center">ĐGTX 2</th>
                    <th class="p-3 text-center">Giữa kì</th>
                    <th class="p-3 text-center">Điểm TB</th>
                    <th class="p-3 text-center">Xếp loại</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-100">
                  \${appData.students.map(s => {
                    const gr = appData.grades.find(g => g.studentId === s.id);
                    const { gpa, rank } = calculateGPA(gr);
                    return \`
                      <tr>
                        <td class="p-3 font-semibold">\${s.fullName}</td>
                        <td class="p-3 text-xs">\${s.className}</td>
                        <td class="p-3 text-center font-mono">\${gr && gr.tx1 !== null ? gr.tx1 : '—'}</td>
                        <td class="p-3 text-center font-mono">\${gr && gr.tx2 !== null ? gr.tx2 : '—'}</td>
                        <td class="p-3 text-center font-mono">\${gr && gr.gk !== null ? gr.gk : '—'}</td>
                        <td class="p-3 text-center font-bold text-teal-700 font-mono">\${gpa}</td>
                        <td class="p-3 text-center text-xs font-semibold">\${rank}</td>
                      </tr>
                    \`;
                  }).join('')}
                </tbody>
              </table>
            </div>
          </div>
        \`;
      }
    }

    render();
  </script>
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `Tro_Ly_Tin_Hoc_THPT_Bui_Duc_Tai.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
