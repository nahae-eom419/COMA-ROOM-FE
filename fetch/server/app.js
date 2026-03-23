const express = require("express");
const app = express();
const cors = require("cors");
const jwt = require("jsonwebtoken");
app.get("/__whoami", (req, res) => {
  res.json({ ok: true, file: "app.js", ts: Date.now() });
});
app.use(
  cors({
    origin: "http://localhost:8080", // ✅ Vite
    credentials: true,
  })
);

app.use(express.json());
app.use((req, _res, next) => {
  console.log(`[REQ] ${req.method} ${req.originalUrl}`, {
    origin: req.headers.origin,
    auth: req.headers.authorization ? "yes" : "no",
  });
  next();
});

/* ======================
   🔹 상수
====================== */
const ACCESS_SECRET = "ACCESS_SECRET_KEY";
const REFRESH_SECRET = "REFRESH_SECRET_KEY";

/* ======================
   🔹 JWT 인증 미들웨어
====================== */
function auth(req, res, next) {
  const header = req.headers.authorization;
  const token = header && header.startsWith("Bearer ") ? header.slice(7) : null;

  if (!token) {
    return res.status(401).json({
      code: "AUTH-401",
      status: 401,
      message: "토큰이 없습니다.",
      data: null,
    });
  }

  try {
    req.user = jwt.verify(token, ACCESS_SECRET); // { sub, role, name, studentId, ... }
    next();
  } catch (e) {
    return res.status(401).json({
      code: "AUTH-401",
      status: 401,
      message: "토큰이 만료되었거나 유효하지 않습니다.",
      data: null,
    });
  }
}

/* ======================
   🔹 관리자 권한 미들웨어 (추가)
====================== */
function adminOnly(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({
      code: "AUTH-403",
      status: 403,
      message: "관리자 권한이 필요합니다.",
      data: null,
    });
  }
  next();
}

/* ======================
   🔹 더미 유저
====================== */
const users = [
  {
    id: 1,
    name: "박준우",
    studentId: "2024111111",
    password: "20010410",
    role: "admin",
  },
  {
    id: 2,
    name: "일반유저",
    studentId: "2024123456",
    password: "20040419",
    role: "user",
  },
];

/* ======================
   🔹 관리자 데이터
====================== */
let recentActivityLogs = [
  {
    id: 101,
    userName: "서진호",
    type: "ATTENDANCE",
    description: "정기모임 #8 출석",
    timeAgo: "10분 전",
    grantedXp: 3,
    status: "PENDING",
  },
  {
    id: 102,
    userName: "서준하",
    type: "EVENT",
    description: "부원 간 식사 인증",
    timeAgo: "25분 전",
    grantedXp: 5,
    status: "PENDING",
  },
  {
    id: 104,
    userName: "권유진",
    type: "ATTENDANCE",
    description: "정기모임 #8 출석",
    timeAgo: "2시간 전",
    grantedXp: 3,
    status: "APPROVED",
  },
];

const semesterRankings = [
  {
    rank: 1,
    name: "권유진",
    studentId: "2021123456",
    department: "컴퓨터정보공학부",
    totalXp: 85,
  },
  {
    rank: 2,
    name: "서진호",
    studentId: "2022234567",
    department: "전자공학과",
    totalXp: 78,
  },
  {
    rank: 3,
    name: "서준하",
    studentId: "2021345678",
    department: "소프트웨어학과",
    totalXp: 72,
  },
  {
    rank: 4,
    name: "최진욱",
    studentId: "2023456789",
    department: "컴퓨터정보공학부",
    totalXp: 68,
  },
  {
    rank: 5,
    name: "배혜윤",
    studentId: "2022567890",
    department: "정보통신전자공학부",
    totalXp: 65,
  },
];

