import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Bell, User, Menu, ArrowLeft, Share2, Download, Calendar, MapPin, Images, ChevronLeft, ChevronRight, Home, CalendarDays, Megaphone, UserCircle, CalendarCheck, Vote, BookOpen, Settings } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { albumData } from "@/data/albumData";

const AlbumDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState(1);

  // Find the album by ID
  const albumId = parseInt(id || "1");
  const albumDetails = albumData.find(album => album.id === albumId) || albumData[0];

  // Number of photo placeholders per page (2x3 grid = 6)
  const photosPerPage = 6;

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
      <main className="flex-1 px-4 py-4 pb-24">
        {/* Back Button Row */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/album')}
            className="flex items-center gap-1 text-sm"
            style={{ color: '#0F4C3A' }}
          >
            <ArrowLeft className="w-4 h-4" />
            앨범으로
          </button>
          <div className="flex items-center gap-3">
            <button style={{ color: '#6B7280' }}>
              <Share2 className="w-5 h-5" />
            </button>
            <button style={{ color: '#6B7280' }}>
              <Download className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Album Info Card */}
        <div 
          className="rounded-xl p-5 mb-6"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
        >
          <h1 className="text-2xl font-bold mb-2" style={{ color: '#0F4C3A' }}>
            {albumDetails.title}
          </h1>
          <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
            {albumDetails.description}
          </p>

          {/* Meta Info */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
              <Calendar className="w-4 h-4" />
              <span>{albumDetails.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
              <MapPin className="w-4 h-4" />
              <span>{albumDetails.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm" style={{ color: '#6B7280' }}>
              <Images className="w-4 h-4" />
              <span>사진 {albumDetails.photoCount}장</span>
            </div>
          </div>

          {/* Participants */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm" style={{ color: '#6B7280' }}>참여자:</span>
            {albumDetails.participants.map((name, index) => (
              <span 
                key={index}
                className="px-3 py-1 rounded-full text-sm"
                style={{ backgroundColor: '#D1FAE5', color: '#0F4C3A' }}
              >
                {name}
              </span>
            ))}
          </div>
        </div>

        {/* Photos Section */}
        <h2 className="font-bold mb-3" style={{ color: '#0F4C3A' }}>사진</h2>
        
        {/* Photo Grid (2x3) */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {Array.from({ length: photosPerPage }).map((_, index) => (
            <div 
              key={index}
              className="aspect-[4/3] rounded-xl"
              style={{ backgroundColor: '#F0FDF4' }}
            />
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

export default AlbumDetail;
