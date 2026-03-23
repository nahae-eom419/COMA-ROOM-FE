import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, ArrowLeft, TrendingUp, Calendar, Sparkles, Home, CalendarDays, Megaphone, UserCircle, ChevronLeft, ChevronRight, CalendarCheck, Vote, BookOpen, Images, Settings, Lightbulb } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Activity {
  id: number;
  title: string;
  type: "출석" | "행사" | "투표";
  date: string;
  time: string;
  xp: number;
}

const XPDetails = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);

  // XP Summary data
  const xpSummary = {
    currentLevel: 5,
    totalXP: 18,
    currentXP: 18,
    requiredXP: 21,
    thisMonth: 8,
    lastMonth: 10,
    weeklyAverage: 3.6
  };

  // XP Analysis data
  const xpAnalysis = [
    { category: "출석", count: 6, xp: 9, percentage: 50.0, color: "#10B981" },
    { category: "행사", count: 2, xp: 7, percentage: 38.9, color: "#10B981" },
    { category: "투표", count: 1, xp: 2, percentage: 11.1, color: "#10B981" }
  ];

  // Activity history
  const activities: Activity[] = [
    { id: 1, title: "정기모임 #7", type: "출석", date: "12월 30일", time: "19:00", xp: 3 },
    { id: 2, title: "부원 간 식사 인증", type: "행사", date: "12월 28일", time: "18:30", xp: 5 },
    { id: 3, title: "연말 파티", type: "행사", date: "12월 27일", time: "19:00", xp: 5 },
    { id: 4, title: "2025 운영 방향 투표", type: "투표", date: "12월 26일", time: "14:20", xp: 2 },
    { id: 5, title: "정기모임 #6", type: "출석", date: "12월 23일", time: "19:00", xp: 3 },
  ];

  const totalActivities = 15;

  const getTypeColor = (type: string) => {
    switch (type) {
      case "출석":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "행사":
        return { bg: "#FFEDD4", text: "#CA3500" };
      case "투표":
        return { bg: "#FFE4E6", text: "#E7000B" };
      default:
        return { bg: "#D1FAE5", text: "#10B981" };
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
                  onClick={() => navigate('/schedule')}
                >
                  <CalendarCheck className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#0F4C3A' }}>일정</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate('/vote-list')}
                >
                  <Vote className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#0F4C3A' }}>투표</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate('/study')}
                >
                  <BookOpen className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#0F4C3A' }}>스터디</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate('/album')}
                >
                  <Images className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#0F4C3A' }}>앨범</span>
                </DropdownMenuItem>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer hover:bg-gray-50"
                  onClick={() => navigate('/settings')}
                >
                  <Settings className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#0F4C3A' }}>설정</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 pb-24 space-y-5">
        {/* Back Button and Title */}
        <div>
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 mb-2"
            style={{ color: '#0F4C3A' }}
          >
            <ArrowLeft className="w-4 h-4" />
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold text-lg">활동 내역</span>
          </button>
          <p className="text-sm" style={{ color: '#6B7280' }}>나의 모든 활동과 XP 획득 내역을 확인하세요</p>
        </div>

        {/* XP Summary Card */}
        <div 
          className="rounded-2xl p-5"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>현재 레벨</p>
              <p className="text-3xl font-bold" style={{ color: '#10B981' }}>Lv. {xpSummary.currentLevel}</p>
            </div>
            <div className="text-right">
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>총 XP</p>
              <p className="text-3xl font-bold" style={{ color: '#0F4C3A' }}>{xpSummary.totalXP}</p>
            </div>
          </div>

          {/* Progress */}
          <div className="mb-4">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs" style={{ color: '#6B7280' }}>다음 레벨까지</span>
              <span className="text-xs font-medium" style={{ color: '#0F4C3A' }}>
                {xpSummary.currentXP} / {xpSummary.requiredXP} XP
              </span>
            </div>
            <div 
              className="h-2 rounded-full"
              style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}
            >
              <div 
                className="h-full rounded-full transition-all"
                style={{ 
                  width: `${(xpSummary.currentXP / xpSummary.requiredXP) * 100}%`, 
                  backgroundColor: '#10B981' 
                }}
              />
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4 pt-3" style={{ borderTop: '1px solid rgba(16, 185, 129, 0.3)' }}>
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>이번 달</p>
              <p className="text-lg font-bold" style={{ color: '#10B981' }}>+{xpSummary.thisMonth}</p>
            </div>
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>지난 달</p>
              <p className="text-lg font-bold" style={{ color: '#10B981' }}>+{xpSummary.lastMonth}</p>
            </div>
            <div className="text-center">
              <p className="text-xs mb-1" style={{ color: '#6B7280' }}>주간 평균</p>
              <p className="text-lg font-bold" style={{ color: '#0F4C3A' }}>{xpSummary.weeklyAverage}</p>
            </div>
          </div>
        </div>

        {/* XP Analysis Section */}
        <section>
          <h2 className="font-bold mb-3" style={{ color: '#0F4C3A' }}>XP 분석</h2>
          <div 
            className="rounded-xl p-4 space-y-4"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            {xpAnalysis.map((item, index) => (
              <div key={index}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: '#F1F5F9', color: '#6B7280' }}
                    >
                      {item.category}
                    </span>
                    <span className="text-sm" style={{ color: '#6B7280' }}>{item.count}회</span>
                  </div>
                  <span className="text-sm font-medium" style={{ color: '#0F4C3A' }}>
                    {item.xp} XP <span style={{ color: '#6B7280' }}>({item.percentage}%)</span>
                  </span>
                </div>
                <div 
                  className="h-2 rounded-full"
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.2)' }}
                >
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${item.percentage}%`, 
                      backgroundColor: item.color 
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Activity History Section */}
        <section>
          <h2 className="font-bold mb-3" style={{ color: '#0F4C3A' }}>전체 활동 ({totalActivities})</h2>
          <div className="space-y-3">
            {activities.map((activity) => {
              const typeColors = getTypeColor(activity.type);
              return (
                <div 
                  key={activity.id}
                  className="rounded-xl p-4"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: typeColors.bg, color: typeColors.text }}
                    >
                      {activity.type}
                    </span>
                    <span 
                      className="flex items-center gap-1 text-xs font-medium"
                      style={{ color: '#10B981' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      +{activity.xp}XP
                    </span>
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: '#0F4C3A' }}>{activity.title}</h3>
                  <div className="flex items-center gap-1 text-xs" style={{ color: '#6B7280' }}>
                    <Calendar className="w-3 h-3" />
                    <span>{activity.date} · {activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E2E2' }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: '#6B7280' }} />
            </button>
            
            {[1, 2].map((page) => (
              <button
                key={page}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
                style={{ 
                  backgroundColor: currentPage === page ? '#10B981' : '#FFFFFF',
                  color: currentPage === page ? '#FFFFFF' : '#6B7280',
                  border: currentPage === page ? 'none' : '1px solid #E2E2E2'
                }}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            
            <button 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E2E2' }}
              onClick={() => setCurrentPage(Math.min(2, currentPage + 1))}
            >
              <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
            </button>
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>1-10 / 전체 {totalActivities}개</p>
        </div>

        {/* XP Info Box */}
        <div 
          className="rounded-xl p-4"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1" style={{ color: '#10B981' }}>
            <Lightbulb className="w-4 h-4" /> XP 안내
          </h3>
          <ul className="text-sm space-y-1" style={{ color: '#0F4C3A' }}>
            <li>• XP는 출석, 행사 참여, 투표 등으로 획득할 수 있어요</li>
            <li>• 레벨이 오르면 특별한 혜택을 받을 수 있습니다</li>
            <li>• 활발한 활동으로 랭킹 상위권에 도전하세요!</li>
          </ul>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}
      >
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/main')}
        >
          <Home className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>홈</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/schedule')}
        >
          <CalendarDays className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>일정</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/notice')}>
          <Megaphone className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>공지</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/profile')}>
          <UserCircle className="w-5 h-5" style={{ color: '#10B981' }} />
          <span className="text-xs font-medium" style={{ color: '#10B981' }}>마이</span>
        </button>
      </nav>
    </div>
  );
};

export default XPDetails;
