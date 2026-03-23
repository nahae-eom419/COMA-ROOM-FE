import { ArrowLeft, Bell, User, Menu, Trophy, Crown, Sparkles, Home, CalendarDays, Megaphone, UserCircle, CalendarCheck, Vote, BookOpen, Images, Settings } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useNavigate } from "react-router-dom";
import { useLeaderboard } from "@/contexts/LeaderboardContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Leaderboard = () => {
  const navigate = useNavigate();
  const { rankings, myRanking } = useLeaderboard();

  // 상위 3명
  const top3 = rankings.slice(0, 3);

  const getRankBadgeColor = (rank: number) => {
    if (rank === 1) return { bg: '#F0B100', text: '#FFFFFF' };
    if (rank === 2) return { bg: '#99A1AF', text: '#FFFFFF' };
    if (rank === 3) return { bg: '#BB4D00', text: '#FFFFFF' };
    return { bg: '#10B981', text: '#FFFFFF' };
  };

  const getRankIcon = (rank: number) => {
    if (rank <= 3) {
      return <Trophy className="w-4 h-4" style={{ color: rank === 1 ? '#F0B100' : rank === 2 ? '#99A1AF' : '#BB4D00' }} />;
    }
    return null;
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FFFE' }}>
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#10B981' }}>
        <div className="flex items-center gap-2">
          <ComaLogo size="sm" />
          <span className="font-bold text-lg text-white">COMA-ROOM</span>
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
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-5">
        {/* Back Button */}
        <button 
          className="flex items-center gap-2 text-sm"
          style={{ color: '#6B7280' }}
          onClick={() => navigate('/main')}
        >
          <ArrowLeft className="w-4 h-4" />
          메인페이지
        </button>

        {/* Title Section */}
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#0F4C3A' }}>이번 학기 랭킹</h1>
          <p className="text-sm" style={{ color: '#6B7280' }}>XP 기반 부원들의 활동 순위를 확인하세요</p>
        </div>

        {/* My Ranking Card */}
        {myRanking && (
          <div 
            className="rounded-2xl p-4"
            style={{ backgroundColor: '#FFFFFF', border: '2px solid #10B981' }}
          >
            <div className="flex items-center gap-1 mb-3">
              <Sparkles className="w-4 h-4" style={{ color: '#10B981' }} />
              <span className="text-sm font-medium" style={{ color: '#10B981' }}>나의 순위</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                >
                  {myRanking.rank}
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: '#0F4C3A' }}>{myRanking.name}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{myRanking.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{myRanking.xp}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Podium Section */}
        {top3.length >= 3 && (
          <div 
            className="rounded-2xl p-6"
            style={{ background: 'linear-gradient(135deg, #10B981 0%, #0A6647 100%)' }}
          >
            <div className="flex items-end justify-center gap-3">
              {/* 2nd Place */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-20 h-24 rounded-t-lg flex flex-col items-center justify-center"
                  style={{ backgroundColor: '#99A1AF' }}
                >
                  <span className="text-white font-bold text-lg">2nd</span>
                  <span className="text-white text-sm font-medium">{top3[1].anonymousName}</span>
                  <span className="text-white text-xs opacity-80">{top3[1].xp} XP</span>
                </div>
              </div>

              {/* 1st Place */}
              <div className="flex flex-col items-center">
                <Crown className="w-6 h-6 mb-1" style={{ color: '#F0B100' }} />
                <div 
                  className="w-24 h-32 rounded-t-lg flex flex-col items-center justify-center"
                  style={{ backgroundColor: '#F0B100' }}
                >
                  <span className="text-white font-bold text-xl">1st</span>
                  <span className="text-white text-sm font-medium">{top3[0].anonymousName}</span>
                  <span className="text-white text-xs opacity-80">{top3[0].xp} XP</span>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="flex flex-col items-center">
                <div 
                  className="w-20 h-20 rounded-t-lg flex flex-col items-center justify-center"
                  style={{ backgroundColor: '#BB4D00' }}
                >
                  <span className="text-white font-bold text-lg">3rd</span>
                  <span className="text-white text-sm font-medium">{top3[2].anonymousName}</span>
                  <span className="text-white text-xs opacity-80">{top3[2].xp} XP</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings */}
        <section>
          <h2 className="font-bold text-lg mb-3" style={{ color: '#0F4C3A' }}>전체 순위</h2>
          <div className="space-y-3">
            {rankings.map((item) => (
              <div
                key={item.rank}
                className="rounded-xl p-4 flex items-center justify-between"
                style={{ 
                  backgroundColor: item.isMe ? '#D1FAE5' : '#FFFFFF', 
                  border: item.isMe ? '2px solid #10B981' : '1px solid #D1FAE5' 
                }}
              >
                <div className="flex items-center gap-3">
                  {getRankIcon(item.rank)}
                  <div 
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ 
                      backgroundColor: getRankBadgeColor(item.rank).bg, 
                      color: getRankBadgeColor(item.rank).text 
                    }}
                  >
                    {item.rank}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold" style={{ color: '#0F4C3A' }}>
                        {item.isMe ? item.name : item.anonymousName}
                      </p>
                      {item.isMe && (
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                        >
                          나
                        </span>
                      )}
                    </div>
                    <p className="text-xs" style={{ color: '#6B7280' }}>{item.department}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold" style={{ color: '#10B981' }}>{item.xp}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>XP</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Ranking Info Box */}
        <div 
          className="rounded-xl p-4"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <h3 className="font-bold text-sm mb-2" style={{ color: '#0F4C3A' }}>랭킹 안내</h3>
          <ul className="space-y-1 text-xs" style={{ color: '#0F4C3A' }}>
            <li className="flex items-start gap-2">
              <span style={{ color: '#10B981' }}>•</span>
              랭킹은 이번 학기 획득한 XP를 기준으로 산정됩니다
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#10B981' }}>•</span>
              개인정보 보호를 위해 이름은 익명으로 표시됩니다
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#10B981' }}>•</span>
              본인의 정보는 전체 이름이 표시됩니다
            </li>
            <li className="flex items-start gap-2">
              <span style={{ color: '#10B981' }}>•</span>
              XP는 출석, 행사 참여, 투표 등으로 획득할 수 있습니다
            </li>
          </ul>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="flex items-center justify-around py-3 border-t"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}
      >
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/main')}>
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

export default Leaderboard;
