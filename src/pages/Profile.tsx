import { useState, useEffect } from "react";
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
  Loader2,
  X,
} from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useAuth } from "@/contexts/AuthContext";
import { apiFetch } from "@/api/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RecentActivity {
  activityId: number;
  title: string;
  type: string;
  earnedXp: number;
  createdAt: string;
}

interface ProfileData {
  name: string;
  major: string;
  studentId: string;
  ranking: number;
  currentXp: number;
  joinedDate: string;
  memberStatus: string;
  attendanceCount: number;
  eventCount: number;
  recentActivities: RecentActivity[];
}

const Profile = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showXpModal, setShowXpModal] = useState(false);
  const [xpAmount, setXpAmount] = useState("");
  const [xpReason, setXpReason] = useState("");
  const [xpSubmitting, setXpSubmitting] = useState(false);
  const [xpResult, setXpResult] = useState<{ ok: boolean; message: string } | null>(null);

  const handleXpSubmit = async () => {
    const amount = Number(xpAmount);
    if (!amount || amount <= 0) {
      setXpResult({ ok: false, message: "XP 수량을 올바르게 입력해 주세요." });
      return;
    }
    if (!xpReason.trim()) {
      setXpResult({ ok: false, message: "요청 사유를 입력해 주세요." });
      return;
    }

    setXpSubmitting(true);
    setXpResult(null);
    try {
      await apiFetch("/api/member/ask-xp", {
        method: "POST",
        body: JSON.stringify({
          provisionAmount: amount,
          provisionReason: xpReason.trim(),
        }),
      });

      setXpResult({
        ok: true,
        message: "XP 요청이 완료되었습니다. 운영진 확인 후 지급됩니다.",
      });
      setXpAmount("");
      setXpReason("");
    } catch (e) {
      setXpResult({
        ok: false,
        message: e instanceof Error ? e.message : "요청에 실패했습니다. 다시 시도해 주세요.",
      });
    } finally {
      setXpSubmitting(false);
    }
  };

  useEffect(() => {
    apiFetch<ProfileData>("/api/member/profile")
      .then(setProfile)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  const requiredXP = profile ? Math.max(profile.currentXp + 3, 21) : 21;

  const achievements = profile
    ? [
        {
          id: 1,
          icon: <Calendar className="w-6 h-6" style={{ color: "#10B981" }} />,
          title: "출석왕",
          description: "출석 10회 달성",
          progress: profile.attendanceCount,
          total: 10,
        },
        {
          id: 2,
          icon: <Star className="w-6 h-6" style={{ color: "#10B981" }} />,
          title: "활동 참여왕",
          description: "행사 10회 이상 참여",
          progress: profile.eventCount,
          total: 10,
        },
        {
          id: 3,
          icon: <Trophy className="w-6 h-6" style={{ color: "#10B981" }} />,
          title: "XP 마스터",
          description: "XP 50 달성",
          progress: profile.currentXp,
          total: 50,
        },
      ]
    : [];

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FFFE" }}>
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

      <main className="flex-1 px-4 py-4 pb-24 space-y-5">
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin" style={{ color: "#10B981" }} />
          </div>
        )}

        {error && (
          <div
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: "#FFF1F2", border: "1px solid #FFE4E6" }}
          >
            <p className="text-sm" style={{ color: "#C70036" }}>
              프로필을 불러오지 못했습니다. {error}
            </p>
          </div>
        )}

        {!loading && !error && profile && (
          <>
            <div
              className="rounded-2xl p-5 text-white"
              style={{ background: "linear-gradient(135deg, #10B981 0%, #0A6647 100%)" }}
            >
              <div className="flex items-start gap-4 mb-4">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <h1 className="text-xl font-bold mb-1">{profile.name}</h1>
                  <p className="text-sm opacity-90">{profile.major}</p>
                  <p className="text-sm opacity-80">{profile.studentId}</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-2">
                <span className="flex items-center gap-1.5 text-sm">
                  <Trophy className="w-4 h-4" /> #{profile.ranking}
                </span>
                <span className="text-sm">
                  {profile.currentXp} / {requiredXP} XP
                </span>
              </div>
              <div
                className="w-full h-2 rounded-full mb-2"
                style={{ backgroundColor: "rgba(255,255,255,0.3)" }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: `${Math.min((profile.currentXp / requiredXP) * 100, 100)}%`,
                    backgroundColor: "#FFFFFF",
                  }}
                />
              </div>
              <p className="text-xs opacity-80 text-center mb-4">
                다음 레벨까지 {requiredXP - profile.currentXp} XP
              </p>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs opacity-70">가입일</p>
                  <p className="text-sm font-medium">
                    {profile.joinedDate?.split("T")[0] ?? profile.joinedDate}
                  </p>
                </div>
                <span
                  className="px-3 py-1.5 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
                >
                  {profile.memberStatus}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                className="rounded-xl p-4 text-left"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
                onClick={() => navigate("/xp-details")}
              >
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
                  <Sparkles className="w-3 h-3" /> 총 XP
                </div>
                <p className="text-3xl font-bold" style={{ color: "#10B981" }}>
                  {profile.currentXp}
                </p>
              </button>
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
              >
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
                  <CheckCircle className="w-3 h-3" /> 출석 횟수
                </div>
                <p className="text-3xl font-bold" style={{ color: "#0F4C3A" }}>
                  {profile.attendanceCount}회
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
              >
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
                  <Calendar className="w-3 h-3" /> 행사 참여
                </div>
                <p className="text-3xl font-bold" style={{ color: "#0F4C3A" }}>
                  {profile.eventCount}회
                </p>
              </div>
              <div
                className="rounded-xl p-4"
                style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
              >
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: "#6B7280" }}>
                  <Trophy className="w-3 h-3" /> 현재 순위
                </div>
                <p className="text-3xl font-bold" style={{ color: "#0F4C3A" }}>
                  #{profile.ranking}
                </p>
              </div>
            </div>

            <section>
              <h2 className="font-bold mb-3" style={{ color: "#0F4C3A" }}>
                업적
              </h2>
              <div className="space-y-3">
                {achievements.map((a) => (
                  <div
                    key={a.id}
                    className="rounded-xl p-4"
                    style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: "#D1FAE5" }}
                      >
                        {a.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold" style={{ color: "#0F4C3A" }}>
                          {a.title}
                        </h3>
                        <p className="text-sm mb-2" style={{ color: "#6B7280" }}>
                          {a.description}
                        </p>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs" style={{ color: "#6B7280" }}>
                            진행률
                          </span>
                          <span className="text-xs font-medium" style={{ color: "#0F4C3A" }}>
                            {a.progress} / {a.total}
                          </span>
                        </div>
                        <div className="h-2 rounded-full" style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}>
                          <div
                            className="h-full rounded-full transition-all"
                            style={{
                              width: `${Math.min((a.progress / a.total) * 100, 100)}%`,
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

            {profile.recentActivities?.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold" style={{ color: "#0F4C3A" }}>
                    최근 활동
                  </h2>
                  <button className="text-sm flex items-center gap-1" style={{ color: "#10B981" }}>
                    더보기
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="space-y-3">
                  {profile.recentActivities.slice(0, 5).map((activity) => (
                    <div
                      key={activity.activityId}
                      className="rounded-xl p-4 flex items-center justify-between"
                      style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
                    >
                      <div>
                        <h3 className="font-semibold text-sm" style={{ color: "#0F4C3A" }}>
                          {activity.title}
                        </h3>
                        <p className="text-xs" style={{ color: "#6B7280" }}>
                          {activity.type} · {activity.createdAt?.split("T")[0]}
                        </p>
                      </div>
                      <span
                        className="px-2 py-1 rounded-lg text-sm font-semibold"
                        style={{ backgroundColor: "#D1FAE5", color: "#10B981" }}
                      >
                        +{activity.earnedXp}XP
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}

        {!loading && (
          <div className="space-y-2">
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#D1FAE5", border: "1px solid #10B981" }}
              onClick={() => {
                setShowXpModal(true);
                setXpResult(null);
              }}
            >
              <Sparkles className="w-5 h-5" style={{ color: "#10B981" }} />
              <span className="font-medium" style={{ color: "#0F4C3A" }}>
                XP 요청하기
              </span>
            </button>
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
              onClick={() => {
                window.location.href = "mailto:contact@coma-room.com";
              }}
            >
              <Mail className="w-5 h-5" style={{ color: "#6B7280" }} />
              <span style={{ color: "#0F4C3A" }}>운영진에게 문의하기</span>
            </button>
            <button
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}
              onClick={handleLogout}
            >
              <LogOut className="w-5 h-5" style={{ color: "#E7000B" }} />
              <span style={{ color: "#E7000B" }}>로그아웃</span>
            </button>
          </div>
        )}

        {showXpModal && (
          <div
            className="fixed inset-0 z-50 flex items-end justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.4)" }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowXpModal(false);
            }}
          >
            <div className="w-full max-w-md rounded-t-2xl p-6 space-y-4" style={{ backgroundColor: "#FFFFFF" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold" style={{ color: "#0F4C3A" }}>
                  XP 요청하기
                </h2>
                <button onClick={() => setShowXpModal(false)}>
                  <X className="w-5 h-5" style={{ color: "#6B7280" }} />
                </button>
              </div>
              <p className="text-sm" style={{ color: "#6B7280" }}>
                활동 내용을 작성하면 운영진이 검토 후 XP를 지급합니다.
              </p>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#0F4C3A" }}>
                  요청 XP 수량
                </label>
                <input
                  type="number"
                  min={1}
                  value={xpAmount}
                  onChange={(e) => setXpAmount(e.target.value)}
                  placeholder="예: 5"
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{ border: "1px solid #D1FAE5", backgroundColor: "#F8FFFE", color: "#0F4C3A" }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1" style={{ color: "#0F4C3A" }}>
                  요청 사유
                </label>
                <textarea
                  value={xpReason}
                  onChange={(e) => setXpReason(e.target.value)}
                  placeholder="활동 내용을 자세히 적어 주세요."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                  style={{ border: "1px solid #D1FAE5", backgroundColor: "#F8FFFE", color: "#0F4C3A" }}
                />
              </div>

              {xpResult && (
                <p
                  className="text-sm text-center font-medium"
                  style={{ color: xpResult.ok ? "#10B981" : "#E7000B" }}
                >
                  {xpResult.message}
                </p>
              )}

              <button
                className="w-full py-3 rounded-xl text-white font-medium flex items-center justify-center gap-2"
                style={{ backgroundColor: xpSubmitting ? "#6B7280" : "#10B981" }}
                onClick={handleXpSubmit}
                disabled={xpSubmitting}
              >
                {xpSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                {xpSubmitting ? "요청 중..." : "요청하기"}
              </button>
            </div>
          </div>
        )}
      </main>

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
