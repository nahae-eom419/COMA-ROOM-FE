import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, User, Menu, Users, Sparkles, Search, Edit, Trash2, ChevronLeft, ChevronRight, LayoutDashboard, ClipboardCheck, Megaphone, UserPlus, Plus, Minus } from "lucide-react";
import ComaLogo from "@/components/ComaLogo";
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
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useXP } from "@/contexts/XPContext";
import { useLeaderboard, CURRENT_USER } from "@/contexts/LeaderboardContext";

interface Member {
  id: number;
  rank: number;
  name: string;
  grade: number;
  studentId: string;
  department: string;
  xp: number;
  attendance: number;
  events: number;
}

// 부원 더미 데이터
const initialMembersData: Member[] = [
  { id: 1, rank: 1, name: "서진호", grade: 3, studentId: "2021123456", department: "컴퓨터정보공학부", xp: 85, attendance: 12, events: 5 },
  { id: 2, rank: 2, name: "김동현", grade: 4, studentId: "202121160", department: "컴퓨터정보공학부", xp: 80, attendance: 11, events: 5 },
  { id: 3, rank: 3, name: "엄나해", grade: 3, studentId: "2021123451", department: "컴퓨터정보공학부", xp: 79, attendance: 9, events: 5 },
  { id: 4, rank: 4, name: "서준하", grade: 3, studentId: "202223545", department: "컴퓨터정보공학부", xp: 78, attendance: 9, events: 4 },
  { id: 5, rank: 5, name: "권유진", grade: 3, studentId: "2021123456", department: "컴퓨터정보공학부", xp: 78, attendance: 8, events: 5 },
  { id: 6, rank: 6, name: "최진욱", grade: 3, studentId: "2021111223", department: "컴퓨터정보공학부", xp: 18, attendance: 6, events: 2 },
];

