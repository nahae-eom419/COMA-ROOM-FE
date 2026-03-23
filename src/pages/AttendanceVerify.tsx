import { useState, useEffect } from "react";
import { Bell, User, Menu, Home, CalendarDays, Megaphone, UserCircle, CalendarCheck, Vote, BookOpen, Images, Settings, CheckCircle2, Loader2, ChevronLeft } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useXP } from "@/contexts/XPContext";
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
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const AttendanceVerify = () => {
  const navigate = useNavigate();
  const { addXP } = useXP();
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session");
  const activityType = searchParams.get("type") || "정기회의"; // 기본값은 정기회의
  
  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(5);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [isAutoVerifying, setIsAutoVerifying] = useState(false);

  // QR 코드로 접속 시 자동 인증
  useEffect(() => {
    if (sessionId && sessionId.startsWith("COMA-") && !isVerified) {
      setIsAutoVerifying(true);
      // 실제로는 서버에서 세션 ID 유효성 검증
      const timer = setTimeout(() => {
        setIsVerified(true);
        setIsAutoVerifying(false);
        setShowSuccessModal(true);
        
        // 정기회의일 경우 +3 XP 지급
        if (activityType === "정기회의") {
          addXP(3, "출석 인증", "출석");
        }
      }, 1500); // 1.5초 로딩 후 인증 완료
      
      return () => clearTimeout(timer);
    }
  }, [sessionId, isVerified, activityType, addXP]);

  // 수동 코드 입력용 (예시 코드)
  const correctCode = "123";

  const handleSubmit = () => {
    if (attempts <= 0) return;

    if (code === correctCode) {
      setIsVerified(true);
      setShowSuccessModal(true);
      // 수동 코드 입력은 정기회의로 간주하고 +3 XP 지급
      addXP(3, "출석 인증", "출석");
    } else {
      setAttempts(prev => prev - 1);
      setShowErrorModal(true);
      setCode("");
    }
  };

  const handleConfirm = () => {
    setShowSuccessModal(false);
    navigate('/attendance');
  };

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
        {/* Title with Back Button */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/attendance')}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: '#F0FDF4' }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: '#10B981' }} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: '#10B981' }}>출석 인증</h1>
            <p className="text-sm" style={{ color: '#6B7280' }}>
              {sessionId ? 'QR 코드로 출석을 인증하고 있습니다' : '운영진이 제공한 출석 코드를 입력하세요'}
            </p>
          </div>
        </div>

        {/* Auto Verification Card (QR 스캔 시) */}
        {isAutoVerifying && (
          <div 
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin" style={{ color: '#10B981' }} />
            <h2 className="text-lg font-bold mb-2" style={{ color: '#0F4C3A' }}>출석 인증 중...</h2>
            <p className="text-sm" style={{ color: '#6B7280' }}>QR 코드를 확인하고 있습니다</p>
            <div 
              className="mt-4 px-3 py-1.5 rounded-full inline-block text-xs"
              style={{ backgroundColor: '#F0FDF4', color: '#6B7280' }}
            >
              세션: {sessionId}
            </div>
          </div>
        )}

        {/* Verified Success Card */}
        {isVerified && !showSuccessModal && (
          <div 
            className="rounded-2xl p-8 text-center"
            style={{ backgroundColor: '#D1FAE5' }}
          >
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4" style={{ color: '#10B981' }} />
            <h2 className="text-xl font-bold mb-2" style={{ color: '#0F4C3A' }}>출석 완료!</h2>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>출석이 정상적으로 처리되었습니다</p>
            <Button
              onClick={() => navigate('/attendance')}
              className="px-6 h-12 text-base font-semibold text-white rounded-xl"
              style={{ backgroundColor: '#10B981' }}
            >
              출석 기록 보기
            </Button>
          </div>
        )}

        {/* Manual Input Section (QR 없이 접속 시) */}
        {!sessionId && !isVerified && (
          <>
            {/* Attempts Card */}
            <div 
              className="rounded-2xl p-5"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            >
              <div className="flex items-center justify-between">
                <span className="font-medium" style={{ color: '#0F4C3A' }}>남은 시도 횟수</span>
                <span className="text-2xl font-bold" style={{ color: '#10B981' }}>
                  {attempts} / 5
                </span>
              </div>
            </div>

            {/* Code Input */}
            <div className="space-y-3">
              <label className="block text-center font-medium" style={{ color: '#6B7280' }}>
                출석 코드
              </label>
              <Input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.slice(0, 3))}
                placeholder="000"
                className="text-center text-2xl font-bold tracking-widest h-14"
                style={{ 
                  backgroundColor: '#F0FDF4',
                  border: '1px solid #D1FAE5',
                  color: '#0F4C3A'
                }}
                maxLength={3}
                disabled={isVerified || attempts <= 0}
              />
              
              <Button
            onClick={handleSubmit}
            disabled={code.length !== 3 || isVerified || attempts <= 0}
            className="w-full h-12 text-base font-semibold text-white rounded-xl"
            style={{ 
              backgroundColor: code.length === 3 && !isVerified && attempts > 0 ? '#10B981' : '#D1FAE5',
              color: code.length === 3 && !isVerified && attempts > 0 ? '#FFFFFF' : '#6B7280'
            }}
          >
                {isVerified ? '인증 완료' : '출석 인증하기'}
              </Button>
            </div>
          </>
        )}

        {/* Notice Section */}
        {!isAutoVerifying && !isVerified && (
        <div 
          className="rounded-xl p-4"
          style={{ backgroundColor: '#F0FDF4' }}
        >
          <h3 className="font-semibold text-sm mb-3" style={{ color: '#0F4C3A' }}>안내사항</h3>
          <ul className="text-sm space-y-2" style={{ color: '#6B7280' }}>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>운영진이 공지한 출석 코드를 입력해주세요</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>출석 코드는 000부터 999까지의 3자리 숫자입니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>보안을 위해 최대 5회까지만 시도할 수 있습니다.</span>
            </li>
            <li className="flex items-start gap-2">
              <span>•</span>
              <span>출석이 완료되면 자동으로 XP가 지급됩니다.</span>
            </li>
          </ul>
        </div>
        )}
      </main>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="rounded-2xl max-w-sm mx-auto" hideCloseButton>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold" style={{ color: '#0F4C3A' }}>
              출석 완료
            </DialogTitle>
            <DialogDescription className="text-sm" style={{ color: '#6B7280' }}>
              출석이 정상적으로 처리되었습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={handleConfirm}
              className="w-full h-12 text-base font-semibold text-white rounded-xl"
              style={{ backgroundColor: '#10B981' }}
            >
              확인
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSuccessModal(false)}
              className="w-full h-12 text-base font-semibold rounded-xl"
              style={{ borderColor: '#D1FAE5', color: '#0F4C3A' }}
            >
              취소
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Error Modal */}
      <Dialog open={showErrorModal} onOpenChange={setShowErrorModal}>
        <DialogContent className="rounded-2xl max-w-sm mx-auto" hideCloseButton>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold" style={{ color: '#C70036' }}>
              인증 실패
            </DialogTitle>
            <DialogDescription className="text-sm" style={{ color: '#6B7280' }}>
              출석 코드가 일치하지 않습니다. 다시 시도해주세요.
              <br />
              남은 시도 횟수: {attempts}회
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={() => setShowErrorModal(false)}
              className="w-full h-12 text-base font-semibold text-white rounded-xl"
              style={{ backgroundColor: '#10B981' }}
            >
              다시 시도
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Navigation */}
      <nav 
        className="flex items-center justify-around py-3 border-t sticky bottom-0"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}
      >
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/main')}
        >
          <Home className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>홈</span>
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

export default AttendanceVerify;
