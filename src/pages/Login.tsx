import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import { toast } from "sonner";
import comaLogo from "@/assets/coma-logo.png";
import { useAuth, type User } from "@/contexts/AuthContext";
import { apiFetch } from "@/api/client";

function decodeJwtPayload(token: string) {
  try {
    const base64Url = token.split(".")[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");

    return JSON.parse(atob(padded));
  } catch {
    return null;
  }
}

type LoginData = {
  message: string;
  accessToken: string;
  refreshToken: string;
  name: string;
  user: { id: number; name: string; studentId: string; role: string };
};

function normalizeRole(role: unknown): User["role"] {
  return typeof role === "string" && role.toUpperCase() === "ADMIN" ? "admin" : "user";
}

const Index = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (studentId: string, password: string) => {
    await new Promise((r) => setTimeout(r, 1000));

    try {
      const data = await apiFetch<LoginData>("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ studentId, password }),
      });

      const payload = decodeJwtPayload(data.accessToken);

      const user: User = {
        id: data.user?.id ?? payload?.id,
        name: data.user?.name ?? data.name ?? payload?.name ?? "",
        studentId: data.user?.studentId ?? studentId,
        role: normalizeRole(data.user?.role ?? payload?.role),
      };

      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      localStorage.setItem("name", user.name);
      localStorage.setItem("user", JSON.stringify(user));

      login({
        user,
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      toast.success("로그인 성공", {
        description: data.message ?? "환영합니다.",
      });

      const role: User["role"] =
        payload?.role === "Admin" || payload?.role === "admin"
          ? "admin"
          : user.role;

      if (role === "admin") {
        toast.success("관리자 로그인 성공!", {
          description: "COMA-ROOM 관리자 모드에 오신 것을 환영합니다.",
        });
        navigate("/admin", { replace: true });
      } else {
        toast.success("로그인 성공!", {
          description: "COMA-ROOM에 오신 것을 환영합니다.",
        });
        navigate("/main", { replace: true });
      }
    } catch (err: any) {
      toast.error("로그인 실패", {
        description: err?.message ?? "학번 또는 비밀번호가 올바르지 않습니다.",
      });
    }
  };

  return (
    <div className="min-h-screen gradient-mint flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-[380px]">
        <div className="flex flex-col items-center mb-6">
          <img src={comaLogo} alt="COMA Logo" className="w-24 h-24 rounded-2xl" />
          <h1
            className="mt-4 text-[28px] font-bold tracking-tight"
            style={{ color: "#40C095" }}
          >
            COMA-ROOM
          </h1>
          <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
            COMA 동아리 회원 전용 플랫폼
          </p>
        </div>

        <div
          className="rounded-2xl p-6"
          style={{
            backgroundColor: "white",
            boxShadow: "0 24px 48px -30px rgba(0,0,0,0.51)",
          }}
        >
          <div
            className="text-center mb-6 pb-4"
            style={{ borderBottom: "1px solid #D1FAE5" }}
          >
            <h2 className="text-base font-bold" style={{ color: "#0F4C3A" }}>
              회원 로그인
            </h2>
            <p className="text-sm mt-1" style={{ color: "#6B7280" }}>
              COMA 동아리 회원만 접근 가능합니다
            </p>
          </div>

          <LoginForm onLogin={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Index;