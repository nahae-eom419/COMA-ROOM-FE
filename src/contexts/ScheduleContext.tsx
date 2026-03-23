import { createContext, useContext, useState, ReactNode } from "react";

interface ScheduleEvent {
  id: number;
  title: string;
  date: string;
  participants: number;
  xp: number;
  isJoined?: boolean;
}

interface ScheduleContextType {
  upcomingEvents: ScheduleEvent[];
  pastEvents: ScheduleEvent[];
  toggleEventJoin: (eventId: number) => void;
  mainScheduleJoined: boolean;
  toggleMainSchedule: () => void;
  mainScheduleParticipants: number;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [upcomingEvents, setUpcomingEvents] = useState<ScheduleEvent[]>([
    { id: 1, title: "정기모임 #9", date: "1월 27일", participants: 15, xp: 3, isJoined: false },
    { id: 2, title: "AI/ML 스터디", date: "1월 24일", participants: 12, xp: 3, isJoined: false },
    { id: 3, title: "웹 개발 프로젝트", date: "1월 26일", participants: 8, xp: 3, isJoined: false },
    { id: 4, title: "정기모임 #10", date: "2월 3일", participants: 18, xp: 3, isJoined: false },
    { id: 5, title: "신년 세미나", date: "2월 7일", participants: 25, xp: 5, isJoined: false },
  ]);

  const [pastEvents] = useState<ScheduleEvent[]>([
    { id: 1, title: "정기모임 #7", date: "12월 30일", participants: 18, xp: 3 },
    { id: 2, title: "연말 파티", date: "12월 27일", participants: 24, xp: 5 },
    { id: 3, title: "정기모임 #6", date: "12월 23일", participants: 16, xp: 3 },
    { id: 4, title: "정기모임 #5", date: "12월 16일", participants: 20, xp: 3 },
    { id: 5, title: "겨울 워크샵", date: "12월 10일", participants: 22, xp: 10 },
  ]);

  // Main page schedule (정기모임 #8)
  const [mainScheduleJoined, setMainScheduleJoined] = useState(false);
  const [mainScheduleParticipants, setMainScheduleParticipants] = useState(12);

  const toggleEventJoin = (eventId: number) => {
    setUpcomingEvents(prev =>
      prev.map(event => {
        if (event.id === eventId) {
          return {
            ...event,
            isJoined: !event.isJoined,
            participants: event.isJoined ? event.participants - 1 : event.participants + 1,
          };
        }
        return event;
      })
    );
  };

  const toggleMainSchedule = () => {
    setMainScheduleJoined(prev => !prev);
    setMainScheduleParticipants(prev => mainScheduleJoined ? prev - 1 : prev + 1);
  };

  return (
    <ScheduleContext.Provider
      value={{
        upcomingEvents,
        pastEvents,
        toggleEventJoin,
        mainScheduleJoined,
        toggleMainSchedule,
        mainScheduleParticipants,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedule = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error("useSchedule must be used within a ScheduleProvider");
  }
  return context;
};
