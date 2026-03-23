import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Users, Sparkles, ClipboardCheck, Megaphone, LayoutDashboard, CheckSquare, Plus, Pin, Eye, EyeOff, Edit, Trash2, X } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// 투표 데이터
const votesData = [
  {
    id: 1,
    title: "2025 운영 방향 투표",
    description: "2025년 동아리 운영 방향을 결정합니다",
    xp: "+2XP",
    options: [
      { label: "프로젝트 중심 활동 강화", votes: 15, percentage: 54 },
      { label: "스터디 및 세미나 위주", votes: 10, percentage: 36 },
      { label: "네트워킹 및 친목 강화", votes: 3, percentage: 11 },
    ],
    totalVotes: 28,
    maxVotes: 30,
    startDate: "1월 10일",
    status: "completed" as const,
  },
  {
    id: 2,
    title: "다음 세미나 주제",
    description: "2월 정기 세미나 주제를 선택해주세요",
    xp: "+2XP",
    options: [
      { label: "AI/ML 프로젝트 활용", votes: 0, percentage: 0 },
      { label: "웹 개발 최신 트렌드", votes: 0, percentage: 0 },
      { label: "클린 코드 작성법", votes: 0, percentage: 0 },
    ],
    totalVotes: 0,
    maxVotes: 30,
    startDate: "12/30",
    endDate: "1월 15일",
    status: "ongoing" as const,
  },
];

// 공지사항 데이터
const noticesData = [
  {
    id: 1,
    title: "2025년 1학기 정기모임 일정 안내",
    type: "중요" as const,
    author: "운영진",
    date: "2025-01-20",
    content: "매주 수요일 저녁 7시 정기모임이 진행됩니다. 많은 참여 부탁드립니다.",
    isPinned: true,
    isPublic: true,
  },
  {
    id: 2,
    title: "신입생 환영회 개최",
    type: "일반" as const,
    author: "운영진",
    date: "2025-01-18",
    content: "2월 5일 신입생 환영회를 개최합니다. 자세한 내용은 추후 공지하겠습니다.",
    isPinned: false,
    isPublic: true,
  },
  {
    id: 3,
    title: "마니또 이벤트 종료",
    type: "일반" as const,
    author: "운영진",
    date: "2025-01-15",
    content: "1학기 마니또 이벤트가 종료되었습니다. 많은 참여 감사드립니다.",
    isPinned: false,
    isPublic: false,
  },
];

