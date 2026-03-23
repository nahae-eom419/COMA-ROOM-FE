import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface RankingMember {
  rank: number;
  name: string;
  anonymousName: string;
  department: string;
  xp: number;
  isMe?: boolean;
}

interface LeaderboardContextType {
  rankings: RankingMember[];
  myRanking: RankingMember | null;
  updateMemberXP: (name: string, xpDelta: number) => void;
  setMemberXP: (name: string, newXP: number) => void;
  updateMemberInfo: (name: string, updates: Partial<RankingMember>) => void;
}

const LeaderboardContext = createContext<LeaderboardContextType | undefined>(undefined);

// 현재 로그인한 사용자 이름
export const CURRENT_USER = "최진욱";

// 초기 랭킹 데이터
const initialRankings: RankingMember[] = [
  { rank: 1, name: "권유진", anonymousName: "권*진", department: "컴퓨터정보공학부", xp: 85 },
  { rank: 2, name: "서진호", anonymousName: "서*호", department: "전자공학과", xp: 78 },
  { rank: 3, name: "서준하", anonymousName: "서*하", department: "소프트웨어학과", xp: 72 },
  { rank: 4, name: "배혜윤", anonymousName: "배*윤", department: "컴퓨터정보공학부", xp: 68 },
  { rank: 5, name: "김민수", anonymousName: "김*수", department: "정보통신전자공학부", xp: 65 },
  { rank: 6, name: "이현우", anonymousName: "이*우", department: "컴퓨터정보공학부", xp: 62 },
  { rank: 7, name: "박지원", anonymousName: "박*원", department: "전자공학과", xp: 58 },
  { rank: 8, name: "정다은", anonymousName: "정*은", department: "소프트웨어학과", xp: 52 },
  { rank: 9, name: "임서연", anonymousName: "임*연", department: "정보통신전자공학부", xp: 48 },
  { rank: 10, name: "한지우", anonymousName: "한*우", department: "컴퓨터정보공학부", xp: 45 },
  { rank: 11, name: "조현수", anonymousName: "조*수", department: "전자공학과", xp: 42 },
  { rank: 12, name: "최진욱", anonymousName: "최*욱", department: "컴퓨터정보공학부", xp: 18, isMe: true },
];

export const LeaderboardProvider = ({ children }: { children: ReactNode }) => {
  const [rankings, setRankings] = useState<RankingMember[]>(initialRankings);

  // 내 랭킹 찾기
  const myRanking = rankings.find(r => r.isMe) || null;

  // XP 델타 업데이트 및 랭킹 재계산
  const updateMemberXP = (name: string, xpDelta: number) => {
    setRankings(prev => {
      const updated = prev.map(member => 
        member.name === name 
          ? { ...member, xp: Math.max(0, member.xp + xpDelta) }
          : member
      );
      
      return updated
        .sort((a, b) => b.xp - a.xp)
        .map((member, index) => ({ ...member, rank: index + 1 }));
    });
  };

  // XP 직접 설정 (관리자용)
  const setMemberXP = (name: string, newXP: number) => {
    setRankings(prev => {
      const updated = prev.map(member => 
        member.name === name 
          ? { ...member, xp: Math.max(0, newXP) }
          : member
      );
      
      return updated
        .sort((a, b) => b.xp - a.xp)
        .map((member, index) => ({ ...member, rank: index + 1 }));
    });
  };

  // 멤버 정보 업데이트 (관리자용)
  const updateMemberInfo = (name: string, updates: Partial<RankingMember>) => {
    setRankings(prev => {
      const updated = prev.map(member => 
        member.name === name 
          ? { ...member, ...updates }
          : member
      );
      
      return updated
        .sort((a, b) => b.xp - a.xp)
        .map((member, index) => ({ ...member, rank: index + 1 }));
    });
  };

  return (
    <LeaderboardContext.Provider value={{ rankings, myRanking, updateMemberXP, setMemberXP, updateMemberInfo }}>
      {children}
    </LeaderboardContext.Provider>
  );
};

export const useLeaderboard = () => {
  const context = useContext(LeaderboardContext);
  if (context === undefined) {
    throw new Error('useLeaderboard must be used within a LeaderboardProvider');
  }
  return context;
};
