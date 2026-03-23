import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, ArrowLeft, Images, Calendar, MapPin, Upload, Home, CalendarDays, Megaphone, UserCircle, CalendarCheck, Vote, BookOpen, Settings } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const AlbumUpload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [location, setLocation] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [showCancelModal, setShowCancelModal] = useState(false);

  const handleFileSelect = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files) {
        const fileArray = Array.from(files).slice(0, 20);
        setSelectedFiles(fileArray);
      }
    };
    input.click();
  };

  const handleBackClick = () => {
    // 작성 중인 내용이 있으면 확인 모달 표시
    if (title || description || date || location || selectedFiles.length > 0) {
      setShowCancelModal(true);
    } else {
      navigate('/album');
    }
  };

  const handleConfirmCancel = () => {
    setShowCancelModal(false);
    navigate('/album');
  };

  const handleContinue = () => {
    setShowCancelModal(false);
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: '#F8FFFE' }}>
      {/* Cancel Confirmation Modal */}
      {showCancelModal && (
        <>
          {/* Blurred Overlay */}
          <div 
            className="fixed inset-0 z-[100]"
            style={{ 
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              backdropFilter: 'blur(4px)'
            }}
            onClick={handleContinue}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center px-8">
            <div 
              className="w-full max-w-sm rounded-2xl p-6"
              style={{ backgroundColor: '#FFFFFF' }}
            >
              <h2 
                className="text-lg font-bold text-center mb-2"
                style={{ color: '#0F4C3A' }}
              >
                업로드를 취소하시겠습니까?
              </h2>
              <p 
                className="text-sm text-center mb-6"
                style={{ color: '#6B7280' }}
              >
                작성 중인 내용이 모두 삭제됩니다.
              </p>
              
              <div className="space-y-3">
                <button
                  onClick={handleConfirmCancel}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
                >
                  취소하기
                </button>
                <button
                  onClick={handleContinue}
                  className="w-full py-3 rounded-xl font-semibold text-sm"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    color: '#0F4C3A',
                    border: '1px solid #D1FAE5'
                  }}
                >
                  계속 작성
                </button>
              </div>
            </div>
          </div>
        </>
      )}

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
        {/* Back Button and Title Row */}
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={handleBackClick}
            className="flex items-center gap-1 text-sm"
            style={{ color: '#0F4C3A' }}
          >
            <ArrowLeft className="w-4 h-4" />
            취소
          </button>
          <h1 className="font-bold text-lg" style={{ color: '#0F4C3A' }}>사진 올리기</h1>
          <div className="w-12"></div>
        </div>

        {/* Upload Guide Box */}
        <div 
          className="rounded-xl p-4 mb-6 flex items-start gap-3"
          style={{ backgroundColor: '#D1FAE5' }}
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: 'rgba(16, 185, 129, 0.3)' }}
          >
            <Images className="w-5 h-5" style={{ color: '#10B981' }} />
          </div>
          <div>
            <h2 className="font-bold text-sm mb-2" style={{ color: '#10B981' }}>사진 업로드 가이드</h2>
            <ul className="text-sm space-y-1" style={{ color: '#0F4C3A' }}>
              <li>• 행사 사진을 올리면 5 XP를 받아요.</li>
              <li>• 운영진 검토 후 앨범에 추가됩니다.</li>
              <li>• 최대 20장까지 업로드 가능!</li>
            </ul>
          </div>
        </div>

        {/* Form Card */}
        <div 
          className="rounded-xl p-5"
          style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
        >
          {/* Album Title */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
              앨범 제목 <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="text"
              placeholder="예: 2026 신년 OT"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #D1FAE5',
                color: '#0F4C3A'
              }}
            />
          </div>

          {/* Description */}
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
              설명
            </label>
            <textarea
              placeholder="앨범에 대한 설명을 입력하세요..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none resize-none"
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #D1FAE5',
                color: '#0F4C3A',
                minHeight: '100px'
              }}
            />
          </div>

          {/* Date */}
          <div className="mb-5">
            <label className="flex items-center gap-1 text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
              <Calendar className="w-4 h-4" />
              날짜 <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #D1FAE5',
                color: '#0F4C3A'
              }}
            />
          </div>

          {/* Location */}
          <div className="mb-5">
            <label className="flex items-center gap-1 text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
              <MapPin className="w-4 h-4" />
              장소
            </label>
            <input
              type="text"
              placeholder="예: 스머프 동산"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-sm outline-none"
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '1px solid #D1FAE5',
                color: '#0F4C3A'
              }}
            />
          </div>

          {/* Photo Upload */}
          <div>
            <label className="flex items-center gap-1 text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
              <Images className="w-4 h-4" />
              사진 <span style={{ color: '#EF4444' }}>*</span>
            </label>
            <button
              onClick={handleFileSelect}
              className="w-full py-8 rounded-xl flex flex-col items-center justify-center gap-2"
              style={{ 
                backgroundColor: '#FFFFFF', 
                border: '2px dashed #D1FAE5'
              }}
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: '#D1FAE5' }}
              >
                <Upload className="w-5 h-5" style={{ color: '#10B981' }} />
              </div>
              <span className="font-medium text-sm" style={{ color: '#0F4C3A' }}>
                {selectedFiles.length > 0 ? `${selectedFiles.length}장 선택됨` : '사진 선택하기'}
              </span>
              <span className="text-xs" style={{ color: '#6B7280' }}>최대 20장까지 선택 가능</span>
            </button>
          </div>
        </div>

        {/* Upload Button */}
        <button 
          className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 mt-6"
          style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
        >
          <Upload className="w-4 h-4" />
          업로드하기
        </button>
        
        <p className="text-center text-xs mt-3" style={{ color: '#6B7280' }}>
          업로드하면 5 XP를 받을 수 있어요
        </p>
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

export default AlbumUpload;
