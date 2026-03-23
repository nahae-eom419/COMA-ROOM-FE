export interface AlbumItem {
  id: number;
  title: string;
  date: string;
  photoCount: number;
  description: string;
  location: string;
  participants: string[];
}

export const albumData: AlbumItem[] = [
  { 
    id: 1, 
    title: "최진욱의 백엔드 세미나", 
    date: "2025년 11월 13일", 
    photoCount: 18,
    description: "Spring Boot와 JPA를 활용한 백엔드 개발 세미나",
    location: "N412",
    participants: ["최진욱", "김동현", "서준하"]
  },
  { 
    id: 2, 
    title: "권유진이 말아주는 코마 학술제", 
    date: "2025년 09월 20일", 
    photoCount: 36,
    description: "2025년 코마 학술제 현장 스케치",
    location: "공학관 대강당",
    participants: ["권유진", "서진호", "최진욱", "김동현"]
  },
  { 
    id: 3, 
    title: "(전)코마 회장의 프론트엔드 세미나", 
    date: "2024년 12월 16일", 
    photoCount: 15,
    description: "React와 TypeScript를 활용한 프론트엔드 개발 세미나",
    location: "N412",
    participants: ["이지훈", "서준하", "서진호"]
  },
  { 
    id: 4, 
    title: "2026 신년 OT", 
    date: "2026년 03월 15일", 
    photoCount: 12,
    description: "2025년 새해를 맞이하여 신입생들과 함께한 오리엔테이션",
    location: "N412",
    participants: ["김동현", "서준하", "서진호", "최진욱"]
  },
];
