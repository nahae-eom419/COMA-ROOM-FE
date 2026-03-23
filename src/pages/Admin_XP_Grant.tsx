import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Users, Sparkles, LayoutDashboard, ClipboardCheck, Megaphone, Check, X } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useXP } from "@/contexts/XPContext";
import { useLeaderboard, CURRENT_USER } from "@/contexts/LeaderboardContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type XPStatus = "pending" | "approved" | "rejected";

interface XPRequest {
  id: number;
  name: string;
  studentId: string;
  title: string;
  description: string;
  date: string;
  time: string;
  type: string;
  xp: number;
  status: XPStatus;
}

const initialXPRequests: XPRequest[] = [
  {
    id: 1,
    name: "김동아",
    studentId: "2021123456",
    title: "정기모임 #8 출석",
    description: "출석 QR 스캔 완료",
    date: "2025-01-21",
    time: "14:30",
    type: "출석",
    xp: 3,
    status: "pending",
  },
  {
    id: 2,
    name: "이코마",
    studentId: "2022234567",
    title: "부원 간 식사 인증",
    description: "사진 인증 첨부",
    date: "2025-01-21",
    time: "12:15",
    type: "행사",
    xp: 5,
    status: "pending",
  },
  {
    id: 3,
    name: "박학생",
    studentId: "2021345678",
    title: "2025 운영 방향 투표 참여",
    description: "운영자가 승인",
    date: "2025-01-20",
    time: "19:45",
    type: "투표",
    xp: 2,
    status: "approved",
  },
  {
    id: 4,
    name: "최부원",
    studentId: "2023456789",
    title: "정기모임 #8 출석",
    description: "운영자가 승인",
    date: "2025-01-20",
    time: "18:20",
    type: "출석",
    xp: 3,
    status: "approved",
  },
  {
    id: 5,
    name: "정회원",
    studentId: "2022567890",
    title: "프로젝트 발표",
    description: "",
    date: "2025-01-20",
    time: "16:00",
    type: "프로젝트",
    xp: 10,
    status: "rejected",
  },
];