/* ======================
   🔹 투표 더미 데이터 (메모리)
   - 프론트 응답 포맷과 맞춤
   - deadline 추가 (생성 payload에 포함되므로)
====================== */
let votes = [
  {
    voteId: 7,
    title: "워크숍 가고 싶은 장소 (중복 선택 가능)",
    deadline: "2026-03-01T18:00:00",
    status: "IN_PROGRESS",
    isMultiple: true,
    options: [
      { voteOptionId: 33, content: "제주도", count: 0 },
      { voteOptionId: 34, content: "강릉", count: 0 },
      { voteOptionId: 35, content: "부산", count: 0 },
      { voteOptionId: 36, content: "가평", count: 0 },
    ],
  },
  {
    voteId: 6,
    title: "점심 메뉴 투표",
    deadline: "2026-02-20T12:00:00",
    status: "IN_PROGRESS",
    isMultiple: false,
    options: [
      { voteOptionId: 30, content: "짜장면", count: 0 },
      { voteOptionId: 31, content: "짬뽕", count: 0 },
      { voteOptionId: 32, content: "볶음밥", count: 0 },
    ],
  },
  {
    voteId: 4,
    title: "내일 점심 메뉴 변경 (수정)",
    deadline: "2026-02-20T12:00:00",
    status: "CLOSED",
    isMultiple: true,
    options: [
      { voteOptionId: 22, content: "삼겹살", count: 0 },
      { voteOptionId: 23, content: "치킨", count: 1 },
      { voteOptionId: 24, content: "마라탕", count: 1 },
    ],
  },
];

// voteId / optionId 자동 증가
let nextVoteId = Math.max(...votes.map((v) => v.voteId), 0) + 1;
let nextOptionId =
  Math.max(...votes.flatMap((v) => v.options.map((o) => o.voteOptionId)), 0) + 1;

// 유저별 투표 기록 (중복 투표 방지)
// userVoteHistory[userId][voteId] = Set(voteOptionId들)
const userVoteHistory = {};

/* ======================
   🔹 로그인 API (프론트 호환 응답)
====================== */
app.post("/api/auth/login", (req, res) => {
  const { studentId, password } = req.body;

  const user = users.find(
    (u) => u.studentId === studentId && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      code: "AUTH-401",
      status: 401,
      message: "로그인 실패",
      data: null,
    });
  }

  const accessToken = jwt.sign(
    {
      sub: user.id,
      role: user.role,
      name: user.name,
      studentId: user.studentId,
    },
    ACCESS_SECRET,
    { expiresIn: "30m" }
  );

  const refreshToken = jwt.sign({ sub: user.id }, REFRESH_SECRET, {
    expiresIn: "7d",
  });

  return res.json({
    code: "GEN-000",
    status: 200,
    message: "Success",
    data: {
      message: "로그인 성공",
      accessToken,
      refreshToken,
      name: user.name,
      user: {
        id: user.id,
        name: user.name,
        studentId: user.studentId,
        role: user.role,
      },
    },
  });
});

/* ======================
   🔹 관리자 메인 조회
====================== */
app.get("/api/admin/main", (req, res) => {
  res.json({
    dashboardStats: {
      totalMembers: 82,
      totalSemesterXp: 1245,
      pendingApprovals: recentActivityLogs.filter((a) => a.status === "PENDING")
        .length,
      activeSchedules: 3,
    },
    recentActivityLogs,
    semesterRankings,
  });
});

/* ======================
   🔹 승인
====================== */
app.patch("/api/admin/main/:id/approve", (req, res) => {
  const id = Number(req.params.id);

  const activity = recentActivityLogs.find((a) => a.id === id);
  if (!activity) {
    return res.status(404).json({ message: "활동 없음" });
  }

  activity.status = "APPROVED";

  res.json({
    message: "승인 완료",
    activity,
  });
});

/* ======================
   🔹 거부
====================== */
app.delete("/api/admin/main/:id", (req, res) => {
  const id = Number(req.params.id);

  recentActivityLogs = recentActivityLogs.filter((a) => a.id !== id);

  res.json({ message: "거부 완료" });
});

/* ======================
   ✅ 투표 API: 진행중 목록
   GET /api/votes/in-progress
====================== */
app.get("/api/votes/in-progress", auth, (req, res) => {
  const data = votes.filter((v) => v.status === "IN_PROGRESS");

  return res.json({
    code: "GEN-000",
    status: 200,
    message: "Success",
    data,
  });
});

/* ======================
   ✅ 투표 API: 종료 목록
   GET /api/votes/closed
====================== */
app.get("/api/votes/closed", auth, (req, res) => {
  const data = votes.filter((v) => v.status === "CLOSED");

  return res.json({
    code: "GEN-000",
    status: 200,
    message: "Success",
    data,
  });
});

