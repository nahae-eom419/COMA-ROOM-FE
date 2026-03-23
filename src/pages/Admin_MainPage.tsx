import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Users, Sparkles, CheckCircle, Calendar, ArrowRight, LayoutDashboard, UserCheck, Megaphone, BarChart3, MessageSquare, PartyPopper, ClipboardCheck } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Admin_MainPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<any>(null);
  const [activities, setActivities] = useState<any[]>([]);
  const [rankings, setRankings] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await fetch("http://localhost:3000/api/admin/main");
        const data = await res.json();

        setStats(data.dashboardStats);
        setActivities(data.recentActivityLogs);
        setRankings(data.semesterRankings);
      } catch (e) {
        console.error(e);
      }
    };

    fetchDashboard();
  }, []);

  const pendingCount = activities.filter(
    a => a.status === "PENDING"
  ).length;

  const handleApprove = async (id: number) => {
    await fetch(`http://localhost:3000/api/admin/main/${id}/approve`, {
      method: "PATCH",
    });

    setActivities(prev =>
      prev.map(a =>
        a.id === id ? { ...a, status: "APPROVED" } : a
      )
    );
  };

  const handleReject = async (id: number) => {
    await fetch(`http://localhost:3000/api/admin/main/${id}`, {
      method: "DELETE",
    });

    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const getRankBgColor = (rank: number) => {
    switch (rank) {
      case 1: return "#FEE685";
      case 2: return "#DCFCE7";
      case 3: return "#FEE685";
      default: return "#FFFFFF";
    }
  };

  const getRankTextColor = (rank: number) => {
    switch (rank) {
      case 1: return "#008236";
      case 2: return "#008236";
      case 3: return "#008236";
      default: return "#0F4C3A";
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FFFE' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 px-4 py-3" style={{ backgroundColor: '#10B981' }}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ComaLogo size="sm" />
            <span className="text-white font-bold text-lg">COMA-ROOM</span>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/notifications')}>
              <Bell className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => navigate('/profile')}>
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
                  onClick={() => navigate('/')}
                >
                  <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#0F4C3A' }}>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Admin Mode Badge */}
        <div className="mt-2">
          <span
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#008236', color: '#FFFFFF' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            관리자 모드
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24">
        {/* Welcome Card */}
        <div
          className="rounded-2xl p-5 mb-6"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #008236 100%)' }}
        >
          <p className="text-sm text-white opacity-90 mb-1">2025년 1학기</p>
          <h1 className="text-xl font-bold text-white">안녕하세요, 운영자 님! 👋</h1>
        </div>

        {/* Dashboard Title */}
        <div className="mb-4">
          <h2 className="text-lg font-bold" style={{ color: '#10B981' }}>운영자 대시보드</h2>
          <p className="text-sm" style={{ color: '#6B7280' }}>COMA-ROOM 전체 관리 및 통계를 확인하세요</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div
            className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            onClick={() => navigate('/admin/members')}
          >
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
              <Users className="w-3 h-3" /> 전체 부원
            </div>
            <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{stats?.totalMembers}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>부원 {stats?.totalMembers}명</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
              <Sparkles className="w-3 h-3" /> 총 XP
            </div>
            <p className="text-3xl font-bold" style={{ color: '#0F4C3A' }}>{stats?.totalSemesterXp}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>이번 학기</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
              <CheckCircle className="w-3 h-3" /> 승인 대기
            </div>
            <p className="text-3xl font-bold" style={{ color: '#FE9A00' }}>{stats?.pendingApprovals}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>XP 부여 대기</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
              <Calendar className="w-3 h-3" /> 진행중 일정
            </div>
            <p className="text-3xl font-bold" style={{ color: '#0F4C3A' }}>{stats?.activeSchedules}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>투표 2건</p>
          </div>
        </div>

        {/* Quick Management Section */}
        <h3 className="font-bold mb-3" style={{ color: '#0F4C3A' }}>빠른 관리</h3>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {/* 부원 관리 */}
          <div
            className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            onClick={() => navigate('/admin/members')}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: '#D1FAE5' }}
            >
              <Users className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <h4 className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>부원 관리</h4>
            <p className="text-xs" style={{ color: '#6B7280' }}>전체 부원 및 XP 관리</p>
          </div>

          {/* XP 관리 */}
          <div
            className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            onClick={() => navigate('/admin/xp')}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: '#D1FAE5' }}
            >
              <Sparkles className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <h4 className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>XP 관리</h4>
            <p className="text-xs" style={{ color: '#6B7280' }}>XP 부여 및 승인</p>
          </div>

          {/* 출석 관리 */}
          <div
            className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            onClick={() => navigate('/admin/attendance')}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: '#D1FAE5' }}
            >
              <UserCheck className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <h4 className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>출석 관리</h4>
            <p className="text-xs" style={{ color: '#6B7280' }}>출석 확인 및 수정</p>
          </div>

          {/* 공지사항 */}
          <div
            className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            onClick={() => navigate('/admin/vote')}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: '#D1FAE5' }}
            >
              <MessageSquare className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <h4 className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>투표</h4>
            <p className="text-xs" style={{ color: '#6B7280' }}>튜표 생성 및 관리</p>
          </div>

          {/* 행사 관리 */}
          <div
            className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: '#D1FAE5' }}
            >
              <PartyPopper className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <h4 className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>행사 관리</h4>
            <p className="text-xs" style={{ color: '#6B7280' }}>행사 생성 및 관리</p>
          </div>

          {/* 통계 조회 */}
          <div
            className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
              style={{ backgroundColor: '#D1FAE5' }}
            >
              <BarChart3 className="w-5 h-5" style={{ color: '#10B981' }} />
            </div>
            <h4 className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>통계 조회</h4>
            <p className="text-xs" style={{ color: '#6B7280' }}>활동 통계 및 분석</p>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold" style={{ color: '#0F4C3A' }}>최근 활동</h3>
          {pendingCount > 0 && (
            <span
              className="px-3 py-1 rounded-full text-xs font-medium"
              style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
            >
              {pendingCount} 승인 대기
            </span>
          )}
        </div>

        <div className="space-y-3 mb-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>{activity.userName}</span>
                    <span
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                    >
                      {activity.type}
                    </span>
                    {activity.status === "approved" && (
                      <span
                        className="px-2 py-0.5 rounded text-xs font-medium"
                        style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                      >
                        승인완료
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{activity.description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs" style={{ color: '#6B7280' }}>{activity.timeAgo}</span>
                    <span className="text-xs font-medium" style={{ color: '#10B981' }}>+{activity.grantedXp} XP</span>
                  </div>
                </div>
                {activity.status === "PENDING" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(activity.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                    >
                      승인
                    </button>
                    <button
                      onClick={() => handleReject(activity.id)}
                      className="px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ backgroundColor: '#FFC9C9', color: '#E7000B' }}
                    >
                      거부
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Semester Ranking Section */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold" style={{ color: '#0F4C3A' }}>이번 학기 랭킹</h3>
          <button
            className="text-sm flex items-center gap-1"
            style={{ color: '#10B981' }}
            onClick={() => navigate('/leaderboard')}
          >
            전체보기 <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="space-y-2 mb-6">
          {rankings.map((member) => (
            <div
              key={member.rank}
              className="rounded-xl p-3 flex items-center gap-3"
              style={{
                backgroundColor: getRankBgColor(member.rank),
                border: member.rank > 3 ? '1px solid #D1FAE5' : 'none'
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm"
                style={{
                  backgroundColor: member.rank <= 3 ? '#10B981' : '#DCFCE7',
                  color: member.rank <= 3 ? '#FFFFFF' : '#10B981'
                }}
              >
                {member.rank}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm" style={{ color: getRankTextColor(member.rank) }}>
                    {member.name}
                  </span>
                  <span className="text-xs" style={{ color: '#6B7280' }}>{member.studentId}</span>
                </div>
                <p className="text-xs" style={{ color: '#6B7280' }}>{member.department}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold" style={{ color: '#10B981' }}>{member.totalXp}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>XP</p>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}
      >
        <button className="flex flex-col items-center gap-1">
          <LayoutDashboard className="w-5 h-5" style={{ color: '#10B981' }} />
          <span className="text-xs font-medium" style={{ color: '#10B981' }}>대시보드</span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/admin/members')}
        >
          <Users className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>부원</span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/admin/xp')}
        >
          <Sparkles className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>XP</span>
        </button>
        <button
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/admin/attendance')}
        >
          <ClipboardCheck className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>출석</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/admin/notice')}>
          <Megaphone className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>공지</span>
        </button>
      </nav>
    </div>
  );
};

export default Admin_MainPage;
