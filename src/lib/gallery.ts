export type GalleryPhoto = {
  id: string;
  title: string;
  location: string;
  src: string;
  orientation: "portrait" | "landscape";
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "sunrise",
    title: "Radiant Morning",
    location: "Menteng, Jakarta",
    src: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=900&q=80",
    orientation: "landscape",
  },
  {
    id: "garden",
    title: "Garden Promises",
    location: "Plataran Hutan Kota",
    src: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=80",
    orientation: "portrait",
  },
  {
    id: "city",
    title: "City Breeze",
    location: "Kota Jakarta",
    src: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=900&q=80",
    orientation: "landscape",
  },
  {
    id: "garden-night",
    title: "Garden Lights",
    location: "GBK",
    src: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=900&q=80",
    orientation: "landscape",
  },
  {
    id: "quiet-vows",
    title: "Quiet Vows",
    location: "Kebayoran",
    src: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80",
    orientation: "portrait",
  },
  {
    id: "forever",
    title: "Forever Us",
    location: "Senja Jakarta",
    src: "https://images.unsplash.com/photo-1448932223592-d1fc686e76ea?auto=format&fit=crop&w=900&q=80",
    orientation: "landscape",
  },
];
