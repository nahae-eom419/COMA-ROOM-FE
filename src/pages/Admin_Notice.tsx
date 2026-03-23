import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Users, Sparkles, ClipboardCheck, Megaphone, LayoutDashboard, FileText, Plus, Pin, Eye, EyeOff, Edit, Trash2 } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useNotice, Notice } from "@/contexts/NoticeContext";
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

const Admin_Notice = () => {
  const navigate = useNavigate();
  const { notices, addNotice, updateNotice, deleteNotice, togglePin, togglePublic } = useNotice();
  
  // Notice modal states
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [noticeCategory, setNoticeCategory] = useState<"일반" | "중요" | "긴급">("일반");
  const [noticeCategoryType, setNoticeCategoryType] = useState<"운영" | "일정" | "행사" | "안내">("운영");
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeContent, setNoticeContent] = useState("");
  
  // Edit modal states
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editTargetId, setEditTargetId] = useState<number | null>(null);
  const [editCategory, setEditCategory] = useState<"일반" | "중요" | "긴급">("일반");
  const [editCategoryType, setEditCategoryType] = useState<"운영" | "일정" | "행사" | "안내">("운영");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  
  // Delete confirmation states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const publicCount = notices.filter(n => n.isPublic).length;
  const pinnedCount = notices.filter(n => n.isPinned).length;
  const totalCount = notices.length;

  const handleDeleteClick = (id: number) => {
    setDeleteTargetId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId !== null) {
      deleteNotice(deleteTargetId);
    }
    setIsDeleteDialogOpen(false);
    setDeleteTargetId(null);
  };

  const handleEditClick = (notice: Notice) => {
    setEditTargetId(notice.id);
    setEditCategory(notice.type === "중요" ? "중요" : "일반");
    setEditCategoryType(notice.category);
    setEditTitle(notice.title);
    setEditContent(notice.content);
    setIsEditModalOpen(true);
  };

  const handleUpdateNotice = () => {
    if (!editTitle.trim() || editTargetId === null) return;
    
    updateNotice(editTargetId, {
      title: editTitle,
      content: editContent,
      type: editCategory === "긴급" ? "중요" : editCategory as "일반" | "중요",
      category: editCategoryType,
      isPinned: editCategory === "긴급" ? true : undefined,
    });
    
    setIsEditModalOpen(false);
    setEditTargetId(null);
    setEditTitle("");
    setEditContent("");
    setEditCategory("일반");
    setEditCategoryType("운영");
  };

  const handleCreateNotice = () => {
    if (!noticeTitle.trim()) return;
    
    addNotice({
      title: noticeTitle,
      type: noticeCategory === "긴급" ? "중요" : noticeCategory as "일반" | "중요",
      category: noticeCategoryType,
      author: "운영진",
      date: new Date().toISOString().split('T')[0],
      content: noticeContent,
      isPinned: noticeCategory === "긴급",
      isPublic: true,
    });
    
    setIsNoticeModalOpen(false);
    setNoticeTitle("");
    setNoticeContent("");
    setNoticeCategory("일반");
    setNoticeCategoryType("운영");
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

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24">
        {/* Page Title */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5" style={{ color: '#0F4C3A' }} />
            <h1 className="text-xl font-bold" style={{ color: '#0F4C3A' }}>공지사항 관리</h1>
          </div>
          <button 
            className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
            onClick={() => setIsNoticeModalOpen(true)}
          >
            <Plus className="w-4 h-4" />
            공지 작성
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>공지사항을 작성하고 관리하세요</p>

        {/* Notice Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{totalCount}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>전체</p>
          </div>
          <div 
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{publicCount}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>공개</p>
          </div>
          <div 
            className="rounded-xl p-3 text-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{pinnedCount}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>고정</p>
          </div>
        </div>

        {/* Notice List */}
        <div className="space-y-3">
          {notices.map((notice) => (
            <div
              key={notice.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ 
                        backgroundColor: notice.type === "중요" ? '#FEE685' : '#D1FAE5',
                        color: notice.type === "중요" ? '#FE9A00' : '#10B981'
                      }}
                    >
                      {notice.type}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: '#E5E7EB', color: '#6B7280' }}
                    >
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <Pin className="w-3 h-3" style={{ color: '#FE9A00' }} />
                    )}
                    {!notice.isPublic && (
                      <EyeOff className="w-3 h-3" style={{ color: '#6B7280' }} />
                    )}
                  </div>
                  <h4 className="font-semibold text-sm mb-1" style={{ color: '#0F4C3A' }}>{notice.title}</h4>
                  <p className="text-xs" style={{ color: '#6B7280' }}>{notice.date} · {notice.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-3">
                <button
                  onClick={() => togglePin(notice.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ 
                    backgroundColor: notice.isPinned ? '#FEE685' : '#F1F5F9',
                    color: notice.isPinned ? '#FE9A00' : '#6B7280'
                  }}
                >
                  <Pin className="w-3 h-3" />
                  {notice.isPinned ? '고정 해제' : '고정'}
                </button>
                <button
                  onClick={() => togglePublic(notice.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ 
                    backgroundColor: notice.isPublic ? '#D1FAE5' : '#F1F5F9',
                    color: notice.isPublic ? '#10B981' : '#6B7280'
                  }}
                >
                  {notice.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                  {notice.isPublic ? '공개' : '비공개'}
                </button>
                <button
                  onClick={() => handleEditClick(notice)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: '#E0E7FF', color: '#6366F1' }}
                >
                  <Edit className="w-3 h-3" />
                  수정
                </button>
                <button
                  onClick={() => handleDeleteClick(notice.id)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium"
                  style={{ backgroundColor: '#FFC9C9', color: '#E7000B' }}
                >
                  <Trash2 className="w-3 h-3" />
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Create Notice Modal */}
      <Dialog open={isNoticeModalOpen} onOpenChange={setIsNoticeModalOpen}>
        <DialogContent className="mx-4 rounded-2xl max-w-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#0F4C3A' }}>새 공지사항</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                중요도
              </label>
              <div className="flex gap-2">
                {(["일반", "중요", "긴급"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNoticeCategory(cat)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: noticeCategory === cat ? '#10B981' : '#F1F5F9',
                      color: noticeCategory === cat ? '#FFFFFF' : '#6B7280'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                카테고리
              </label>
              <div className="flex gap-2 flex-wrap">
                {(["운영", "일정", "행사", "안내"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setNoticeCategoryType(cat)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: noticeCategoryType === cat ? '#10B981' : '#F1F5F9',
                      color: noticeCategoryType === cat ? '#FFFFFF' : '#6B7280'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                제목
              </label>
              <Input
                placeholder="공지사항 제목을 입력하세요"
                value={noticeTitle}
                onChange={(e) => setNoticeTitle(e.target.value)}
                className="border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                내용
              </label>
              <Textarea
                placeholder="공지사항 내용을 입력하세요"
                value={noticeContent}
                onChange={(e) => setNoticeContent(e.target.value)}
                className="border-gray-200 min-h-[120px]"
              />
            </div>
            <button
              onClick={handleCreateNotice}
              className="w-full py-3 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
            >
              공지사항 등록
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Notice Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="mx-4 rounded-2xl max-w-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <DialogHeader>
            <DialogTitle style={{ color: '#0F4C3A' }}>공지사항 수정</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                중요도
              </label>
              <div className="flex gap-2">
                {(["일반", "중요", "긴급"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEditCategory(cat)}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: editCategory === cat ? '#10B981' : '#F1F5F9',
                      color: editCategory === cat ? '#FFFFFF' : '#6B7280'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                카테고리
              </label>
              <div className="flex gap-2 flex-wrap">
                {(["운영", "일정", "행사", "안내"] as const).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setEditCategoryType(cat)}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
                    style={{
                      backgroundColor: editCategoryType === cat ? '#10B981' : '#F1F5F9',
                      color: editCategoryType === cat ? '#FFFFFF' : '#6B7280'
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                제목
              </label>
              <Input
                placeholder="공지사항 제목을 입력하세요"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="border-gray-200"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#0F4C3A' }}>
                내용
              </label>
              <Textarea
                placeholder="공지사항 내용을 입력하세요"
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                className="border-gray-200 min-h-[120px]"
              />
            </div>
            <button
              onClick={handleUpdateNotice}
              className="w-full py-3 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
            >
              수정 완료
            </button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="mx-4 rounded-2xl max-w-sm" style={{ backgroundColor: '#FFFFFF' }}>
          <AlertDialogHeader>
            <AlertDialogTitle style={{ color: '#0F4C3A' }}>공지사항 삭제</AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#6B7280' }}>
              이 공지사항을 정말 삭제하시겠습니까? 삭제된 공지사항은 복구할 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <button
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#F1F5F9', color: '#6B7280' }}
            >
              취소
            </button>
            <button
              onClick={handleConfirmDelete}
              className="flex-1 py-2.5 rounded-lg text-sm font-medium"
              style={{ backgroundColor: '#E7000B', color: '#FFFFFF' }}
            >
              삭제
            </button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Bottom Navigation */}
      <nav 
        className="fixed bottom-0 left-0 right-0 flex items-center justify-around py-3 border-t z-50"
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
    </div>
  );
};

export default Admin_Notice;
