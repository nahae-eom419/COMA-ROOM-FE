import React, { createContext, useContext, useState, useCallback, ReactNode } from "react";

interface XPActivity {
  id: number;
  title: string;
  type: "출석" | "행사" | "투표";
  date: string;
  xp: number;
}

interface XPContextType {
  totalXP: number;
  activities: XPActivity[];
  addXP: (amount: number, title: string, type: "출석" | "행사" | "투표") => void;
  setTotalXP: (amount: number) => void;
}

const XPContext = createContext<XPContextType | undefined>(undefined);

const initialActivities: XPActivity[] = [
  { id: 1, title: "정기모임 #7", type: "출석", date: "12월 30일", xp: 3 },
  { id: 2, title: "부원 간 식사 인증", type: "행사", date: "12월 28일", xp: 5 },
  { id: 3, title: "연말 파티", type: "행사", date: "12월 27일", xp: 5 },
  { id: 4, title: "2025 운영 방향 투표", type: "투표", date: "12월 26일", xp: 2 },
  { id: 5, title: "정기모임 #6", type: "출석", date: "12월 23일", xp: 3 },
];

const initialTotalXP = initialActivities.reduce((sum, a) => sum + a.xp, 0);

export const XPProvider = ({ children }: { children: ReactNode }) => {
  const [totalXP, setTotalXPState] = useState(initialTotalXP);
  const [activities, setActivities] = useState<XPActivity[]>(initialActivities);

  const addXP = useCallback((amount: number, title: string, type: "출석" | "행사" | "투표") => {
    const today = new Date();
    const dateStr = `${today.getMonth() + 1}월 ${today.getDate()}일`;
    
    const newActivity: XPActivity = {
      id: Date.now(),
      title,
      type,
      date: dateStr,
      xp: amount,
    };

    setActivities(prev => [newActivity, ...prev]);
    setTotalXPState(prev => prev + amount);
  }, []);

  // 관리자가 직접 XP를 설정할 때 사용
  const setTotalXP = useCallback((amount: number) => {
    setTotalXPState(amount);
  }, []);

  return (
    <XPContext.Provider value={{ totalXP, activities, addXP, setTotalXP }}>
      {children}
    </XPContext.Provider>
  );
};

export const useXP = () => {
  const context = useContext(XPContext);
  if (!context) {
    throw new Error("useXP must be used within an XPProvider");
  }
  return context;
};
