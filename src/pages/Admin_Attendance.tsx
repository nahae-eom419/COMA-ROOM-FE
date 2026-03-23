import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Users, Sparkles, LayoutDashboard, ClipboardCheck, Megaphone, ChevronLeft, ChevronRight, Play, Clock, QrCode, StopCircle, Trash2 } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import ComaLogo from "@/components/ComaLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ACTIVITY_TYPES = [
  { value: "정기회의", label: "정기회의" },
  { value: "스터디", label: "스터디" },
  { value: "lab", label: "Lab" },
  { value: "부스", label: "부스" },
  { value: "기타", label: "기타" },
] as const;

type ActivityType = typeof ACTIVITY_TYPES[number]["value"];
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Attendee {
  id: number;
  name: string;
  studentId: string;
  grade: string;
  checkedInAt: string;
}

interface AttendanceRecord {
  id: number;
  title: string;
  activityType: ActivityType;
  date: string;
  time: string;
  attendees: number;
  duration: number;
  status: "completed" | "active";
  attendeeList: Attendee[];
}

const sampleAttendees: Attendee[] = [
  { id: 1, name: "김민수", studentId: "2024111001", grade: "1학년", checkedInAt: "14:32" },
  { id: 2, name: "이서연", studentId: "2024111002", grade: "1학년", checkedInAt: "14:33" },
  { id: 3, name: "박준혁", studentId: "2023111003", grade: "2학년", checkedInAt: "14:35" },
  { id: 4, name: "최유진", studentId: "2023111004", grade: "2학년", checkedInAt: "14:36" },
  { id: 5, name: "정다은", studentId: "2022111005", grade: "3학년", checkedInAt: "14:38" },
  { id: 6, name: "한지호", studentId: "2024111006", grade: "1학년", checkedInAt: "14:40" },
  { id: 7, name: "윤서준", studentId: "2023111007", grade: "2학년", checkedInAt: "14:42" },
  { id: 8, name: "강예린", studentId: "2024111008", grade: "1학년", checkedInAt: "14:45" },
];

const initialAttendanceRecords: AttendanceRecord[] = [
  {
    id: 1,
    title: "정기모임 #8",
    activityType: "정기회의",
    date: "2025-01-21",
    time: "14:30",
    attendees: 38,
    duration: 45,
    status: "completed",
    attendeeList: sampleAttendees,
  },
  {
    id: 2,
    title: "정기모임 #7",
    activityType: "정기회의",
    date: "2025-01-14",
    time: "14:30",
    attendees: 41,
    duration: 50,
    status: "completed",
    attendeeList: sampleAttendees.slice(0, 6),
  },
  {
    id: 3,
    title: "정기모임 #6",
    activityType: "정기회의",
    date: "2025-01-07",
    time: "14:30",
    attendees: 39,
    duration: 48,
    status: "completed",
    attendeeList: sampleAttendees.slice(0, 5),
  },
];

