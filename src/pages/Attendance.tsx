import { Bell, User, Menu, ArrowLeft, Calendar, MapPin, Clock, CheckCircle, XCircle, Trophy, Sparkles, Award, Home, CalendarDays, Megaphone, UserCircle, CalendarCheck, Vote, BookOpen, Images, Settings } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const attendanceData = [
  { id: 8, date: "2025-01-20 오후 7:00", location: "N412", time: "오후 6:58", status: "출석", xp: 3 },
  { id: 7, date: "2025-01-13 오후 7:00", location: "N412", time: "오후 7:02", status: "출석", xp: 3 },
  { id: 6, date: "2025-01-06 오후 7:00", location: "N412", time: null, status: "결석", xp: 0 },
  { id: 5, date: "2024-12-30 오후 7:00", location: "N412", time: "오후 6:55", status: "출석", xp: 3 },
  { id: 4, date: "2024-12-23 오후 7:00", location: "N412", time: null, status: "결석", xp: 0 },
  { id: 3, date: "2024-12-16 오후 7:00", location: "N412", time: "오후 7:01", status: "출석", xp: 3 },
  { id: 2, date: "2024-12-09 오후 7:00", location: "N412", time: "오후 6:52", status: "출석", xp: 3 },
  { id: 1, date: "2024-12-02 오후 7:00", location: "N412", time: "오후 6:59", status: "출석", xp: 3 },
];

const Attendance = () => {
  const navigate = useNavigate();
  
  const totalMeetings = 7;
  const attended = 6;
  const absent = 1;
  const attendanceRate = Math.round((attended / totalMeetings) * 100);
  const totalXP = 18;
  const rank = 6;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FFFE' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#FFFFFF' }}>
        <div className="flex items-center gap-2">
          <ComaLogo size="sm" />
          <span className="font-bold text-lg" style={{ color: '#0F4C3A' }}>COMA-ROOM</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/notifications')}>
            <Bell className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
          <User className="w-5 h-5" style={{ color: '#6B7280' }} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Menu className="w-5 h-5" style={{ color: '#6B7280' }} />
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
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-5">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/main')}
          className="flex items-center gap-1 text-sm"
          style={{ color: '#10B981' }}
        >
          <ArrowLeft className="w-4 h-4" />
          출석으로
        </button>

        {/* Title */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F4C3A' }}>출석 기록</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>나의 출석 현황을 확인하세요</p>
        </div>

        {/* Attendance Rate Card */}
        <div 
          className="rounded-2xl p-5 text-white"
          style={{ background: 'linear-gradient(135deg, #10B981 0%, #0A6647 100%)' }}
        >
          <p className="text-sm opacity-90 mb-1">출석률</p>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-5xl font-bold">{attendanceRate}%</h2>
            <div 
              className="w-14 h-14 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <Trophy className="w-8 h-8" />
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full h-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
            <div 
              className="h-full rounded-full" 
              style={{ width: `${attendanceRate}%`, backgroundColor: '#FFFFFF' }}
            ></div>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{attended}</p>
              <p className="text-xs opacity-80">출석</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{absent}</p>
              <p className="text-xs opacity-80">결석</p>
            </div>
            <div>
              <p className="text-2xl font-bold">{totalMeetings}</p>
              <p className="text-xs opacity-80">전체</p>
            </div>
          </div>
        </div>

        {/* XP and Rank Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
              <Sparkles className="w-3 h-3" /> 획득 XP
            </div>
            <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{totalXP}</p>
          </div>
          <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
            <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
              <Award className="w-3 h-3" /> 출석 순위
            </div>
            <p className="text-3xl font-bold" style={{ color: '#0F4C3A' }}>#{rank}</p>
          </div>
        </div>

        {/* Attendance History */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold" style={{ color: '#0F4C3A' }}>출석 내역</h2>
            <button
              onClick={() => navigate('/attendance/verify')}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white"
              style={{ backgroundColor: '#10B981' }}
            >
              내 출석 확인하기
            </button>
          </div>
          <div className="space-y-3">
            {attendanceData.map((item) => (
              <div 
                key={item.id}
                className="rounded-xl p-4"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
              >
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold" style={{ color: '#0F4C3A' }}>정기모임 #{item.id}</h3>
                  <div className="flex items-center gap-2">
                    {item.status === "출석" ? (
                      <span 
                        className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                        style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                      >
                        <CheckCircle className="w-3 h-3" /> 출석
                      </span>
                    ) : (
                      <span 
                        className="px-2 py-1 rounded-full text-xs flex items-center gap-1"
                        style={{ backgroundColor: '#FFE4E6', color: '#C70036' }}
                      >
                        <XCircle className="w-3 h-3" /> 결석
                      </span>
                    )}
                    {item.xp > 0 && (
                      <span className="text-xs font-medium" style={{ color: '#10B981' }}>+{item.xp} XP</span>
                    )}
                  </div>
                </div>
                <div className="space-y-1 text-sm" style={{ color: '#6B7280' }}>
                  <p className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" /> {item.date}
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" /> {item.location}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" /> 출석: {item.time || "-"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Notice */}
        <div 
          className="rounded-xl p-4"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1" style={{ color: '#0F4C3A' }}>
            💡 출석 안내
          </h3>
          <ul className="text-sm space-y-1" style={{ color: '#0F4C3A' }}>
            <li>• 정시 출석 시 3 XP를 받아요</li>
            <li>• 정기모임 출석 시 QR인증으로 출석체크를 진행해요.</li>
            <li>• 꾸준한 출석으로 XP를 모아보세요!</li>
          </ul>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="flex items-center justify-around py-3 border-t sticky bottom-0"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}
      >
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/main')}
        >
          <Home className="w-5 h-5" style={{ color: '#10B981' }} />
          <span className="text-xs font-medium" style={{ color: '#10B981' }}>홈</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/schedule')}>
          <CalendarDays className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>일정</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/notice')}>
          <Megaphone className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>공지</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/profile')}>
          <UserCircle className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>마이</span>
        </button>
      </nav>
    </div>
  );
};

export default Attendance;
