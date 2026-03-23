import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Images, Upload, Search, Calendar, ChevronLeft, ChevronRight, Home, CalendarDays, Megaphone, UserCircle, CalendarCheck, Vote, BookOpen, Settings } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { albumData } from "@/data/albumData";

const Album = () => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const totalPhotos = 147;
  const totalAlbums = 10;
  const totalParticipants = 23;

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
            <Images className="w-5 h-5" style={{ color: '#0F4C3A' }} />
            <h1 className="text-xl font-bold" style={{ color: '#0F4C3A' }}>앨범</h1>
          </div>
          <button 
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
            onClick={() => navigate('/album/upload')}
          >
            <Upload className="w-4 h-4" />
            사진 올리기
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>함께한 순간을 기록하고 공유해요 📸</p>

        {/* Search Bar */}
        <div 
          className="flex items-center gap-2 px-4 py-3 rounded-xl mb-4"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
        >
          <Search className="w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text"
            placeholder="앨범 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: '#0F4C3A' }}
          />
        </div>

        {/* Stats Section */}
        <div 
          className="grid grid-cols-3 gap-2 rounded-xl p-4 mb-6"
          style={{ backgroundColor: '#10B981' }}
        >
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalPhotos}</p>
            <p className="text-xs text-white opacity-80">전체 사진</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalAlbums}</p>
            <p className="text-xs text-white opacity-80">앨범 수</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-white">{totalParticipants}</p>
            <p className="text-xs text-white opacity-80">참여 인원</p>
          </div>
        </div>

        {/* Recent Albums */}
        <h2 className="font-bold mb-3" style={{ color: '#0F4C3A' }}>최근 앨범</h2>
        
        <div className="space-y-4 mb-6">
          {albumData.map((album) => (
            <div
              key={album.id}
              className="rounded-xl overflow-hidden cursor-pointer"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
              onClick={() => navigate(`/album/${album.id}`)}
            >
              {/* Image Placeholder */}
              <div 
                className="relative w-full h-48"
                style={{ backgroundColor: '#F0FDF4' }}
              >
                {/* Photo count badge */}
                <div 
                  className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium"
                  style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)', color: '#FFFFFF' }}
                >
                  <Images className="w-3 h-3" />
                  {album.photoCount}장
                </div>
              </div>
              
              {/* Album Info */}
              <div className="p-4">
                <h3 className="font-semibold mb-1" style={{ color: '#0F4C3A' }}>{album.title}</h3>
                <div className="flex items-center gap-1 text-sm" style={{ color: '#6B7280' }}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{album.date}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #E2E2E2' }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
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
            onClick={() => setCurrentPage(Math.min(3, currentPage + 1))}
          >
            <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
          </button>
        </div>

        {/* Tip Box */}
        <div 
          className="rounded-xl p-4"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <h3 className="font-semibold text-sm mb-2 flex items-center gap-1" style={{ color: '#10B981' }}>
            🎉 코마 앨범 즐기는 Tip 🤗
          </h3>
          <ul className="text-sm space-y-1" style={{ color: '#0F4C3A' }}>
            <li>• 행사 사진을 추가하면 5 XP를 받아요.</li>
            <li>• 좋은 순간을 기록하고 동아리 추억을 함께 만들어요.</li>
            <li>• 추가하고 싶은 사진은 운영진에게 보내주세요!! 😎</li>
            <li>• 사진은 운영진 검토 후 앨범에 추가됩니다.</li>
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
          <UserCircle className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>마이</span>
        </button>
      </nav>
    </div>
  );
};

export default Album;
