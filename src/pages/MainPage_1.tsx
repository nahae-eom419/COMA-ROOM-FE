import { Bell, User, Menu, Sparkles, Calendar, Clock, MapPin, ArrowRight, MessageSquare, Vote, Home, CalendarDays, Megaphone, UserCircle, Mail, Github, CalendarCheck, BookOpen, Images, Settings, Users } from "lucide-react";
import comaLogo from "@/assets/coma-logo.png";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { apiFetch } from "@/api/client";
import { useSchedule } from "@/contexts/ScheduleContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type UpcomingEvent = {
  title: string;
  date: string;
  dayOfWeek: string;
  time: string;
  location: string;
  rewardXp: number;
};

type Notice = {
  content: string;
  date: string;
  title: string;
};

type VotePoll = {
  description: string;
  remainingDays: number;
  rewardXp: number;
  title: string;
  voteId: number;
};

type MainData = {
  currentXp: number;
  myRank: number;
  notice: Notice | null;
  remainingXp: number;
  semester: string;
  statAttendanceCount: number;
  statEventCount: number;
  upcomingEvent: UpcomingEvent | null;
  userName: string;
  votePoll: VotePoll | null;
};

const MainPage = () => {
  const navigate = useNavigate();
  const { mainScheduleJoined, toggleMainSchedule, mainScheduleParticipants } = useSchedule();

  const [mainData, setMainData] = useState<MainData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMain = async () => {
      try {
        const data = await apiFetch<MainData>("/api/member/main");
        setMainData(data);
      } catch (e) {
        console.error("메인 데이터 조회 실패:", e);
      } finally {
        setLoading(false);
      }
    };
    fetchMain();
  }, []);

  const displayXP = mainData?.currentXp ?? 0;
  const displayRank = mainData?.myRank ?? 0;
  const attendanceCount = mainData?.statAttendanceCount ?? 0;
  const eventCount = mainData?.statEventCount ?? 0;
  const semester = mainData?.semester ?? "";
  const userName = mainData?.userName ?? "";
  const remainingXp = mainData?.remainingXp ?? 0;
  const xpProgressPercent = remainingXp > 0
    ? Math.min(100, Math.round((displayXP / (displayXP + remainingXp)) * 100))
    : 100;

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FFFE' }}>
      {/* Header */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-4 py-3" style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #D1FAE5' }}>
        <div className="flex items-center gap-2">
          <img src={comaLogo} alt="COMA Logo" className="w-8 h-8 rounded-lg" />
          <span className="font-bold text-lg" style={{ color: '#0F4C3A' }}>COMA-ROOM</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/notifications')}>
            <Bell className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
          <button onClick={() => navigate('/profile')}>
            <User className="w-5 h-5" style={{ color: '#6B7280' }} />
          </button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Menu className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white border border-gray-200 shadow-lg rounded-lg z-[100]">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/schedule')}>
                <CalendarCheck className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#0F4C3A' }}>일정</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/vote-list')}>
                <Vote className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#0F4C3A' }}>투표</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/study')}>
                <BookOpen className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#0F4C3A' }}>스터디</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/album')}>
                <Images className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#0F4C3A' }}>앨범</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate('/settings')}>
                <Settings className="w-4 h-4" style={{ color: '#6B7280' }} />
                <span style={{ color: '#0F4C3A' }}>설정</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 pb-20 space-y-5">

        {loading ? (
          <div className="text-center py-10 text-sm" style={{ color: '#6B7280' }}>불러오는 중...</div>
        ) : (
          <>
            {/* Welcome Card */}
            <div className="rounded-2xl p-5 text-white" style={{ background: 'linear-gradient(135deg, #10B981 0%, #0A6647 100%)' }}>
              <p className="text-sm opacity-90 mb-1">{semester}</p>
              <h1 className="text-xl font-bold mb-3">안녕하세요, {userName} 님! 👋</h1>

              <div className="flex items-center gap-3 mb-2">
                <span className="px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                  <Sparkles className="w-3 h-3" /> {displayXP} XP
                </span>
                <span className="text-sm opacity-90">나의 XP : {displayXP}</span>
              </div>

              <p className="text-xs opacity-80 mb-2">재등록 요건까지 : {remainingXp} XP</p>
              <div className="w-full h-2 rounded-full mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }}>
                <div className="h-full rounded-full" style={{ width: `${xpProgressPercent}%`, backgroundColor: '#FFFFFF' }}></div>
              </div>

              <button
                className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{ backgroundColor: '#0A6647', color: '#FFFFFF' }}
                onClick={() => navigate('/attendance')}
              >
                <Sparkles className="w-4 h-4" />
                오늘의 출석 체크
                <ArrowRight className="w-4 h-4" />
              </button>

              <p className="text-center text-xs mt-3 opacity-80">출석하면 3XP를 받아요</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
                  <Sparkles className="w-3 h-3" /> 총 XP
                </div>
                <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{displayXP}</p>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
                  <span>✓</span> 출석 횟수
                </div>
                <p className="text-3xl font-bold" style={{ color: '#0F4C3A' }}>{attendanceCount}회</p>
              </div>
              <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
                  <Calendar className="w-3 h-3" /> 행사 참여
                </div>
                <p className="text-3xl font-bold" style={{ color: '#0F4C3A' }}>{eventCount}회</p>
              </div>
              <div
                className="rounded-xl p-4 cursor-pointer hover:shadow-md transition-shadow"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
                onClick={() => navigate('/leaderboard')}
              >
                <div className="flex items-center gap-1 text-xs mb-1" style={{ color: '#6B7280' }}>
                  <span>🎓</span> 이번 학기
                </div>
                <p className="text-3xl font-bold" style={{ color: '#0F4C3A' }}>#{displayRank}</p>
              </div>
            </div>

            {/* 다가오는 일정 */}
            {mainData?.upcomingEvent && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold flex items-center gap-2" style={{ color: '#0F4C3A' }}>
                    <Calendar className="w-4 h-4" /> 다가오는 일정
                  </h2>
                  <button className="text-sm flex items-center gap-1" style={{ color: '#10B981' }} onClick={() => navigate('/schedule-list')}>
                    전체보기 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold" style={{ color: '#0F4C3A' }}>{mainData.upcomingEvent.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs flex items-center gap-1" style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
                      <Sparkles className="w-3 h-3" /> {mainData.upcomingEvent.rewardXp} XP
                    </span>
                  </div>
                  <div className="space-y-1 text-sm mb-3" style={{ color: '#6B7280' }}>
                    <p className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {mainData.upcomingEvent.date} ({mainData.upcomingEvent.dayOfWeek})</p>
                    <p className="flex items-center gap-2"><Clock className="w-4 h-4" /> {mainData.upcomingEvent.time}</p>
                    <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {mainData.upcomingEvent.location}</p>
                    <p className="flex items-center gap-2"><Users className="w-4 h-4" /> {mainScheduleParticipants}명 참여</p>
                  </div>
                  <button
                    className="w-full py-3 rounded-xl font-semibold text-sm text-white transition-all"
                    style={{ backgroundColor: mainScheduleJoined ? '#10B981' : '#0F4C3A' }}
                    onClick={toggleMainSchedule}
                  >
                    {mainScheduleJoined ? '이따 만나요! 👋' : '참여하기'}
                  </button>
                </div>
              </section>
            )}

            {/* 공지사항 */}
            {mainData?.notice && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold flex items-center gap-2" style={{ color: '#10B981' }}>
                    <MessageSquare className="w-4 h-4" /> 공지사항
                  </h2>
                  <button className="text-sm flex items-center gap-1" style={{ color: '#10B981' }} onClick={() => navigate('/notice')}>
                    자세히 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#D1FAE5' }}>
                      <Megaphone className="w-5 h-5" style={{ color: '#10B981' }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-sm mb-1" style={{ color: '#0F4C3A' }}>{mainData.notice.title}</h3>
                      <p className="text-xs mb-2" style={{ color: '#6B7280' }}>{mainData.notice.content}</p>
                      <p className="text-xs">
                        <span style={{ color: '#10B981' }}>운영</span>
                        <span style={{ color: '#6B7280' }}> {mainData.notice.date}</span>
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* 진행 중인 투표 */}
            {mainData?.votePoll && (
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="font-bold flex items-center gap-2" style={{ color: '#2B7FFF' }}>
                    <Vote className="w-4 h-4" /> 진행 중인 투표
                  </h2>
                  <button className="text-sm flex items-center gap-1" style={{ color: '#10B981' }} onClick={() => navigate('/vote-list')}>
                    전체보기 <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
                <div className="rounded-xl p-4" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold" style={{ color: '#0F4C3A' }}>{mainData.votePoll.title}</h3>
                    <span className="px-2 py-1 rounded-full text-xs flex items-center gap-1" style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}>
                      <Sparkles className="w-3 h-3" /> +{mainData.votePoll.rewardXp} XP
                    </span>
                  </div>
                  <p className="text-sm mb-1" style={{ color: '#6B7280' }}>{mainData.votePoll.description}</p>
                  <p className="text-xs mb-3 flex items-center gap-2" style={{ color: '#6B7280' }}>
                    <span>⏰ {mainData.votePoll.remainingDays}일 남음</span>
                  </p>
                  <button
                    className="px-4 py-2 rounded-lg font-semibold text-sm"
                    style={{ backgroundColor: '#0F4C3A', color: '#FFFFFF' }}
                    onClick={() => navigate('/vote-list')}
                  >
                    투표하기
                  </button>
                </div>
              </section>
            )}
          </>
        )}

        {/* Quote */}
        <div className="text-center py-4">
          <p className="text-sm" style={{ color: '#6B7280' }}>coma-room은 참여를 장려하고 있어요. ✨</p>
          <p className="text-sm" style={{ color: '#6B7280' }}>온 사람을 기록하고, 함께한 순간을 남겨요.</p>
        </div>

        {/* Footer */}
        <footer className="rounded-xl p-6 space-y-6" style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}>
          <div>
            <div className="flex items-center gap-2 mb-2">
              <img src={comaLogo} alt="COMA Logo" className="w-8 h-8 rounded-lg" />
              <span className="font-bold" style={{ color: '#0F4C3A' }}>COMA-ROOM</span>
            </div>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              COMA 동아리 회원들의 활동을 관리하고, 소통하며, 성장하는 공간입니다.
            </p>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2" style={{ color: '#0F4C3A' }}>바로가기</h4>
            <ul className="space-y-1 text-sm" style={{ color: '#6B7280' }}>
              <li>공지사항</li>
              <li>자주 묻는 질문</li>
              <li>이용약관</li>
              <li>개인정보처리방침</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm mb-2" style={{ color: '#0F4C3A' }}>문의하기</h4>
            <ul className="space-y-1 text-sm" style={{ color: '#6B7280' }}>
              <li className="flex items-center gap-2"><Mail className="w-4 h-4" /> contact@coma-room.com</li>
              <li className="flex items-center gap-2"><Github className="w-4 h-4" /> github.com/COMA-ROOM</li>
            </ul>
          </div>
          <div className="text-center text-xs pt-4 border-t" style={{ borderColor: '#D1FAE5', color: '#6B7280' }}>
            <p>© 2026 COMA-ROOM. All rights reserved.</p>
            <p>Made with <span style={{ color: '#EF4444' }}>♥</span> by COMA Team</p>
          </div>
        </footer>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t z-50" style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}>
        <button className="flex flex-col items-center gap-1">
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

export default MainPage;