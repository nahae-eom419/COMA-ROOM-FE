import { useState, useEffect, useRef } from "react";
import {
  Bell,
  User,
  Menu,
  Home,
  CalendarDays,
  Megaphone,
  UserCircle,
  CalendarCheck,
  Vote,
  BookOpen,
  Images,
  Settings,
  CheckCircle2,
  Loader2,
  ChevronLeft,
  Camera,
  AlertCircle,
} from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { useNavigate } from "react-router-dom";
import { useXP } from "@/contexts/XPContext";
import { Html5Qrcode } from "html5-qrcode";
import { apiFetch } from "@/api/client";
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

type ScanState = "idle" | "scanning" | "verifying" | "verified" | "error";

const AttendanceVerify = () => {
  const navigate = useNavigate();
  const { addXP } = useXP();

  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [scanState, setScanState] = useState<ScanState>("idle");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [scannedSession, setScannedSession] = useState<string | null>(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [cameraPermission, setCameraPermission] = useState<boolean | null>(null);

  const stopScanner = async () => {
    if (scannerRef.current) {
      try {
        const state = scannerRef.current.getState();
        if (state === 2) {
          await scannerRef.current.stop();
        }
        scannerRef.current.clear();
      } catch {
        // ignore
      }
      scannerRef.current = null;
    }
  };

  const startScanner = async () => {
    setErrorMessage(null);
    setScanState("scanning");

    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        (decodedText) => {
          handleScanResult(decodedText);
        },
        () => {}
      );

      setCameraPermission(true);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.toLowerCase().includes("permission") || msg.toLowerCase().includes("notallowed")) {
        setCameraPermission(false);
        setErrorMessage("카메라 권한이 필요합니다. 브라우저 설정에서 카메라를 허용해 주세요.");
      } else {
        setErrorMessage("카메라를 시작할 수 없습니다. 다시 시도해 주세요.");
      }
      setScanState("error");
    }
  };

  const handleScanResult = async (text: string) => {
    await stopScanner();
    setScanState("verifying");

    const qrCodeId = text.trim();
    if (!qrCodeId) {
      setErrorMessage("QR 코드를 읽을 수 없습니다. 다시 시도해 주세요.");
      setScanState("error");
      return;
    }

    setScannedSession(qrCodeId);

    try {
      await apiFetch("/api/event/attendances/checks", {
        method: "POST",
        body: JSON.stringify({ qrCodeId }),
      });

      setScanState("verified");
      setShowSuccessModal(true);
      addXP(3, "출석 인증", "출석");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      if (message.includes("만료") || message.includes("유효")) {
        setErrorMessage("출석 QR 코드가 만료되었습니다. 운영진에게 문의해 주세요.");
      } else if (message.includes("401") || message.includes("Unauthorized")) {
        setErrorMessage("로그인이 필요합니다. 다시 로그인해 주세요.");
      } else if (message.includes("이미") || message.includes("409")) {
        setErrorMessage("이미 출석 처리된 QR 코드입니다.");
      } else {
        setErrorMessage(`출석 인증에 실패했습니다: ${message}`);
      }
      setScanState("error");
    }
  };

  useEffect(() => {
    startScanner();
    return () => {
      stopScanner();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleConfirm = () => {
    setShowSuccessModal(false);
    navigate("/attendance");
  };

  const handleRetry = () => {
    setErrorMessage(null);
    startScanner();
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#F8FFFE" }}>
      <header className="flex items-center justify-between px-4 py-3" style={{ backgroundColor: "#FFFFFF" }}>
        <div className="flex items-center gap-2">
          <ComaLogo size="sm" />
          <span className="font-bold text-lg" style={{ color: "#0F4C3A" }}>COMA-ROOM</span>
        </div>
        <div className="flex items-center gap-4">
          <button onClick={() => navigate("/notifications")}>
            <Bell className="w-5 h-5" style={{ color: "#6B7280" }} />
          </button>
          <User className="w-5 h-5" style={{ color: "#6B7280" }} />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="focus:outline-none">
                <Menu className="w-5 h-5" style={{ color: "#6B7280" }} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32 bg-white border border-gray-200 shadow-lg rounded-lg z-[100]">
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/schedule")}>
                <CalendarCheck className="w-4 h-4" style={{ color: "#6B7280" }} />
                <span style={{ color: "#0F4C3A" }}>일정</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/vote-list")}>
                <Vote className="w-4 h-4" style={{ color: "#6B7280" }} />
                <span style={{ color: "#0F4C3A" }}>투표</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/study")}>
                <BookOpen className="w-4 h-4" style={{ color: "#6B7280" }} />
                <span style={{ color: "#0F4C3A" }}>스터디</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/album")}>
                <Images className="w-4 h-4" style={{ color: "#6B7280" }} />
                <span style={{ color: "#0F4C3A" }}>앨범</span>
              </DropdownMenuItem>
              <DropdownMenuItem className="flex items-center gap-2 cursor-pointer hover:bg-gray-50" onClick={() => navigate("/settings")}>
                <Settings className="w-4 h-4" style={{ color: "#6B7280" }} />
                <span style={{ color: "#0F4C3A" }}>설정</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="flex-1 px-4 py-4 space-y-5">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              stopScanner();
              navigate("/attendance");
            }}
            className="w-8 h-8 flex items-center justify-center rounded-full"
            style={{ backgroundColor: "#F0FDF4" }}
          >
            <ChevronLeft className="w-5 h-5" style={{ color: "#10B981" }} />
          </button>
          <div>
            <h1 className="text-2xl font-bold" style={{ color: "#10B981" }}>QR 출석 인증</h1>
            <p className="text-sm" style={{ color: "#6B7280" }}>
              {scanState === "scanning" && "QR 코드를 프레임 안에 비춰 주세요."}
              {scanState === "verifying" && "출석을 인증하고 있습니다..."}
              {scanState === "verified" && "출석이 완료되었습니다."}
              {(scanState === "idle" || scanState === "error") && "운영진이 제시한 QR 코드를 스캔해 주세요."}
            </p>
          </div>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: "#FFFFFF", border: "1px solid #D1FAE5" }}>
          <div className="relative bg-black" style={{ minHeight: 300 }}>
            <div id="qr-reader" className="w-full" />

            {scanState === "scanning" && (
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="relative" style={{ width: 240, height: 240 }}>
                  <span className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 rounded-tl-lg" style={{ borderColor: "#10B981" }} />
                  <span className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 rounded-tr-lg" style={{ borderColor: "#10B981" }} />
                  <span className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 rounded-bl-lg" style={{ borderColor: "#10B981" }} />
                  <span className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 rounded-br-lg" style={{ borderColor: "#10B981" }} />
                  <div
                    className="absolute left-2 right-2 h-0.5 animate-bounce"
                    style={{ backgroundColor: "#10B981", top: "50%" }}
                  />
                </div>
              </div>
            )}

            {scanState === "verifying" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "rgba(15,76,58,0.85)" }}>
                <Loader2 className="w-12 h-12 animate-spin" style={{ color: "#10B981" }} />
                <p className="text-white font-medium">인증 중...</p>
                {scannedSession && (
                  <span className="text-xs px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.7)" }}>
                    {scannedSession}
                  </span>
                )}
              </div>
            )}

            {scanState === "verified" && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3" style={{ backgroundColor: "rgba(16,185,129,0.9)" }}>
                <CheckCircle2 className="w-16 h-16 text-white" />
                <p className="text-white text-lg font-bold">출석 완료!</p>
              </div>
            )}

            {(scanState === "idle" || scanState === "error") && (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ backgroundColor: "#0F4C3A", minHeight: 300 }}>
                <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: "rgba(16,185,129,0.2)" }}>
                  <Camera className="w-10 h-10" style={{ color: "#10B981" }} />
                </div>
                <p className="text-sm" style={{ color: "rgba(255,255,255,0.6)" }}>카메라를 켜고 있습니다</p>
              </div>
            )}
          </div>

          <div className="px-4 py-3 text-center" style={{ borderTop: "1px solid #D1FAE5" }}>
            {scanState === "scanning" && (
              <p className="text-sm font-medium flex items-center justify-center gap-2" style={{ color: "#10B981" }}>
                <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ backgroundColor: "#10B981" }} />
                스캔 중...
              </p>
            )}
            {scanState === "verifying" && (
              <p className="text-sm font-medium" style={{ color: "#10B981" }}>서버에서 인증 중입니다</p>
            )}
            {scanState === "verified" && (
              <p className="text-sm font-medium" style={{ color: "#10B981" }}>출석 인증 완료</p>
            )}
            {(scanState === "idle" || scanState === "error") && (
              <p className="text-sm" style={{ color: "#6B7280" }}>카메라를 켜고 있습니다</p>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-xl p-4 flex items-start gap-3" style={{ backgroundColor: "#FFF1F2", border: "1px solid #FFE4E6" }}>
            <AlertCircle className="w-5 h-5 mt-0.5 shrink-0" style={{ color: "#C70036" }} />
            <p className="text-sm" style={{ color: "#C70036" }}>{errorMessage}</p>
          </div>
        )}

        {cameraPermission === false && (
          <div className="rounded-xl p-4" style={{ backgroundColor: "#FFF7ED", border: "1px solid #FED7AA" }}>
            <h3 className="font-semibold text-sm mb-2" style={{ color: "#92400E" }}>카메라 권한 설정 방법</h3>
            <ul className="text-sm space-y-1" style={{ color: "#92400E" }}>
              <li>브라우저 주소창 옆의 자물쇠 아이콘을 눌러 주세요.</li>
              <li>카메라 권한을 허용으로 변경해 주세요.</li>
              <li>페이지를 새로고침한 뒤 다시 시도해 주세요.</li>
            </ul>
          </div>
        )}

        {(scanState === "idle" || scanState === "error") && (
          <Button
            onClick={handleRetry}
            className="w-full h-14 rounded-xl text-base font-semibold text-white flex items-center justify-center gap-2"
            style={{ backgroundColor: "#10B981" }}
          >
            <Camera className="w-5 h-5" />
            카메라 다시 시작
          </Button>
        )}

        {scanState === "scanning" && (
          <Button
            onClick={() => {
              stopScanner();
              setScanState("idle");
            }}
            className="w-full h-12 rounded-xl text-base font-semibold"
            style={{ backgroundColor: "#F0FDF4", color: "#0F4C3A" }}
          >
            취소
          </Button>
        )}

        {(scanState === "idle" || scanState === "scanning") && (
          <div className="rounded-xl p-4" style={{ backgroundColor: "#F0FDF4" }}>
            <h3 className="font-semibold text-sm mb-3" style={{ color: "#0F4C3A" }}>안내사항</h3>
            <ul className="text-sm space-y-2" style={{ color: "#6B7280" }}>
              <li>운영진이 제시한 QR 코드를 카메라에 비춰 주세요.</li>
              <li>QR 코드가 화면 중앙 프레임 안에 들어오도록 맞춰 주세요.</li>
              <li>인식되면 자동으로 출석 인증이 진행됩니다.</li>
              <li>출석이 완료되면 자동으로 XP가 지급됩니다.</li>
            </ul>
          </div>
        )}
      </main>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="rounded-2xl max-w-sm mx-auto" hideCloseButton>
          <DialogHeader className="text-center">
            <DialogTitle className="text-xl font-bold" style={{ color: "#0F4C3A" }}>
              출석 완료
            </DialogTitle>
            <DialogDescription className="text-sm" style={{ color: "#6B7280" }}>
              출석이 정상적으로 처리되었습니다.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-2 mt-4">
            <Button
              onClick={handleConfirm}
              className="w-full h-12 text-base font-semibold text-white rounded-xl"
              style={{ backgroundColor: "#10B981" }}
            >
              출석 기록 보기
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowSuccessModal(false)}
              className="w-full h-12 text-base font-semibold rounded-xl"
              style={{ borderColor: "#D1FAE5", color: "#0F4C3A" }}
            >
              닫기
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <nav className="flex items-center justify-around py-3 border-t sticky bottom-0" style={{ backgroundColor: "#FFFFFF", borderColor: "#D1FAE5" }}>
        <button className="flex flex-col items-center gap-1" onClick={() => { stopScanner(); navigate("/main"); }}>
          <Home className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>홈</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => { stopScanner(); navigate("/schedule"); }}>
          <CalendarDays className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>일정</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => { stopScanner(); navigate("/notice"); }}>
          <Megaphone className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>공지</span>
        </button>
        <button className="flex flex-col items-center gap-1" onClick={() => { stopScanner(); navigate("/profile"); }}>
          <UserCircle className="w-5 h-5" style={{ color: "#6B7280" }} />
          <span className="text-xs" style={{ color: "#6B7280" }}>마이</span>
        </button>
      </nav>
    </div>
  );
};

export default AttendanceVerify;