/* ======================
   ✅ 투표 API: 투표하기
   POST /api/votes/:voteId/vote
   - 단일: { voteOptionId: number }
   - 복수: { voteOptionIds: number[] }
====================== */
app.post("/api/votes/:voteId/vote", auth, (req, res) => {
  const voteId = Number(req.params.voteId);
  const userId = req.user.sub;

  const vote = votes.find((v) => v.voteId === voteId);
  if (!vote) {
    return res.status(404).json({
      code: "VOTE-404",
      status: 404,
      message: "투표를 찾을 수 없습니다.",
      data: null,
    });
  }

  if (vote.status !== "IN_PROGRESS") {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "이미 종료된 투표입니다.",
      data: null,
    });
  }

  // 유저 투표 기록 초기화
  userVoteHistory[userId] = userVoteHistory[userId] || {};

  // 이미 투표한 경우 차단
  if (userVoteHistory[userId][voteId]) {
    return res.status(409).json({
      code: "VOTE-409",
      status: 409,
      message: "이미 투표했습니다.",
      data: null,
    });
  }

  // 요청 옵션 추출
  let picked = [];
  if (vote.isMultiple) {
    const { voteOptionIds } = req.body;
    if (!Array.isArray(voteOptionIds) || voteOptionIds.length === 0) {
      return res.status(400).json({
        code: "VOTE-400",
        status: 400,
        message: "voteOptionIds가 필요합니다.",
        data: null,
      });
    }
    picked = voteOptionIds;
  } else {
    const { voteOptionId } = req.body;
    if (typeof voteOptionId !== "number") {
      return res.status(400).json({
        code: "VOTE-400",
        status: 400,
        message: "voteOptionId가 필요합니다.",
        data: null,
      });
    }
    picked = [voteOptionId];
  }

  // 옵션 유효성 검사
  const optionIdSet = new Set(vote.options.map((o) => o.voteOptionId));
  for (const id of picked) {
    if (!optionIdSet.has(id)) {
      return res.status(400).json({
        code: "VOTE-400",
        status: 400,
        message: "잘못된 옵션입니다.",
        data: null,
      });
    }
  }

  // 기록 + count 증가
  userVoteHistory[userId][voteId] = new Set(picked);

  vote.options = vote.options.map((o) =>
    picked.includes(o.voteOptionId) ? { ...o, count: o.count + 1 } : o
  );

  return res.json({
    code: "GEN-000",
    status: 200,
    message: "Success",
    data: vote,
  });
});

/* =========================================================
   ✅✅ 관리자 투표 API (프론트 스펙 그대로)
========================================================= */

/* ======================
   ✅ 관리자: 투표 생성
   POST /api/admin/votes
   body: { title, isMultiple, deadline, options:[{content}] }
====================== */
app.post("/api/admin/votes", auth, adminOnly, (req, res) => {
  const { title, isMultiple, deadline, options } = req.body;

  if (!title || typeof title !== "string" || !title.trim()) {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "title이 필요합니다.",
      data: null,
    });
  }

  if (typeof isMultiple !== "boolean") {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "isMultiple(boolean)가 필요합니다.",
      data: null,
    });
  }

  if (!deadline || typeof deadline !== "string") {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "deadline이 필요합니다.",
      data: null,
    });
  }

  if (!Array.isArray(options) || options.length < 2) {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "options는 최소 2개가 필요합니다.",
      data: null,
    });
  }

  const cleaned = options
    .map((o) => String(o?.content ?? "").trim())
    .filter(Boolean);

  if (cleaned.length < 2) {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "options content가 비어있습니다.",
      data: null,
    });
  }

  const lower = cleaned.map((s) => s.toLowerCase());
  if (new Set(lower).size !== lower.length) {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "options가 중복됩니다.",
      data: null,
    });
  }

  const newVote = {
    voteId: nextVoteId++,
    title: title.trim(),
    deadline,
    status: "IN_PROGRESS",
    isMultiple,
    options: cleaned.map((content) => ({
      voteOptionId: nextOptionId++,
      content,
      count: 0,
    })),
  };

  votes.unshift(newVote);

  return res.status(201).json({
    code: "GEN-000",
    status: 201,
    message: "Success",
    data: newVote,
  });
});