const Admin_Attendance = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [sessionId, setSessionId] = useState("");
  const [currentAttendees, setCurrentAttendees] = useState(0);
  const [activityName, setActivityName] = useState("");
  const [activityType, setActivityType] = useState<ActivityType>("정기회의");
  const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(initialAttendanceRecords);
  const [filterType, setFilterType] = useState<ActivityType | "all">("all");

  const filteredRecords = filterType === "all" 
    ? attendanceRecords 
    : attendanceRecords.filter(record => record.activityType === filterType);
  const totalPages = Math.ceil(filteredRecords.length / 3) || 1;
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<AttendanceRecord | null>(null);

  const generateSessionId = () => {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 7);
    return `COMA-${timestamp}-${randomStr}`;
  };

  const handleStartSession = () => {
    const newSessionId = generateSessionId();
    setSessionId(newSessionId);
    setCurrentAttendees(0);
    setSessionStartTime(new Date());
    setIsSessionActive(true);
  };

  const handleEndSession = () => {
    if (sessionStartTime && activityName.trim()) {
      const now = new Date();
      const durationMinutes = Math.round((now.getTime() - sessionStartTime.getTime()) / 60000);
      
      const newRecord: AttendanceRecord = {
        id: Date.now(),
        title: activityName,
        activityType: activityType,
        date: sessionStartTime.toISOString().split('T')[0],
        time: sessionStartTime.toTimeString().slice(0, 5),
        attendees: currentAttendees,
        duration: durationMinutes || 1,
        status: "completed",
        attendeeList: [], // 실제로는 세션 중 체크인한 부원들이 추가됨
      };
      
      setAttendanceRecords(prev => [newRecord, ...prev]);
    }
    
    setIsSessionActive(false);
    setSessionId("");
    setCurrentAttendees(0);
    setActivityName("");
    setActivityType("정기회의");
    setSessionStartTime(null);
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      setAttendanceRecords(prev => prev.filter(r => r.id !== deleteTargetId));
    }
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleDetailClick = (record: AttendanceRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FFFE" }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3" style={{ backgroundColor: "#10B981" }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ComaLogo size="sm" />
            <span className="text-white font-bold text-lg">COMA-ROOM</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/notifications")}>
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => navigate("/profile")}>
              <User className="w-5 h-5 text-white" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="focus:outline-none">
                  <Menu className="w-5 h-5 text-white" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-32 bg-white border border-gray-200 shadow-lg rounded-lg z-[100]"
              >
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate("/")}
                >
                  <User className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span style={{ color: "#0F4C3A" }}>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Admin Mode Badge */}
        <div className="mt-2">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: "#FE9A00", color: "#FFFFFF" }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            관리자 모드
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24">
        {/* Title Section */}
        <h1 className="text-xl font-bold mb-2" style={{ color: "#0F4C3A" }}>
          출석 관리
        </h1>
        <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
          QR 코드로 출석을 확인하고 관리하세요
        </p>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
              85
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              전체 부원
            </p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
              83
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              활성 부원
            </p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#0F4C3A" }}>
              {currentAttendees}
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              현재 출석
            </p>
          </div>
        </div>

        {/* Conditional: Start Session Card OR Active Session Card */}
        {!isSessionActive ? (
          /* Start Attendance Session Card */
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: "#DCFCE7" }}
          >
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: "#FFFFFF" }}
              >
                <QrCode className="w-8 h-8" style={{ color: "#10B981" }} />
              </div>
              <h2 className="font-bold text-lg mb-2" style={{ color: "#0F4C3A" }}>
                출석 세션 시작하기
              </h2>
              <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
                활동명을 입력하고 버튼을 클릭하면 QR 코드가 생성됩니다
              </p>
            </div>
            
            {/* Activity Type Select */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#0F4C3A" }}>
                활동 유형
              </label>
              <Select value={activityType} onValueChange={(value) => setActivityType(value as ActivityType)}>
                <SelectTrigger 
                  className="w-full px-4 py-3 h-auto rounded-xl text-sm border-0 focus:ring-2 focus:ring-[#10B981]"
                  style={{ backgroundColor: "#FFFFFF", color: "#0F4C3A" }}
                >
                  <SelectValue placeholder="활동 유형 선택" />
                </SelectTrigger>
                <SelectContent>
                  {ACTIVITY_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Activity Name Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: "#0F4C3A" }}>
                활동명
              </label>
              <input
                type="text"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="예: 정기모임 #9, 스터디, 워크샵"
                className="w-full px-4 py-3 rounded-xl text-sm border-0 focus:outline-none focus:ring-2 focus:ring-[#10B981]"
                style={{ backgroundColor: "#FFFFFF", color: "#0F4C3A" }}
              />
            </div>
            
            <button
              className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
              onClick={handleStartSession}
              disabled={!activityName.trim()}
            >
              <Play className="w-4 h-4" />
              출석 시작하기
            </button>
          </div>
        ) : (
          /* Active Attendance Session Card */
          <div
            className="rounded-2xl p-6 mb-6"
            style={{ backgroundColor: "#DCFCE7" }}
          >
            {/* Session Header */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div
                  className="w-2.5 h-2.5 rounded-full animate-pulse"
                  style={{ backgroundColor: "#10B981" }}
                ></div>
                <span className="font-bold" style={{ color: "#0F4C3A" }}>
                  출석 진행 중
                </span>
              </div>
              <span
                className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
                style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
              >
                <Clock className="w-3 h-3" />
                실시간
              </span>
            </div>
            
            {/* Activity Name Display */}
            <div 
              className="mb-4 px-4 py-2 rounded-lg text-center"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <span className="text-sm font-medium" style={{ color: "#0F4C3A" }}>
                {activityName}
              </span>
            </div>

            {/* QR Code Container */}
            <div
              className="rounded-xl p-6 mb-4 flex flex-col items-center"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <QRCodeSVG
                value={`${window.location.origin}/attendance/verify?session=${sessionId}&type=${encodeURIComponent(activityType)}`}
                size={200}
                level="H"
                fgColor="#10B981"
                bgColor="#FFFFFF"
                className="mb-4"
              />
              <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                QR 코드를 스캔하여 출석해주세요
              </p>
              <span
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs"
                style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
              >
                {sessionId}
              </span>
            </div>

            {/* Real-time Attendance Count */}
            <div
              className="rounded-xl p-4 mb-4 flex items-center justify-between"
              style={{ backgroundColor: "#FFFFFF" }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: "#6B7280" }} />
                <span className="font-medium" style={{ color: "#0F4C3A" }}>
                  실시간 출석 현황
                </span>
              </div>
              <span className="text-xl font-bold" style={{ color: "#0F4C3A" }}>
                {currentAttendees}명
              </span>
            </div>

            {/* End Session Button */}
            <button
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: "#FFC9C9", color: "#E7000B" }}
              onClick={handleEndSession}
            >
              <StopCircle className="w-4 h-4" />
              출석 종료하기
            </button>
          </div>
        )}

        {/* Recent Attendance Records */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold" style={{ color: "#0F4C3A" }}>
            최근 출석 기록
          </h3>
          <Select value={filterType} onValueChange={(value) => {
            setFilterType(value as ActivityType | "all");
            setCurrentPage(1);
          }}>
            <SelectTrigger 
              className="w-32 h-9 rounded-lg text-xs border focus:ring-2 focus:ring-[#10B981]"
              style={{ backgroundColor: "#FFFFFF", color: "#0F4C3A", borderColor: "#D1FAE5" }}
            >
              <SelectValue placeholder="전체" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">전체</SelectItem>
              {ACTIVITY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {filteredRecords.length === 0 ? (
          <div 
            className="rounded-xl p-8 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
          >
            <p className="text-sm" style={{ color: "#6B7280" }}>
              {filterType === "all" ? "아직 출석 기록이 없습니다" : "해당 유형의 출석 기록이 없습니다"}
            </p>
          </div>
        ) : (
        <div className="space-y-3">
          {filteredRecords.slice((currentPage - 1) * 3, currentPage * 3).map((record) => (
            <div
              key={record.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: "#E0E7FF", color: "#4F46E5" }}
                  >
                    {ACTIVITY_TYPES.find(t => t.value === record.activityType)?.label || record.activityType}
                  </span>
                  <span className="font-bold text-sm" style={{ color: "#0F4C3A" }}>
                    {record.title}
                  </span>
                  <span
                    className="px-2 py-0.5 rounded text-xs font-medium"
                    style={{ backgroundColor: "#D1FAE5", color: "#10B981" }}
                  >
                    완료
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleDetailClick(record)}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium"
                    style={{ backgroundColor: "#FFFFFF", color: "#10B981", border: "1px solid #10B981" }}
                  >
                    상세보기
                  </button>
                  <button
                    onClick={() => handleDeleteClick(record.id)}
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: "#FEE2E2" }}
                  >
                    <Trash2 className="w-4 h-4" style={{ color: "#EF4444" }} />
                  </button>
                </div>
              </div>
              <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                {record.date} {record.time}
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span className="text-sm" style={{ color: "#6B7280" }}>
                    {record.attendees}명
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span className="text-sm" style={{ color: "#6B7280" }}>
                    {record.duration}분
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
        )}

        {/* Pagination */}
        {attendanceRecords.length > 3 && (
        <div className="flex items-center justify-center gap-2 mt-6">
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: "#6B7280" }} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
              style={{
                backgroundColor: currentPage === page ? "#10B981" : "#FFFFFF",
                color: currentPage === page ? "#FFFFFF" : "#6B7280",
                border: currentPage === page ? "none" : "1px solid #D1FAE5",
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" style={{ color: "#6B7280" }} />
          </button>
        </div>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#D1FAE5" }}
      >
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate("/admin")}
        >
          <LayoutDashboard className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            대시보드
          </span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate("/admin/members")}
        >
          <Users className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            부원
          </span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate("/admin/xp")}
        >
          <Sparkles className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            XP
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <ClipboardCheck className="w-5 h-5" style={{ color: "#10B981" }} />
          <span className="text-xs font-medium" style={{ color: "#10B981" }}>
            출석
          </span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate("/admin/notice")}
        >
          <Megaphone className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            공지
          </span>
        </button>
      </nav>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent 
          className="w-[calc(100%-2rem)] max-w-[320px] rounded-2xl p-5 border-0"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-bold" style={{ color: '#0F4C3A' }}>
              출석 기록 삭제
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm" style={{ color: '#6B7280' }}>
              이 출석 기록을 삭제하시겠습니까? 삭제된 기록은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 mt-4">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
            >
              삭제
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#F1F5F9', color: '#6B7280' }}
            >
              취소
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent 
          className="w-[calc(100%-2rem)] max-w-[400px] rounded-2xl p-0 border-0 max-h-[80vh] overflow-hidden"
          style={{ backgroundColor: '#FFFFFF' }}
          hideCloseButton
        >
          <DialogHeader className="p-5 pb-3 border-b" style={{ borderColor: '#D1FAE5' }}>
            <div className="flex items-center justify-between">
              <DialogTitle className="font-bold" style={{ color: '#0F4C3A' }}>
                {selectedRecord?.title}
              </DialogTitle>
              <button 
                onClick={() => setIsDetailModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              >
                <span className="text-xl" style={{ color: '#6B7280' }}>×</span>
              </button>
            </div>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-sm" style={{ color: '#6B7280' }}>
                {selectedRecord?.date} {selectedRecord?.time}
              </span>
              <span className="text-sm" style={{ color: '#6B7280' }}>
                {selectedRecord?.duration}분
              </span>
            </div>
          </DialogHeader>
          
          <div className="p-5 pt-3">
            {/* Stats */}
            <div 
              className="rounded-xl p-4 mb-4 flex items-center justify-between"
              style={{ backgroundColor: '#F0FDF4' }}
            >
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" style={{ color: '#10B981' }} />
                <span className="font-medium" style={{ color: '#0F4C3A' }}>
                  총 출석 인원
                </span>
              </div>
              <span className="text-xl font-bold" style={{ color: '#10B981' }}>
                {selectedRecord?.attendeeList.length || 0}명
              </span>
            </div>
            
            {/* Attendee List */}
            <h4 className="font-bold text-sm mb-3" style={{ color: '#0F4C3A' }}>
              출석자 명단
            </h4>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {selectedRecord?.attendeeList.length === 0 ? (
                <div 
                  className="rounded-xl p-6 text-center"
                  style={{ backgroundColor: '#F9FAFB' }}
                >
                  <p className="text-sm" style={{ color: '#6B7280' }}>
                    출석자가 없습니다
                  </p>
                </div>
              ) : (
                selectedRecord?.attendeeList.map((attendee) => (
                  <div
                    key={attendee.id}
                    className="rounded-xl p-3 flex items-center justify-between"
                    style={{ backgroundColor: '#F9FAFB' }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                        style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                      >
                        {attendee.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm" style={{ color: '#0F4C3A' }}>
                          {attendee.name}
                        </p>
                        <p className="text-xs" style={{ color: '#6B7280' }}>
                          {attendee.studentId} · {attendee.grade}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" style={{ color: '#6B7280' }} />
                      <span className="text-xs" style={{ color: '#6B7280' }}>
                        {attendee.checkedInAt}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin_Attendance;
