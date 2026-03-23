import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Calendar, Clock, Bell, User, Menu, Home, MessageSquare, CalendarCheck, Vote, BookOpen, Images, Settings } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Schedule = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23)); // January 23, 2026
  const [selectedDate, setSelectedDate] = useState(23);

  const daysOfWeek = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
  
  // Generate calendar days for January 2026
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const calendarDays: { day: number; isCurrentMonth: boolean }[] = [];
  
  // Previous month days
  for (let i = firstDayOfMonth - 1; i >= 0; i--) {
    calendarDays.push({ day: daysInPrevMonth - i, isCurrentMonth: false });
  }
  
  // Current month days
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({ day: i, isCurrentMonth: true });
  }

  const upcomingEvents = [
    {
      id: 1,
      title: "정기모임 #9",
      type: "정기모임",
      typeColor: "bg-[#10B981]",
      date: "2025-01-27",
      time: "오후 7:00"
    },
    {
      id: 2,
      title: "AI/ML 스터디",
      type: "스터디",
      typeColor: "bg-[#1447E6]",
      date: "2025-01-24",
      time: "오후 6:00"
    },
    {
      id: 3,
      title: "웹 개발 프로젝트",
      type: "스터디",
      typeColor: "bg-[#1447E6]",
      date: "2025-01-26",
      time: "오후 7:00"
    }
  ];

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const goToPrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  return (
    <div className="min-h-screen bg-[#F8FFFE]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-[#10B981] px-4 py-3">
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
      <main className="px-4 py-6 pb-24">
        {/* Page Title */}
        <div className="flex items-center gap-2 mb-2">
          <Calendar className="w-5 h-5 text-[#0F4C3A]" />
          <h1 className="text-xl font-bold text-[#0F4C3A]">일정</h1>
        </div>
        <p className="text-[#6B7280] text-sm mb-6">동아리 일정을 한눈에 확인하세요</p>

        {/* Calendar */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={goToPrevMonth} className="p-1">
              <ChevronLeft className="w-5 h-5 text-[#6B7280]" />
            </button>
            <span className="font-semibold text-[#0F4C3A]">
              {monthNames[month]} {year}
            </span>
            <button onClick={goToNextMonth} className="p-1">
              <ChevronRight className="w-5 h-5 text-[#6B7280]" />
            </button>
          </div>

          {/* Days of Week */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {daysOfWeek.map((day) => (
              <div key={day} className="text-center text-sm text-[#6B7280] py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((item, index) => (
              <button
                key={index}
                onClick={() => item.isCurrentMonth && setSelectedDate(item.day)}
                className={`
                  py-2 text-sm rounded-full transition-colors
                  ${!item.isCurrentMonth ? "text-[#D1D5DB]" : "text-[#0F4C3A]"}
                  ${item.isCurrentMonth && item.day === selectedDate 
                    ? "bg-[#10B981] text-white font-semibold" 
                    : "hover:bg-[#D1FAE5]"
                  }
                `}
              >
                {item.day}
              </button>
            ))}
          </div>
        </div>

        {/* Selected Date Events */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#0F4C3A]">1월 {selectedDate}일</h2>
            <span className="text-sm text-[#10B981]">0개 일정</span>
          </div>
          
          <div className="bg-white rounded-2xl p-8 flex flex-col items-center justify-center">
            <div className="w-16 h-16 mb-4 flex items-center justify-center">
              <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="8" y="12" width="48" height="44" rx="4" stroke="#D1FAE5" strokeWidth="2" fill="none"/>
                <path d="M8 24H56" stroke="#D1FAE5" strokeWidth="2"/>
                <rect x="20" y="8" width="4" height="8" rx="2" fill="#D1FAE5"/>
                <rect x="40" y="8" width="4" height="8" rx="2" fill="#D1FAE5"/>
                <rect x="16" y="32" width="8" height="8" rx="1" fill="#D1FAE5"/>
                <rect x="28" y="32" width="8" height="8" rx="1" fill="#D1FAE5"/>
                <rect x="40" y="32" width="8" height="8" rx="1" fill="#D1FAE5"/>
                <rect x="16" y="44" width="8" height="8" rx="1" fill="#D1FAE5"/>
                <rect x="28" y="44" width="8" height="8" rx="1" fill="#D1FAE5"/>
              </svg>
            </div>
            <p className="text-[#6B7280] text-sm">이 날짜에 예정된 일정이 없습니다.</p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div>
          <h2 className="font-bold text-[#0F4C3A] mb-3">다가오는 일정</h2>
          
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-2xl p-4 flex items-center justify-between shadow-sm"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-[#0F4C3A]">{event.title}</span>
                    <span className={`${event.typeColor} text-white text-xs px-2 py-0.5 rounded-full`}>
                      {event.type}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[#6B7280] text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{event.time}</span>
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-[#6B7280]" />
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E5E7EB] px-4 py-2">
        <div className="flex items-center justify-around">
          <button 
            onClick={() => navigate("/main")}
            className="flex flex-col items-center gap-1 py-2 px-4"
          >
            <Home className="w-5 h-5 text-[#6B7280]" />
            <span className="text-xs text-[#6B7280]">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4">
            <Calendar className="w-5 h-5 text-[#10B981]" />
            <span className="text-xs text-[#10B981] font-medium">일정</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4" onClick={() => navigate('/notice')}>
            <MessageSquare className="w-5 h-5 text-[#6B7280]" />
            <span className="text-xs text-[#6B7280]">공지</span>
          </button>
          <button className="flex flex-col items-center gap-1 py-2 px-4" onClick={() => navigate('/profile')}>
            <User className="w-5 h-5 text-[#6B7280]" />
            <span className="text-xs text-[#6B7280]">마이</span>
          </button>
        </div>
      </nav>
    </div>
  );
};

export default Schedule;
