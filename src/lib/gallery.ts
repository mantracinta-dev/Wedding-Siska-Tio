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
    src: "/gallery/image1.jpeg",
    orientation: "portrait",
  },
  {
    id: "garden",
    title: "Garden Promises",
    location: "Plataran Hutan Kota",
    src: "/gallery/image4.jpeg",
    orientation: "portrait",
  },
  {
    id: "quiet-vows",
    title: "Quiet Vows",
    location: "Kebayoran",
    src: "/gallery/image2.jpeg",
    orientation: "portrait",
  },
  {
    id: "forever",
    title: "Forever Us",
    location: "Senja Jakarta",
    src: "/gallery/image3.jpeg",
    orientation: "portrait",
  },
];
