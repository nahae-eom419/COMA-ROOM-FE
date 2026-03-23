import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface Notice {
  id: number;
  title: string;
  type: "일반" | "중요";
  category: "운영" | "일정" | "행사" | "안내";
  author: string;
  date: string;
  content: string;
  isPinned: boolean;
  isPublic: boolean;
}

interface NoticeContextType {
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (id: number, notice: Partial<Notice>) => void;
  deleteNotice: (id: number) => void;
  togglePin: (id: number) => void;
  togglePublic: (id: number) => void;
}

const NoticeContext = createContext<NoticeContextType | undefined>(undefined);

// 초기 공지사항 데이터
const initialNotices: Notice[] = [
  {
    id: 1,
    title: "2025년 1학기 정기모임 일정 안내",
    type: "중요",
    category: "운영",
    author: "운영진",
    date: "2025-01-20",
    content: "매주 수요일 저녁 7시 정기모임이 진행됩니다. 많은 참여 부탁드립니다.",
    isPinned: true,
    isPublic: true,
  },
  {
    id: 2,
    title: "정기모임 장소 변경 안내",
    type: "중요",
    category: "일정",
    author: "운영진",
    date: "2025-01-18",
    content: "다음 정기모임(1월 27일)은 공학관 세미나실에서 진행됩니다. 동아리방이 아닌 점 유의해주세요.",
    isPinned: true,
    isPublic: true,
  },
  {
    id: 3,
    title: "신입생 환영회 개최",
    type: "일반",
    category: "행사",
    author: "운영진",
    date: "2025-01-15",
    content: "2월 5일 신입생 환영회를 개최합니다. 자세한 내용은 추후 공지하겠습니다.",
    isPinned: false,
    isPublic: true,
  },
  {
    id: 4,
    title: "동아리방 이용 규칙 안내",
    type: "일반",
    category: "안내",
    author: "운영진",
    date: "2025-01-10",
    content: "동아리방 사용 후에는 정리정돈을 부탁드립니다. 특히 음식물 쓰레기는 반드시 처리해주세요.",
    isPinned: false,
    isPublic: true,
  },
  {
    id: 5,
    title: "마니또 이벤트 종료",
    type: "일반",
    category: "행사",
    author: "운영진",
    date: "2025-01-08",
    content: "1학기 마니또 이벤트가 종료되었습니다. 많은 참여 감사드립니다.",
    isPinned: false,
    isPublic: false,
  },
];

export const NoticeProvider = ({ children }: { children: ReactNode }) => {
  const [notices, setNotices] = useState<Notice[]>(initialNotices);

  const addNotice = (notice: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...notice,
      id: Date.now(),
    };
    setNotices(prev => [newNotice, ...prev]);
  };

  const updateNotice = (id: number, updatedFields: Partial<Notice>) => {
    setNotices(prev => prev.map(notice => 
      notice.id === id ? { ...notice, ...updatedFields } : notice
    ));
  };

  const deleteNotice = (id: number) => {
    setNotices(prev => prev.filter(notice => notice.id !== id));
  };

  const togglePin = (id: number) => {
    setNotices(prev => prev.map(notice => 
      notice.id === id ? { ...notice, isPinned: !notice.isPinned } : notice
    ));
  };

  const togglePublic = (id: number) => {
    setNotices(prev => prev.map(notice => 
      notice.id === id ? { ...notice, isPublic: !notice.isPublic } : notice
    ));
  };

  return (
    <NoticeContext.Provider value={{ notices, addNotice, updateNotice, deleteNotice, togglePin, togglePublic }}>
      {children}
    </NoticeContext.Provider>
  );
};

export const useNotice = () => {
  const context = useContext(NoticeContext);
  if (context === undefined) {
    throw new Error('useNotice must be used within a NoticeProvider');
  }
  return context;
};