const Admin_XP_Grant = () => {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const { updateMemberXP } = useLeaderboard();
  const [activeFilter, setActiveFilter] = useState<"all" | XPStatus>("all");
  const [xpRequests, setXpRequests] = useState<XPRequest[]>(initialXPRequests);
  
  // Form state
  const [memberName, setMemberName] = useState("");
  const [xpAmount, setXpAmount] = useState("0");
  const [reason, setReason] = useState("");

  const pendingCount = xpRequests.filter((r) => r.status === "pending").length;
  const approvedCount = xpRequests.filter((r) => r.status === "approved").length;
  const rejectedCount = xpRequests.filter((r) => r.status === "rejected").length;

  const filteredRequests = xpRequests.filter((r) => {
    if (activeFilter === "all") return true;
    return r.status === activeFilter;
  });

  const handleApprove = (id: number) => {
    setXpRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "approved" as XPStatus } : r))
    );
  };

  const handleReject = (id: number) => {
    setXpRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: "rejected" as XPStatus } : r))
    );
  };

  const handleGrant = () => {
    const amount = parseInt(xpAmount);
    if (!memberName || amount <= 0) return;

    // 리더보드 Context에 반영
    updateMemberXP(memberName, amount);

    // 현재 로그인 사용자에게 지급하는 경우 XP Context에도 반영
    if (memberName === CURRENT_USER) {
      addXP(amount, reason || "관리자 XP 지급", "행사");
    }

    console.log("Granting XP:", { memberName, xpAmount, reason });
    // Reset form
    setMemberName("");
    setXpAmount("0");
    setReason("");
  };

  const handleCancel = () => {
    navigate("/admin/xp");
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "출석":
        return { bg: "#D1FAE5", color: "#10B981" };
      case "행사":
        return { bg: "#FEE685", color: "#0F4C3A" };
      case "투표":
        return { bg: "#D1FAE5", color: "#10B981" };
      case "프로젝트":
        return { bg: "#DBEAFE", color: "#1447E6" };
      default:
        return { bg: "#D1FAE5", color: "#10B981" };
    }
  };

  const getStatusBadge = (status: XPStatus) => {
    switch (status) {
      case "pending":
        return { bg: "#FE9A00", color: "#FFFFFF", text: "대기중" };
      case "approved":
        return { bg: "#D1FAE5", color: "#10B981", text: "승인" };
      case "rejected":
        return { bg: "#FFC9C9", color: "#E7000B", text: "거부" };
    }
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
          XP 관리
        </h1>
        <p className="text-sm mb-4" style={{ color: "#6B7280" }}>
          XP 요청을 승인하거나 직접 XP를 부여하세요
        </p>

        {/* XP 직접 부여 Form Card */}
        <div
          className="rounded-2xl p-5 mb-4"
          style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-5 h-5" style={{ color: "#10B981" }} />
            <h2 className="font-bold text-base" style={{ color: "#0F4C3A" }}>
              XP 직접 부여
            </h2>
          </div>

          {/* 부원 이름 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#0F4C3A" }}>
              부원 이름
            </label>
            <input
              type="text"
              placeholder="이름을 여기에 입력하세요."
              value={memberName}
              onChange={(e) => setMemberName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #D1FAE5",
                color: "#0F4C3A",
              }}
            />
          </div>

          {/* XP 점수 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#0F4C3A" }}>
              XP 점수
            </label>
            <input
              type="number"
              value={xpAmount}
              onChange={(e) => setXpAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm"
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #D1FAE5",
                color: "#0F4C3A",
              }}
            />
          </div>

          {/* 사유 */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2" style={{ color: "#0F4C3A" }}>
              사유
            </label>
            <textarea
              placeholder="XP 부여 사유를 간단하게 입력해주세요."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 rounded-lg text-sm resize-none"
              style={{
                backgroundColor: "#F0FDF4",
                border: "1px solid #D1FAE5",
                color: "#0F4C3A",
              }}
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleGrant}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-lg text-sm font-medium"
              style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
            >
              <Sparkles className="w-4 h-4" />
              부여하기
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 py-3 rounded-lg text-sm font-medium"
              style={{
                backgroundColor: "#FFFFFF",
                color: "#6B7280",
                border: "1px solid #D1FAE5",
              }}
            >
              취소
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
              {pendingCount}
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              승인 대기
            </p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#10B981" }}>
              {approvedCount}
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              승인 완료
            </p>
          </div>
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
          >
            <p className="text-2xl font-bold" style={{ color: "#E7000B" }}>
              {rejectedCount}
            </p>
            <p className="text-xs" style={{ color: "#6B7280" }}>
              거부
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-4">
          {[
            { key: "all", label: "전체" },
            { key: "pending", label: "승인 대기" },
            { key: "approved", label: "승인 완료" },
            { key: "rejected", label: "거부" },
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setActiveFilter(filter.key as "all" | XPStatus)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                backgroundColor: activeFilter === filter.key ? "#10B981" : "#FFFFFF",
                color: activeFilter === filter.key ? "#FFFFFF" : "#6B7280",
                border: activeFilter === filter.key ? "none" : "1px solid #D1FAE5",
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* XP Request List */}
        <div className="space-y-3">
          {filteredRequests.map((request) => {
            const typeStyle = getTypeColor(request.type);
            const statusBadge = getStatusBadge(request.status);

            return (
              <div
                key={request.id}
                className="rounded-xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm" style={{ color: "#0F4C3A" }}>
                      {request.name}
                    </span>
                    <span className="text-xs" style={{ color: "#6B7280" }}>
                      {request.studentId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Sparkles className="w-3 h-3" style={{ color: "#10B981" }} />
                      <span className="text-sm font-bold" style={{ color: "#10B981" }}>
                        +{request.xp}XP
                      </span>
                    </div>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: statusBadge.bg, color: statusBadge.color }}
                    >
                      {statusBadge.text}
                    </span>
                  </div>
                </div>

                <p className="font-medium text-sm mb-1" style={{ color: "#0F4C3A" }}>
                  {request.title}
                </p>
                {request.description && (
                  <p className="text-xs mb-2" style={{ color: "#6B7280" }}>
                    {request.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "#6B7280" }}>
                      {request.date} {request.time}
                    </span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: typeStyle.bg, color: typeStyle.color }}
                    >
                      {request.type}
                    </span>
                  </div>
                </div>

                {request.status === "pending" && (
                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: "#10B981", color: "#FFFFFF" }}
                    >
                      <Check className="w-4 h-4" />
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: "#FFFFFF", color: "#E7000B", border: "1px solid #FFC9C9" }}
                    >
                      <X className="w-4 h-4" />
                      거부
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
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
          <Sparkles className="w-5 h-5" style={{ color: "#10B981" }} />
          <span className="text-xs font-medium" style={{ color: "#10B981" }}>
            XP
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <ClipboardCheck className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            출석
          </span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate("/notice")}
        >
          <Megaphone className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            공지
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Admin_XP_Grant;