const Admin_Vote = () => {
  const navigate = useNavigate();
  const [mainTab, setMainTab] = useState<"vote" | "notice">("vote");
  const [voteTab, setVoteTab] = useState<"ongoing" | "completed">("ongoing");
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [notices, setNotices] = useState(noticesData);
  
  // Notice modal states
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeCategory, setNoticeCategory] = useState<"일반" | "중요" | "긴급">("일반");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<"일반" | "중요" | "긴급">("일반");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  
  // Delete confirmation states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const publicCount = notices.filter(n => n.isPublic).length;
  const pinnedCount = notices.filter(n => n.isPinned).length;
  const totalCount = notices.length;

  const handleTogglePin = (id: number) => {
    setNotices(prev => prev.map(n => 
      n.id === id ? { ...n, isPinned: !n.isPinned } : n
    ));
  };

  const handleTogglePublic = (id: number) => {
    setNotices(prev => prev.map(n => 
      n.id === id ? { ...n, isPublic: !n.isPublic } : n
    ));
  };

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      setNotices(prev => prev.filter(n => n.id !== deleteTargetId));
    }
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleEditClick = (notice: typeof notices[0]) => {
    setEditTargetId(notice.id);
    setEditCategory(notice.type === "중요" ? "중요" : "일반");
    setEditTitle(notice.title);
    setEditContent(notice.content);
    setIsEditModalOpen(true);
  };

  const handleUpdateNotice = () => {
    if (!editTitle.trim() || editTargetId === null) return;
    
    setNotices(prev => prev.map(n => 
      n.id === editTargetId 
        ? { 
            ...n, 
            title: editTitle, 
            content: editContent,
            type: editCategory === "긴급" ? "중요" as const : editCategory as "일반" | "중요",
            isPinned: editCategory === "긴급" ? true : n.isPinned,
          } 
        : n
    ));
    setIsEditModalOpen(false);
    setEditTargetId(null);
    setEditTitle("");
    setEditContent("");
    setEditCategory("일반");
  };

  const handleCreateNotice = () => {
    if (!noticeTitle.trim()) return;
    
    const newNotice = {
      id: Date.now(),
      title: noticeTitle,
      type: noticeCategory === "긴급" ? "중요" as const : noticeCategory as "일반" | "중요",
      author: "운영진",
      date: new Date().toISOString().split('T')[0],
      content: noticeContent,
      isPinned: noticeCategory === "긴급",
      isPublic: true,
    };
    
    setNotices(prev => [newNotice, ...prev]);
    setIsNoticeModalOpen(false);
    setNoticeTitle("");
    setNoticeContent("");
    setNoticeCategory("일반");
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
                  onClick={() => navigate('/')}
                >
                  <User className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span style={{ color: '#0F4C3A' }}>로그아웃</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {/* Admin Mode Badge */}
        <div className="mt-2">
          <span 
            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium"
            style={{ backgroundColor: '#FE9A00', color: '#FFFFFF' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            관리자 모드
          </span>
        </div>
      </header>

      {/* Main Tab Navigation */}
      <div 
        className="flex border-b"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}
      >
        <button
          onClick={() => setMainTab("vote")}
          className="flex-1 py-3 text-sm font-medium transition-colors"
          style={{ 
            color: mainTab === "vote" ? '#10B981' : '#6B7280',
            borderBottom: mainTab === "vote" ? '2px solid #10B981' : '2px solid transparent'
          }}
        >
          투표
        </button>
        <button
          onClick={() => setMainTab("notice")}
          className="flex-1 py-3 text-sm font-medium transition-colors"
          style={{ 
            color: mainTab === "notice" ? '#10B981' : '#6B7280',
            borderBottom: mainTab === "notice" ? '2px solid #10B981' : '2px solid transparent'
          }}
        >
          공지사항
        </button>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24">
        {mainTab === "vote" ? (
          <>
            {/* Vote Page Title */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <CheckSquare className="w-5 h-5" style={{ color: '#0F4C3A' }} />
                <h1 className="text-xl font-bold" style={{ color: '#0F4C3A' }}>투표</h1>
              </div>
              <button 
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                onClick={() => navigate('/admin/vote/create')}
              >
                <Plus className="w-4 h-4" />
                투표 만들기
              </button>
            </div>
            <p className="text-sm mb-4" style={{ color: '#6B7280' }}>의견을 공유하고 XP를 받으세요</p>

            {/* Vote Tab Filter */}
            <div 
              className="flex rounded-lg p-1 mb-6"
              style={{ backgroundColor: '#F1F5F9' }}
            >
              <button
                onClick={() => setVoteTab("ongoing")}
                className="flex-1 py-2 text-sm font-medium rounded-md transition-colors"
                style={{ 
                  backgroundColor: voteTab === "ongoing" ? '#FFFFFF' : 'transparent',
                  color: voteTab === "ongoing" ? '#10B981' : '#6B7280'
                }}
              >
                진행 중
              </button>
              <button
                onClick={() => setVoteTab("completed")}
                className="flex-1 py-2 text-sm font-medium rounded-md transition-colors"
                style={{ 
                  backgroundColor: voteTab === "completed" ? '#FFFFFF' : 'transparent',
                  color: voteTab === "completed" ? '#10B981' : '#6B7280'
                }}
              >
                종료됨
              </button>
            </div>

            {/* Vote Cards */}
            <div className="space-y-4 mb-6">
              {voteTab === "completed" && votesData.filter(v => v.status === "completed").map((vote) => (
                <div
                  key={vote.id}
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold" style={{ color: '#0F4C3A' }}>{vote.title}</h3>
                    <span 
                      className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      {vote.xp}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{vote.description}</p>

                  <div className="space-y-3 mb-4">
                    {vote.options.map((option, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm" style={{ color: '#0F4C3A' }}>{option.label}</span>
                          <span className="text-sm" style={{ color: '#6B7280' }}>{option.votes}표 ({option.percentage}%)</span>
                        </div>
                        <div 
                          className="h-2 rounded-full overflow-hidden"
                          style={{ backgroundColor: '#D1FAE5' }}
                        >
                          <div 
                            className="h-full rounded-full transition-all"
                            style={{ width: `${option.percentage}%`, backgroundColor: '#10B981' }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#6B7280' }}>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {vote.totalVotes}/{vote.maxVotes}
                      </span>
                      <span>~{vote.startDate}</span>
                    </div>
                    <span className="flex items-center gap-1 text-xs font-medium" style={{ color: '#10B981' }}>
                      <CheckSquare className="w-3 h-3" />
                      투표 완료
                    </span>
                  </div>
                </div>
              ))}

              {voteTab === "ongoing" && votesData.filter(v => v.status === "ongoing").map((vote) => (
                <div
                  key={vote.id}
                  className="rounded-2xl p-4"
                  style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold" style={{ color: '#0F4C3A' }}>{vote.title}</h3>
                    <span 
                      className="flex items-center gap-1 text-xs font-medium px-2 py-1 rounded"
                      style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                    >
                      <Sparkles className="w-3 h-3" />
                      {vote.xp}
                    </span>
                  </div>
                  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{vote.description}</p>

                  <div className="space-y-3 mb-4">
                    {vote.options.map((option, index) => (
                      <label
                        key={index}
                        className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors"
                        style={{ 
                          backgroundColor: selectedOption === index ? '#D1FAE5' : '#F8FFFE',
                          border: selectedOption === index ? '1px solid #10B981' : '1px solid #D1FAE5'
                        }}
                      >
                        <div 
                          className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                          style={{ borderColor: selectedOption === index ? '#10B981' : '#D1FAE5' }}
                        >
                          {selectedOption === index && (
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: '#10B981' }} />
                          )}
                        </div>
                        <span className="text-sm" style={{ color: '#0F4C3A' }}>{option.label}</span>
                        <input
                          type="radio"
                          name={`vote-${vote.id}`}
                          className="hidden"
                          checked={selectedOption === index}
                          onChange={() => setSelectedOption(index)}
                        />
                      </label>
                    ))}
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-xs" style={{ color: '#6B7280' }}>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {vote.startDate}
                      </span>
                      <span>~{vote.endDate}</span>
                    </div>
                    <button
                      className="px-4 py-2 rounded-lg text-sm font-medium"
                      style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                    >
                      투표하기
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Vote Info Card */}
            <div 
              className="rounded-2xl p-4"
              style={{ backgroundColor: '#F1F5F9', border: '1px solid #D1FAE5' }}
            >
              <h4 className="font-bold mb-3 flex items-center gap-2" style={{ color: '#FE9A00' }}>
                💡 투표 안내
              </h4>
              <ul className="space-y-1 text-sm" style={{ color: '#6B7280' }}>
                <li>• 투표 참여 시 2 XP를 받아요</li>
                <li>• 각 투표는 1회만 참여 가능합니다</li>
                <li>• 마감 전까지 투표를 완료해주세요</li>
              </ul>
            </div>
          </>
        ) : (
          <>
            {/* Notice Page Title */}
            <div className="flex items-center justify-between mb-2">
              <h1 className="text-xl font-bold" style={{ color: '#10B981' }}>공지사항 관리</h1>
              <button 
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium"
                style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                onClick={() => setIsNoticeModalOpen(true)}
              >
                <Plus className="w-4 h-4" />
                새 공지
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: '#6B7280' }}>동아리 공지사항을 작성하고 관리하세요</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
              >
                <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{publicCount}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>공개 중</p>
              </div>
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
              >
                <p className="text-2xl font-bold" style={{ color: '#FE9A00' }}>{pinnedCount}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>고정됨</p>
              </div>
              <div 
                className="rounded-xl p-4 text-center"
                style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
              >
                <p className="text-2xl font-bold" style={{ color: '#0F4C3A' }}>{totalCount}</p>
                <p className="text-xs" style={{ color: '#6B7280' }}>전체</p>
              </div>
            </div>

            {/* Section Title */}
            <h2 className="font-bold mb-4" style={{ color: '#0F4C3A' }}>전체 공지사항</h2>

            {/* Notice List */}
            <div className="space-y-4">
              {notices.map((notice) => (
                <div
                  key={notice.id}
                  className="rounded-2xl p-4"
                  style={{ 
                    backgroundColor: '#FFFFFF', 
                    border: notice.isPinned ? '2px solid #FFD230' : '1px solid #D1FAE5',
                    boxShadow: notice.isPinned ? '0 2px 8px rgba(255, 210, 48, 0.15)' : 'none'
                  }}
                >
                  <div className="flex items-start gap-2 mb-2">
                    {notice.isPinned && (
                      <Pin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: '#FE9A00' }} />
                    )}
                    <div className="flex-1">
                      <h3 className="font-bold text-sm" style={{ color: '#0F4C3A' }}>{notice.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span 
                          className="px-2 py-0.5 rounded text-xs font-medium"
                          style={{ 
                            backgroundColor: notice.type === "중요" ? '#EF4444' : '#D1FAE5',
                            color: notice.type === "중요" ? '#FFFFFF' : '#10B981'
                          }}
                        >
                          {notice.type}
                        </span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>{notice.author}</span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>·</span>
                        <span className="text-xs" style={{ color: '#6B7280' }}>{notice.date}</span>
                        {!notice.isPublic && (
                          <span 
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: '#FFFBEB', color: '#FE9A00' }}
                          >
                            비공개
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="text-sm mb-4" style={{ color: '#6B7280' }}>{notice.content}</p>

                  <div className="flex items-center gap-4">
                    <button 
                      onClick={() => handleTogglePin(notice.id)}
                      className="flex items-center gap-1 text-xs"
                      style={{ color: notice.isPinned ? '#FE9A00' : '#10B981' }}
                    >
                      <Pin className="w-3.5 h-3.5" />
                      {notice.isPinned ? '고정 해제' : '고정'}
                    </button>
                    <button 
                      onClick={() => handleTogglePublic(notice.id)}
                      className="flex items-center gap-1 text-xs"
                      style={{ color: '#6B7280' }}
                    >
                      {notice.isPublic ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5" />
                          숨기기
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5" />
                          공개
                        </>
                      )}
                    </button>
                    <button 
                      onClick={() => handleEditClick(notice)}
                      className="flex items-center gap-1 text-xs"
                      style={{ color: '#10B981' }}
                    >
                      <Edit className="w-3.5 h-3.5" />
                      수정
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(notice.id)}
                      className="flex items-center gap-1 text-xs"
                      style={{ color: '#EF4444' }}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      삭제
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#D1FAE5' }}
      >
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/admin')}
        >
          <LayoutDashboard className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>대시보드</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/admin/members')}
        >
          <Users className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>부원</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/admin/xp')}
        >
          <Sparkles className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>XP</span>
        </button>
        <button 
          className="flex flex-col items-center gap-1"
          onClick={() => navigate('/admin/attendance')}
        >
          <ClipboardCheck className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>출석</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <Megaphone className="w-5 h-5" style={{ color: '#10B981' }} />
          <span className="text-xs font-medium" style={{ color: '#10B981' }}>공지</span>
        </button>
      </nav>

      {/* Notice Creation Modal */}
      <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
        <DialogContent 
          className="w-[calc(100%-2rem)] max-w-[340px] rounded-2xl p-0 border-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          style={{ backgroundColor: '#FFFFFF' }}
          hideCloseButton
        >
          <div className="p-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <DialogTitle className="text-lg font-bold" style={{ color: '#0F4C3A' }}>
                새 공지사항 작성
              </DialogTitle>
              <button 
                onClick={() => setIsNoticeModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
                카테고리
              </label>
              <div className="flex gap-2">
                {(["일반", "중요", "긴급"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNoticeCategory(cat)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: noticeCategory === cat ? '#10B981' : '#F0FDF4',
                      color: noticeCategory === cat ? '#FFFFFF' : '#0F4C3A',
                      border: noticeCategory === cat ? 'none' : '1px solid #D1FAE5'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
                제목
              </label>
              <Input
                placeholder="공지사항 제목을 입력하세요"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="w-full rounded-xl"
                style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
                내용
              </label>
              <Textarea
                placeholder="공지사항 내용을 입력하세요"
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                className="w-full rounded-xl min-h-[100px] resize-none"
                style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleCreateNotice}
              className="w-full py-3 rounded-xl text-base font-medium"
              style={{ 
                background: 'linear-gradient(135deg, #10B981 0%, #0A6647 100%)',
                color: '#FFFFFF'
              }}
            >
              공지 작성
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Notice Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent 
          className="w-[calc(100%-2rem)] max-w-[340px] rounded-2xl p-0 border-0 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]"
          style={{ backgroundColor: '#FFFFFF' }}
          hideCloseButton
        >
          <div className="p-4">
            {/* Modal Header */}
            <div className="flex items-center justify-between mb-5">
              <DialogTitle className="text-lg font-bold" style={{ color: '#0F4C3A' }}>
                공지사항 수정
              </DialogTitle>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
              >
                <X className="w-5 h-5" style={{ color: '#6B7280' }} />
              </button>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
                카테고리
              </label>
              <div className="flex gap-2">
                {(["일반", "중요", "긴급"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEditCategory(cat)}
                    className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    style={{ 
                      backgroundColor: editCategory === cat ? '#10B981' : '#F0FDF4',
                      color: editCategory === cat ? '#FFFFFF' : '#0F4C3A',
                      border: editCategory === cat ? 'none' : '1px solid #D1FAE5'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Title Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
                제목
              </label>
              <Input
                placeholder="공지사항 제목을 입력하세요"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full rounded-xl"
                style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}
              />
            </div>

            {/* Content Textarea */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>
                내용
              </label>
              <Textarea
                placeholder="공지사항 내용을 입력하세요"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="w-full rounded-xl min-h-[100px] resize-none"
                style={{ backgroundColor: '#F0FDF4', border: '1px solid #D1FAE5' }}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleUpdateNotice}
              className="w-full py-3 rounded-xl text-base font-medium"
              style={{ 
                background: 'linear-gradient(135deg, #10B981 0%, #0A6647 100%)',
                color: '#FFFFFF'
              }}
            >
              수정 완료
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent 
          className="w-[calc(100%-2rem)] max-w-[320px] rounded-2xl p-5 border-0"
          style={{ backgroundColor: '#FFFFFF' }}
        >
          <AlertDialogHeader>
            <AlertDialogTitle className="text-center font-bold" style={{ color: '#0F4C3A' }}>
              공지사항 삭제
            </AlertDialogTitle>
            <AlertDialogDescription className="text-center text-sm" style={{ color: '#6B7280' }}>
              이 공지사항을 삭제하시겠습니까? 삭제된 공지사항은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row gap-3 mt-4">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#EF4444', color: '#FFFFFF' }}
            >
              삭제
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 py-3 rounded-xl text-sm font-medium"
              style={{ backgroundColor: '#F1F5F9', color: '#6B7280' }}
            >
              취소
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Admin_Vote;
