export enum AppType {
    SAAS_PLATFORM = 'Nền Tảng SaaS Enterprise',
    ECOMMERCE = 'Hệ Thống E-commerce Đa Kênh',
    INTERNAL_TOOL = 'Công Cụ Quản Trị Nội Bộ (Internal Tool)',
    API_GATEWAY = 'Hệ Thống API Gateway & Microservices',
    AI_WRAPPER = 'Ứng Dụng Tích Hợp AI/LLM',
    LANDING_PAGE = 'Landing Page Chuyển Đổi Cao'
}
  
export enum TechStack {
    REACT_NODE = 'React + Node.js (MERN)',
    NEXT_SUPABASE = 'Next.js + Supabase',
    VUE_PYTHON = 'Vue.js + Python (FastAPI)',
    ANGULAR_JAVA = 'Angular + Java Spring Boot',
    FLUTTER_FIREBASE = 'Flutter + Firebase'
}
  
export enum Architecture {
    CLEAN_ARCH = 'Clean Architecture',
    MVC = 'MVC (Model-View-Controller)',
    ATOMIC = 'Atomic Design (Frontend Focus)',
    EVENT_DRIVEN = 'Event-Driven Architecture',
    SERVERLESS = 'Serverless Function'
}
  
export interface FileNode {
    name: string;
    type: 'file' | 'folder';
    content?: string;
    description?: string; // Why this snippet was reused
    isReused: boolean;
    children?: FileNode[];
}
  
export interface GeneratedResult {
    analysis: string;
    reusedSnippets: string[];
    fileTree: FileNode[];
    documentation: string;
    diagramData: { name: string; value: number }[];
}
  
export interface VoiceConfig {
    speaker: 'Nam_ChuyenGia' | 'Nu_TruyenCam';
    speed: number;
}