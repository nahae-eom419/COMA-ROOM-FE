import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Megaphone, MapPin, Clock, Key, Calendar, Home, CalendarDays, UserCircle, CalendarCheck, Vote, BookOpen, Images, Settings, Lightbulb, Pin } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useNotice, Notice } from "@/contexts/NoticeContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const NoticePage = () => {
  const navigate = useNavigate();
  const { notices } = useNotice();
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);

  // 공개된 공지만 표시 (고정 공지가 위로)
  const publicNotices = notices
    .filter(n => n.isPublic)
    .sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const getCategoryStyle = (category: string) => {
    switch (category) {
      case "운영":
        return { bg: "#D1FAE5", text: "#10B981" };
      case "일정":
        return { bg: "#DBEAFE", text: "#1447E6" };
      case "행사":
        return { bg: "#FEE685", text: "#BB4D00" };
      case "안내":
        return { bg: "#E9D4FF", text: "#8200DB" };
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
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Megaphone className="w-5 h-5" style={{ color: '#10B981' }} />
            <h1 className="text-xl font-bold" style={{ color: '#10B981' }}>공지사항</h1>
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>동아리 소식과 공지를 확인하세요.</p>
        </div>

        {/* Location Info Card */}
        <div 
          className="rounded-2xl p-5"
          style={{ background: 'linear-gradient(135deg, #1D293D 0%, #0F172B 100%)' }}
        >
          {/* Title */}
          <div className="flex items-center gap-2 mb-4">
            <div 
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
            >
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold">동아리방 위치</h2>
              <p className="text-white text-xs opacity-80">COMA-ROOM 찾아오는 길</p>
            </div>
          </div>

          {/* Location Details */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <MapPin className="w-4 h-4 opacity-80" />
              <div>
                <p className="text-sm font-medium">동아리방</p>
                <p className="text-xs opacity-80">니콜스관 N456호</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-white">
              <Clock className="w-4 h-4 opacity-80" />
              <div>
                <p className="text-sm font-medium">운영 시간</p>
                <p className="text-xs opacity-80">평일 09:00 - 21:00</p>
                <p className="text-xs opacity-80">주말 12:00 - 18:00</p>
              </div>
            </div>

            <div 
              className="flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
            >
              <Key className="w-4 h-4 text-white opacity-80" />
              <p className="text-white text-xs">동아리방 비밀번호는 0456입니다!</p>
            </div>
          </div>
        </div>

        {/* Recent Notices Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <Megaphone className="w-4 h-4" style={{ color: '#0F4C3A' }} />
            <h2 className="font-bold" style={{ color: '#0F4C3A' }}>최근 공지</h2>
          </div>
          
          <div className="space-y-3">
            {publicNotices.length === 0 ? (
              <div 
                className="rounded-xl p-6 text-center"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
              >
                <p className="text-sm" style={{ color: '#6B7280' }}>등록된 공지사항이 없습니다.</p>
              </div>
            ) : (
              publicNotices.map((notice) => {
                const categoryStyle = getCategoryStyle(notice.category);
                return (
                  <div 
                    key={notice.id}
                    className="rounded-xl p-4 cursor-pointer transition-all hover:shadow-md"
                    style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
                    onClick={() => setSelectedNotice(notice)}
                  >
                    {/* Title Row */}
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        {notice.isPinned && (
                          <Pin className="w-4 h-4" style={{ color: '#FE9A00' }} />
                        )}
                        <h3 className="font-semibold text-sm" style={{ color: '#0F4C3A' }}>
                          {notice.title}
                        </h3>
                      </div>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium flex-shrink-0"
                        style={{ backgroundColor: categoryStyle.bg, color: categoryStyle.text }}
                      >
                        {notice.category}
                      </span>
                    </div>

                    {/* Important Badge */}
                    {notice.type === "중요" && (
                      <div className="flex items-center gap-1 mb-2">
                        <span 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: '#10B981' }}
                        />
                        <span className="text-xs" style={{ color: '#10B981' }}>중요 공지</span>
                      </div>
                    )}

                    {/* Content */}
                    <p 
                      className="text-sm mb-3 line-clamp-2"
                      style={{ color: '#6B7280' }}
                    >
                      {notice.content}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between text-xs" style={{ color: '#90A1B9' }}>
                      <span>작성: {notice.author}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {notice.date}
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Info Box */}
        <div 
          className="rounded-xl p-4"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1" style={{ color: '#10B981' }}>
            <Lightbulb className="w-4 h-4" /> 공지사항 안내
          </h3>
          <ul className="text-sm space-y-1" style={{ color: '#0F4C3A' }}>
            <li>• 중요 공지는 상단에 고정됩니다.</li>
            <li>• 새로운 공지가 올라오면 알림을 받아요.</li>
            <li>• 공지사항은 운영진만 작성할 수 있어요.</li>
          </ul>
        </div>
      </main>

      {/* Notice Detail Modal */}
      <Dialog open={!!selectedNotice} onOpenChange={() => setSelectedNotice(null)}>
        <DialogContent className="max-w-[90%] sm:max-w-md rounded-2xl" style={{ backgroundColor: '#FFFFFF' }}>
          {selectedNotice && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-2 mb-2">
                  <span 
                    className="px-2 py-1 rounded text-xs font-medium"
                    style={{ 
                      backgroundColor: getCategoryStyle(selectedNotice.category).bg, 
                      color: getCategoryStyle(selectedNotice.category).text 
                    }}
                  >
                    {selectedNotice.category}
                  </span>
                  {selectedNotice.type === "중요" && (
                    <span 
                      className="px-2 py-1 rounded text-xs font-medium"
                      style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                    >
                      중요
                    </span>
                  )}
                </div>
                <DialogTitle className="text-left" style={{ color: '#0F4C3A' }}>
                  {selectedNotice.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Content */}
                <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
                  {selectedNotice.content}
                </p>
                
                {/* Footer */}
                <div 
                  className="flex items-center justify-between text-xs pt-4 border-t"
                  style={{ color: '#6B7280', borderColor: '#D1FAE5' }}
                >
                  <span>작성자: {selectedNotice.author}</span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {selectedNotice.date}
                  </span>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

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
        <button className="flex flex-col items-center gap-1">
          <Megaphone className="w-5 h-5" style={{ color: '#10B981' }} />
          <span className="text-xs font-medium" style={{ color: '#10B981' }}>공지</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => navigate('/profile')}>
          <UserCircle className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>마이</span>
        </button>
      </nav>
    </div>
  );
};

export default NoticePage;