/* ======================
   ✅ 관리자: 옵션 추가
   POST /api/admin/votes/:voteId/options
   body: { content }
====================== */
app.post("/api/admin/votes/:voteId/options", auth, adminOnly, (req, res) => {
  const voteId = Number(req.params.voteId);
  const { content } = req.body;

  const vote = votes.find((v) => v.voteId === voteId);
  if (!vote) {
    return res.status(404).json({
      code: "VOTE-404",
      status: 404,
      message: "투표를 찾을 수 없습니다.",
      data: null,
    });
  }

  if (vote.status !== "IN_PROGRESS") {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "종료된 투표는 옵션을 추가할 수 없습니다.",
      data: null,
    });
  }

  const text = String(content ?? "").trim();
  if (!text) {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "content가 필요합니다.",
      data: null,
    });
  }

  if (vote.options.length >= 10) {
    return res.status(400).json({
      code: "VOTE-400",
      status: 400,
      message: "옵션은 최대 10개까지 가능합니다.",
      data: null,
    });
  }

  const exists = vote.options.some(
    (o) => o.content.trim().toLowerCase() === text.toLowerCase()
  );
  if (exists) {
    return res.status(409).json({
      code: "VOTE-409",
      status: 409,
      message: "이미 존재하는 옵션입니다.",
      data: null,
    });
  }

  vote.options.push({
    voteOptionId: nextOptionId++,
    content: text,
    count: 0,
  });

  return res.status(201).json({
    code: "GEN-000",
    status: 201,
    message: "Success",
    data: vote,
  });
});

/* ======================
   ✅ 관리자: 옵션 삭제
   DELETE /api/admin/votes/:voteId/options/:optionsId
====================== */
app.delete(
  "/api/admin/votes/:voteId/options/:optionsId",
  auth,
  adminOnly,
  (req, res) => {
    const voteId = Number(req.params.voteId);
    const optionId = Number(req.params.optionsId);

    const vote = votes.find((v) => v.voteId === voteId);
    if (!vote) {
      return res.status(404).json({
        code: "VOTE-404",
        status: 404,
        message: "투표를 찾을 수 없습니다.",
        data: null,
      });
    }

    if (vote.status !== "IN_PROGRESS") {
      return res.status(400).json({
        code: "VOTE-400",
        status: 400,
        message: "종료된 투표는 옵션을 삭제할 수 없습니다.",
        data: null,
      });
    }

    if (vote.options.length <= 2) {
      return res.status(400).json({
        code: "VOTE-400",
        status: 400,
        message: "옵션은 최소 2개를 유지해야 합니다.",
        data: null,
      });
    }

    const before = vote.options.length;
    vote.options = vote.options.filter((o) => o.voteOptionId !== optionId);

    if (vote.options.length === before) {
      return res.status(404).json({
        code: "VOTE-404",
        status: 404,
        message: "옵션을 찾을 수 없습니다.",
        data: null,
      });
    }

    // 유저 투표 기록에서도 제거(선택)
    for (const userId of Object.keys(userVoteHistory)) {
      if (userVoteHistory[userId]?.[voteId]) {
        userVoteHistory[userId][voteId].delete(optionId);
      }
    }

    return res.json({
      code: "GEN-000",
      status: 200,
      message: "Success",
      data: vote,
    });
  }
);

/* ======================
   ✅ 관리자: 투표 삭제
   DELETE /api/admin/votes/:voteId
====================== */
app.delete("/api/admin/votes/:voteId", auth, adminOnly, (req, res) => {
  const voteId = Number(req.params.voteId);

  const before = votes.length;
  votes = votes.filter((v) => v.voteId !== voteId);

  if (votes.length === before) {
    return res.status(404).json({
      code: "VOTE-404",
      status: 404,
      message: "투표를 찾을 수 없습니다.",
      data: null,
    });
  }

  // 투표 기록 정리
  for (const userId of Object.keys(userVoteHistory)) {
    delete userVoteHistory[userId]?.[voteId];
  }

  return res.json({
    code: "GEN-000",
    status: 200,
    message: "Success",
    data: null,
  });
});

/* ======================
   ✅ 관리자: 투표 종료
   PATCH /api/admin/votes/:voteId/close
====================== */
app.patch("/api/admin/votes/:voteId/close", auth, adminOnly, (req, res) => {
  const voteId = Number(req.params.voteId);

  const vote = votes.find((v) => v.voteId === voteId);
  if (!vote) {
    return res.status(404).json({
      code: "VOTE-404",
      status: 404,
      message: "투표를 찾을 수 없습니다.",
      data: null,
    });
  }

  vote.status = "CLOSED";

  return res.json({
    code: "GEN-000",
    status: 200,
    message: "Success",
    data: vote,
  });
});

/* ======================
   🔹 서버 시작 (Vite 기준 8080)
====================== */
app.use((req, res) => {
  res.status(404).json({
    code: "NOT-FOUND",
    status: 404,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
    data: null,
  });
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});