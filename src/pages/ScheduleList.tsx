import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Calendar, ChevronLeft, ChevronRight, Users, Filter, Home, CalendarDays, Megaphone, UserCircle, CalendarCheck, Vote, BookOpen, Images, Settings, Check } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useSchedule } from "@/contexts/ScheduleContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const ScheduleList = () => {
  const navigate = useNavigate();
  const { upcomingEvents, pastEvents, toggleEventJoin } = useSchedule();
  const [activeTab, setActiveTab] = useState<"upcoming" | "past">("upcoming");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const totalItems = 15;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const currentEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

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
      <main className="flex-1 px-4 py-6 pb-24">
        {/* Title Row */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5" style={{ color: '#0F4C3A' }} />
            <h1 className="text-xl font-bold" style={{ color: '#0F4C3A' }}>일정</h1>
          </div>
          <button className="flex items-center gap-1 text-sm" style={{ color: '#6B7280' }}>
            <Filter className="w-4 h-4" />
            필터
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>다양한 활동에 참여하고 XP를 획득하세요</p>

        {/* Tab Buttons */}
        <div 
          className="flex rounded-full p-1 mb-6"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <button
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              activeTab === "upcoming" ? "text-white" : ""
            }`}
            style={{ 
              backgroundColor: activeTab === "upcoming" ? '#10B981' : 'transparent',
              color: activeTab === "upcoming" ? '#FFFFFF' : '#6B7280'
            }}
            onClick={() => { setActiveTab("upcoming"); setCurrentPage(1); }}
          >
            예정된 일정
          </button>
          <button
            className={`flex-1 py-2 px-4 rounded-full text-sm font-medium transition-colors ${
              activeTab === "past" ? "text-white" : ""
            }`}
            style={{ 
              backgroundColor: activeTab === "past" ? '#10B981' : 'transparent',
              color: activeTab === "past" ? '#FFFFFF' : '#6B7280'
            }}
            onClick={() => { setActiveTab("past"); setCurrentPage(1); }}
          >
            지난 일정
          </button>
        </div>

        {/* Event List */}
        <div className="space-y-3 mb-6">
          {currentEvents.map((event) => (
            <div
              key={event.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold" style={{ color: '#0F4C3A' }}>{event.title}</h3>
                    {activeTab === "upcoming" && event.isJoined && (
                      <span 
                        className="px-2 py-0.5 rounded-full text-xs font-medium flex items-center gap-1"
                        style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                      >
                        <Check className="w-3 h-3" /> 참여
                      </span>
                    )}
                  </div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{event.date}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-sm" style={{ color: '#6B7280' }}>
                    <Users className="w-4 h-4" />
                    {event.participants}명
                  </div>
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                  >
                    +{event.xp}XP
                  </span>
                  {activeTab === "upcoming" && (
                    <button
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors"
                      style={{ backgroundColor: event.isJoined ? '#10B981' : '#0F4C3A' }}
                      onClick={() => toggleEventJoin(event.id)}
                    >
                      {event.isJoined ? '취소' : '참여'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex flex-col items-center gap-3 mb-6">
          <div className="flex items-center gap-2">
            <button 
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E2E2' }}
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" style={{ color: '#6B7280' }} />
            </button>
            
            {[1, 2, 3].map((page) => (
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
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
            </button>
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} / 전체 {totalItems}개
          </p>
        </div>

        {/* Info Box */}
        <div 
          className="rounded-xl p-4"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1" style={{ color: '#10B981' }}>
            💡 참여 안내
          </h3>
          <ul className="text-sm space-y-1" style={{ color: '#0F4C3A' }}>
            <li>• 행사 참여 시 자동으로 XP가 적립됩니다</li>
            <li>• 사전 신청하면 추가 XP 보너스를 받을 수 있어요</li>
            <li>• 불참 시 운영진에게 미리 알려주세요</li>
            <li>• XP를 모아 1등을 겨뤄보세요! 😎</li>
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
          <CalendarDays className="w-5 h-5" style={{ color: '#10B981' }} />
          <span className="text-xs font-medium" style={{ color: '#10B981' }}>일정</span>
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

export default ScheduleList;