const Admin_Members = () => {
  const navigate = useNavigate();
  const { addXP, setTotalXP } = useXP();
  const { updateMemberXP, setMemberXP } = useLeaderboard();
  const [members, setMembers] = useState<Member[]>(initialMembersData);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 5;

  // Edit Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [editForm, setEditForm] = useState({ name: "", grade: "", studentId: "", department: "" });

  // XP Management Modal State
  const [isXPModalOpen, setIsXPModalOpen] = useState(false);
  const [xpMember, setXPMember] = useState<Member | null>(null);
  const [xpAmount, setXPAmount] = useState(0);
  const [xpReason, setXPReason] = useState("");

  // Delete Dialog State
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingMember, setDeletingMember] = useState<Member | null>(null);

  const filteredMembers = members.filter(
    (member) =>
      member.name.includes(searchQuery) ||
      member.studentId.includes(searchQuery)
  );

  // Recalculate ranks after any member update
  const recalculateRanks = (membersList: Member[]) => {
    return membersList
      .sort((a, b) => b.xp - a.xp)
      .map((member, index) => ({ ...member, rank: index + 1 }));
  };

  // Edit handlers
  const handleEditClick = (member: Member) => {
    setEditingMember(member);
    setEditForm({
      name: member.name,
      grade: member.grade.toString(),
      studentId: member.studentId,
      department: member.department,
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (!editingMember) return;
    
    setMembers(prev => {
      const updated = prev.map(m => 
        m.id === editingMember.id
          ? { ...m, name: editForm.name, grade: parseInt(editForm.grade) || m.grade, studentId: editForm.studentId, department: editForm.department }
          : m
      );
      return recalculateRanks(updated);
    });
    
    setIsEditModalOpen(false);
    setEditingMember(null);
  };

  // XP Management handlers
  const handleXPClick = (member: Member) => {
    setXPMember(member);
    setXPAmount(0);
    setXPReason("");
    setIsXPModalOpen(true);
  };

  const handleXPSave = () => {
    if (!xpMember || xpAmount === 0) return;
    
    const newXP = Math.max(0, xpMember.xp + xpAmount);
    
    // 로컬 멤버 리스트 업데이트
    setMembers(prev => {
      const updated = prev.map(m => 
        m.id === xpMember.id
          ? { ...m, xp: newXP }
          : m
      );
      return recalculateRanks(updated);
    });

    // 리더보드 Context에도 반영
    setMemberXP(xpMember.name, newXP);

    // 로그인한 사용자(최진욱)의 XP인 경우 전역 XP Context에도 반영
    if (xpMember.name === CURRENT_USER) {
      if (xpAmount > 0) {
        addXP(xpAmount, xpReason || "관리자 XP 지급", "행사");
      } else {
        // XP 감소의 경우 totalXP 직접 설정
        setTotalXP(newXP);
      }
    }
    
    setIsXPModalOpen(false);
    setXPMember(null);
  };

  // Delete handlers
  const handleDeleteClick = (member: Member) => {
    setDeletingMember(member);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (!deletingMember) return;
    
    setMembers(prev => {
      const filtered = prev.filter(m => m.id !== deletingMember.id);
      return recalculateRanks(filtered);
    });
    
    setIsDeleteDialogOpen(false);
    setDeletingMember(null);
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
            style={{ backgroundColor: '#008236', color: '#FFFFFF' }}
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white"></div>
            관리자 모드
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-6 pb-24">
        {/* Title Section */}
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold" style={{ color: '#0F4C3A' }}>부원 관리</h1>
          <button 
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
            style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
          >
            <UserPlus className="w-4 h-4" />
            부원 추가
          </button>
        </div>
        <p className="text-sm mb-4" style={{ color: '#6B7280' }}>
          전체 {members.length}명의 부원을 관리하세요
        </p>

        {/* Search Bar */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: '#6B7280' }} />
          <input
            type="text"
            placeholder="이름 또는 학번으로 검색..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl text-sm"
            style={{ 
              backgroundColor: '#FFFFFF', 
              border: '1px solid #D1FAE5',
              color: '#0F4C3A'
            }}
          />
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div 
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{members.length}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>전체 부원</p>
          </div>
          <div 
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{members.length}</p>
            <p className="text-xs" style={{ color: '#6B7280' }}>활성 부원</p>
          </div>
          <div 
            className="rounded-xl p-4 text-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
          >
            <p className="text-2xl font-bold" style={{ color: '#0F4C3A' }}>
              {members.length > 0 ? Math.round(members.reduce((sum, m) => sum + m.xp, 0) / members.length) : 0}
            </p>
            <p className="text-xs" style={{ color: '#6B7280' }}>평균 XP</p>
          </div>
        </div>

        {/* Members List */}
        <div className="space-y-3">
          {filteredMembers.map((member) => (
            <div
              key={member.id}
              className="rounded-xl p-4"
              style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            >
              <div className="flex items-start gap-3">
                {/* Rank Circle */}
                <div 
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                  style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
                >
                  {member.rank}
                </div>

                {/* Member Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="font-bold text-base" style={{ color: '#0F4C3A' }}>
                      {member.name}
                    </span>
                    <span 
                      className="px-2 py-0.5 rounded text-xs font-medium"
                      style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                    >
                      {member.grade}학년
                    </span>
                  </div>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{member.studentId}</p>
                  <p className="text-sm" style={{ color: '#6B7280' }}>{member.department}</p>
                </div>

                {/* XP */}
                <div className="text-right flex-shrink-0">
                  <p className="text-2xl font-bold" style={{ color: '#10B981' }}>{member.xp}</p>
                  <p className="text-xs" style={{ color: '#6B7280' }}>XP</p>
                </div>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-4 mt-3 mb-3">
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span className="text-sm" style={{ color: '#6B7280' }}>출석 {member.attendance}회</span>
                </div>
                <div className="flex items-center gap-1">
                  <Sparkles className="w-4 h-4" style={{ color: '#6B7280' }} />
                  <span className="text-sm" style={{ color: '#6B7280' }}>행사 {member.events}회</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => handleEditClick(member)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: '#D1FAE5', color: '#10B981' }}
                >
                  <Edit className="w-4 h-4" />
                  수정
                </button>
                <button 
                  onClick={() => handleXPClick(member)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium"
                  style={{ backgroundColor: '#FFFFFF', color: '#0F4C3A', border: '1px solid #D1FAE5' }}
                >
                  <Sparkles className="w-4 h-4" />
                  XP 관리
                </button>
                <button 
                  onClick={() => handleDeleteClick(member)}
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ backgroundColor: '#FFC9C9' }}
                >
                  <Trash2 className="w-4 h-4" style={{ color: '#E7000B' }} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          >
            <ChevronLeft className="w-4 h-4" style={{ color: '#6B7280' }} />
          </button>
          {[1, 2, 3, 4, 5].map((page) => (
            <button
              key={page}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium"
              style={{ 
                backgroundColor: currentPage === page ? '#10B981' : '#FFFFFF',
                color: currentPage === page ? '#FFFFFF' : '#6B7280',
                border: currentPage === page ? 'none' : '1px solid #D1FAE5'
              }}
              onClick={() => setCurrentPage(page)}
            >
              {page}
            </button>
          ))}
          <button 
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: '#FFFFFF', border: '1px solid #D1FAE5' }}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          >
            <ChevronRight className="w-4 h-4" style={{ color: '#6B7280' }} />
          </button>
        </div>
      </main>

      {/* Edit Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="rounded-2xl max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold" style={{ color: '#0F4C3A' }}>
              부원 정보 수정
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F4C3A' }}>이름</label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full"
                style={{ borderColor: '#D1FAE5' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F4C3A' }}>학년</label>
              <Input
                type="number"
                min={1}
                max={4}
                value={editForm.grade}
                onChange={(e) => setEditForm(prev => ({ ...prev, grade: e.target.value }))}
                className="w-full"
                style={{ borderColor: '#D1FAE5' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F4C3A' }}>학번</label>
              <Input
                value={editForm.studentId}
                onChange={(e) => setEditForm(prev => ({ ...prev, studentId: e.target.value }))}
                className="w-full"
                style={{ borderColor: '#D1FAE5' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F4C3A' }}>학과</label>
              <Input
                value={editForm.department}
                onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                className="w-full"
                style={{ borderColor: '#D1FAE5' }}
              />
            </div>
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="flex-1"
                style={{ borderColor: '#D1FAE5', color: '#6B7280' }}
              >
                취소
              </Button>
              <Button
                onClick={handleEditSave}
                className="flex-1"
                style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
              >
                저장
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* XP Management Modal */}
      <Dialog open={isXPModalOpen} onOpenChange={setIsXPModalOpen}>
        <DialogContent className="rounded-2xl max-w-sm mx-auto">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold" style={{ color: '#0F4C3A' }}>
              XP 관리 - {xpMember?.name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div 
              className="rounded-xl p-4 text-center"
              style={{ backgroundColor: '#D1FAE5' }}
            >
              <p className="text-sm mb-1" style={{ color: '#6B7280' }}>현재 XP</p>
              <p className="text-3xl font-bold" style={{ color: '#10B981' }}>{xpMember?.xp || 0}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#0F4C3A' }}>XP 조정</label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setXPAmount(prev => prev - 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#FFC9C9' }}
                >
                  <Minus className="w-4 h-4" style={{ color: '#E7000B' }} />
                </button>
                <Input
                  type="number"
                  value={xpAmount}
                  onChange={(e) => setXPAmount(parseInt(e.target.value) || 0)}
                  className="flex-1 text-center text-xl font-bold"
                  style={{ borderColor: '#D1FAE5', color: '#0F4C3A' }}
                />
                <button
                  onClick={() => setXPAmount(prev => prev + 1)}
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: '#D1FAE5' }}
                >
                  <Plus className="w-4 h-4" style={{ color: '#10B981' }} />
                </button>
              </div>
              <p className="text-center text-sm mt-2" style={{ color: '#6B7280' }}>
                변경 후: <span className="font-bold" style={{ color: xpAmount >= 0 ? '#10B981' : '#E7000B' }}>
                  {(xpMember?.xp || 0) + xpAmount} XP
                </span>
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1" style={{ color: '#0F4C3A' }}>사유 (선택)</label>
              <Input
                value={xpReason}
                onChange={(e) => setXPReason(e.target.value)}
                placeholder="예: 특별 활동 참여"
                className="w-full"
                style={{ borderColor: '#D1FAE5' }}
              />
            </div>

            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                onClick={() => setIsXPModalOpen(false)}
                className="flex-1"
                style={{ borderColor: '#D1FAE5', color: '#6B7280' }}
              >
                취소
              </Button>
              <Button
                onClick={handleXPSave}
                disabled={xpAmount === 0}
                className="flex-1"
                style={{ backgroundColor: '#10B981', color: '#FFFFFF' }}
              >
                적용
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent className="rounded-2xl max-w-sm mx-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-lg font-bold" style={{ color: '#0F4C3A' }}>
              부원 삭제
            </AlertDialogTitle>
            <AlertDialogDescription style={{ color: '#6B7280' }}>
              <strong style={{ color: '#E7000B' }}>{deletingMember?.name}</strong> 님을 정말 삭제하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
              className="flex-1"
              style={{ borderColor: '#D1FAE5', color: '#6B7280' }}
            >
              취소
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              className="flex-1"
              style={{ backgroundColor: '#E7000B', color: '#FFFFFF' }}
            >
              삭제
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
        <button className="flex flex-col items-center gap-1">
          <Users className="w-5 h-5" style={{ color: '#10B981' }} />
          <span className="text-xs font-medium" style={{ color: '#10B981' }}>부원</span>
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
        <button 
          className="flex flex-col items-center gap-1" 
          onClick={() => navigate('/admin/notice')}
        >
          <Megaphone className="w-5 h-5" style={{ color: '#6B7280' }} />
          <span className="text-xs" style={{ color: '#6B7280' }}>공지</span>
        </button>
      </nav>
    </div>
  );
};

export default Admin_Members;
