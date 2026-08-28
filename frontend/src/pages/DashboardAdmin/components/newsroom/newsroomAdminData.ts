import featuredBuilding from "../../../../assets/Newsroom/featured-building.webp";
import founderAvatar from "../../../../assets/Tentang-Mahreen/profile-founder.jpeg";
import ceoAvatar from "../../../../assets/Tentang-Mahreen/profile-ceo.webp";

export type NewsroomPostStatus = "Under Review" | "Scheduled" | "Draft" | "Published";

export type NewsroomPost = Readonly<{
  id: string;
  articleId: string | number;
  slug: string;
  title: string;
  author: string;
  coAuthor: string;
  tags: string;
  age: string;
  category: string;
  image: string;
  status: NewsroomPostStatus;
  viewCount: number;
  isSynced?: boolean;
}>;

export const newsroomDefaultImage = featuredBuilding;

export const newsroomTopics = [
  { label: "Corporate Excellence", progress: 84 },
  { label: "CSR Initiatives", progress: 62 },
  { label: "Internship Updates", progress: 45 },
] as const;

export const newsroomAuthors = [
  { name: "Tanya Mahreen", detail: "12 Articles · 4.2k views", avatar: ceoAvatar, featured: true },
  { name: "Faza Mahreen", detail: "8 Articles · 2.8k views", avatar: founderAvatar, featured: false },
] as const;
