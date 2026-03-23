import { useNavigate } from "react-router-dom";
import {
  Bell,
  User,
  Menu,
  Home,
  CalendarDays,
  Megaphone,
  UserCircle,
  Sparkles,
  CheckCircle,
  Calendar,
  Trophy,
  Star,
  ArrowRight,
  Settings,
  Mail,
  LogOut,
  CalendarCheck,
  Vote,
  BookOpen,
  Images,
} from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useXP } from "@/contexts/XPContext";
import { useLeaderboard } from "@/contexts/LeaderboardContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Profile = () => {
  const navigate = useNavigate();
  const { totalXP, activities } = useXP();
  const { myRanking } = useLeaderboard();
  const { logout } = useAuth();

  // XP 관련 계산 - Main과 동일한 로직
  const attendanceCount = activities.filter((a) => a.type === "출석").length;
  const eventCount = activities.filter((a) => a.type === "행사").length;
  const displayXP = totalXP > 0 ? totalXP : 18; // Main과 동일한 기본값
  const displayRank = myRanking?.rank || 12;

  // User data - Main과 일치
  const userData = {
    name: "최진욱",
    department: "컴퓨터정보공학과",
    studentId: "202121160",
    currentXP: displayXP,
    requiredXP: Math.max(21, displayXP + 3), // 재등록 요건: 3xp
    joinDate: "2024년 3월 1일",
    memberType: "일반 회원",
  };

  // Stats data - Main과 동일한 기본값 적용
  const stats = {
    totalXP: displayXP,
    attendance: attendanceCount > 0 ? attendanceCount : 6,
    events: eventCount > 0 ? eventCount : 2,
    semesterRank: displayRank,
  };

  // Achievements data
  const achievements = [
    {
      id: 1,
      icon: <Calendar className="w-6 h-6" style={{ color: "#10B981" }} />,
      title: "출석왕",
      description: "출석 10회 달성",
      progress: attendanceCount,
      total: 10,
    },
    {
      id: 2,
      icon: <Star className="w-6 h-6" style={{ color: "#10B981" }} />,
      title: "적극참여상",
      description: "행사 10회 이상 참여",
      progress: eventCount,
      total: 10,
    },
    {
      id: 3,
      icon: <Trophy className="w-6 h-6" style={{ color: "#10B981" }} />,
      title: "XP 마스터",
      description: "XP 50점 달성",
      progress: totalXP,
      total: 50,
    },
  ];

  // 최근 활동은 XP Context에서 가져옴
  const recentActivities = activities.slice(0, 5);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true }); // ✅ 로그인 라우트로 이동(필요시 /login 으로 변경)
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
                  onClick={() => navigate("/schedule")}
                >
                  <CalendarCheck className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span style={{ color: "#0F4C3A" }}>일정</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate("/vote-list")}
                >
                  <Vote className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span style={{ color: "#0F4C3A" }}>투표</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate("/study")}
                >
                  <BookOpen className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span style={{ color: "#0F4C3A" }}>스터디</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate("/album")}
                >
                  <Images className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span style={{ color: "#0F4C3A" }}>앨범</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate("/settings")}
                >
                  <Settings className="w-4 h-4" style={{ color: "#6B7280" }} />
                  <span style={{ color: "#0F4C3A" }}>설정</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 pb-24 space-y-5">
        {/* Profile Card */}
        <div
          className="rounded-2xl p-5 text-white"
          style={{ background: "linear-gradient(135deg, #10B981 0%, #0A6647 100%)" }}
        >
          <div className="flex items-start gap-4 mb-4">
            {/* Avatar */}
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
              style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            >
              최
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold mb-1">{userData.name}</h1>
              <p className="text-sm opacity-90">{userData.department}</p>
              <p className="text-sm opacity-80">{userData.studentId}</p>
            </div>
          </div>

          {/* Rank and XP Row */}
          <div className="flex items-center justify-between mb-2">
            <span className="flex items-center gap-1.5 text-sm">
              <Trophy className="w-4 h-4" /> #{displayRank}
            </span>
            <span className="text-sm">
              {userData.currentXP}/ {userData.requiredXP} XP
            </span>
          </div>

          {/* XP Progress Bar */}
          <div className="w-full h-2 rounded-full mb-2" style={{ backgroundColor: "rgba(255,255,255,0.3)" }}>
            <div
              className="h-full rounded-full"
              style={{
                width: `${(userData.currentXP / userData.requiredXP) * 100}%`,
                backgroundColor: "#FFFFFF",
              }}
            ></div>
          </div>
          <p className="text-xs opacity-80 text-center mb-4">
            다음 레벨까지 {userData.requiredXP - userData.currentXP} XP
          </p>

          {/* Join Date and Member Type */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs opacity-70">가입일</p>
              <p className="text-sm font-medium">{userData.joinDate}</p>
            </div>
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium" style={{ backgroundColor: "rgba(255,255,255,0.2)" }}>
              {userData.memberType}
            </span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <button
            className="rounded-xl p-4 text-left cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
            onClick={() => navigate("/xp-details")}
          >
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
              <Sparkles className="w-3 h-3" /> 총 XP
            </div>
            <p className="text-3xl font-bold" style={{ color: "#10B981" }}>
              {stats.totalXP}
            </p>
          </button>

          <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
              <CheckCircle className="w-3 h-3" /> 출석 횟수
            </div>
            <p className="text-3xl font-bold" style={{ color: "#0F4C3A" }}>
              {stats.attendance}회
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
              <Calendar className="w-3 h-3" /> 행사 참여
            </div>
            <p className="text-3xl font-bold" style={{ color: "#0F4C3A" }}>
              {stats.events}회
            </p>
          </div>

          <div className="rounded-xl p-4" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
              <Trophy className="w-3 h-3" /> 이번 학기
            </div>
            <p className="text-3xl font-bold" style={{ color: "#0F4C3A" }}>
              #{stats.semesterRank}
            </p>
          </div>
        </div>

        {/* Achievements Section */}
        <section>
          <h2 className="font-bold mb-3" style={{ color: "#0F4C3A" }}>
            업적
          </h2>
          <div className="space-y-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="rounded-xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "#D1FAE5" }}
                  >
                    {achievement.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold" style={{ color: "#0F4C3A" }}>
                      {achievement.title}
                    </h3>
                    <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                      {achievement.description}
                    </p>

                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs" style={{ color: "#6B7280" }}>
                        진행도
                      </span>
                      <span className="text-xs font-medium" style={{ color: "#0F4C3A" }}>
                        {achievement.progress} / {achievement.total}
                      </span>
                    </div>
                    <div className="h-2 rounded-full" style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}>
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${(achievement.progress / achievement.total) * 100}%`,
                          backgroundColor: "#10B981",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Recent Activities Section */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ color: "#0F4C3A" }}>
              최근 활동
            </h2>
            <button className="text-sm flex items-center gap-1" style={{ color: "#10B981" }}>
              더보기 <ArrowRight className="w-3 h-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
              >
                <div>
                  <h3 className="font-semibold text-sm" style={{ color: "#0F4C3A" }}>
                    {activity.title}
                  </h3>
                  <p className="text-xs" style={{ color: "#6B7280" }}>
                    {activity.type} · {activity.date}
                  </p>
                </div>
                <span className="px-2 py-1 rounded-lg text-sm font-semibold" style={{ backgroundColor: "#D1FAE5", color: "#10B981" }}>
                  +{activity.xp}XP
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Links */}
        <div className="space-y-2">
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
            onClick={() => navigate("/settings")}
          >
            <Settings className="w-5 h-5" style={{ color: "#6B7280" }} />
            <span style={{ color: "#0F4C3A" }}>설정</span>
          </button>

          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
            onClick={() => window.location.href = "mailto:contact@coma-room.com"}
          >
            <Mail className="w-5 h-5" style={{ color: "#6B7280" }} />
            <span style={{ color: "#0F4C3A" }}>운영진에게 문의하기</span>
          </button>

          {/* ✅ 로그아웃 */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
            style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
            onClick={handleLogout}
          >
            <LogOut className="w-5 h-5" style={{ color: "#E7000B" }} />
            <span style={{ color: "#E7000B" }}>로그아웃</span>
          </button>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t"
        style={{ backgroundColor: "#FFFFFF", borderColor: "#D1FAE5" }}
      >
        <button className="flex flex-col items-center gap-1" onClick={() => navigate("/main")}>
          <Home className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            홈
          </span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate("/schedule")}>
          <CalendarDays className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            일정
          </span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate("/notice")}>
          <Megaphone className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>
            공지
          </span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <UserCircle className="w-5 h-5" style={{ color: "#10B981" }} />
          <span className="text-xs font-medium" style={{ color: "#10B981" }}>
            마이
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Profile;