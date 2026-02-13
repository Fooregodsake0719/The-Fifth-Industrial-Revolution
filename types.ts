
export enum View {
  HOME = 'home',
  RPG = 'rpg',
  HIERARCHY = 'hierarchy',
  GALLERY = 'gallery',
  DIARY = 'diary'
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
}

export interface DiaryEntry {
  date: string;
  title: string;
  content: string;
}
