export type GalleryPhoto = {
  id: string;
  title: string;
  subcaption: string;
  src: string;
  orientation: "portrait" | "landscape";
};

export const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: "TheBeginning",
    title: "The Silent Promise.",
    subcaption:
      "Keindahan yang dimulai dari sebuah tatapan sederhana namun penuh makna.",
    src: "/gallery/image1.webp",
    orientation: "portrait",
  },
  {
    id: "TheCenterpiece",
    title: "The Beginning",
    subcaption:
      "Mengenakan adat, menjaga martabat, menyatukan dua hati dalam balutan doa.",
    src: "/gallery/image2.webp",
    orientation: "portrait",
  },
  {
    id: "TheSerenity",
    title: "Quietly Devoted.",
    subcaption:
      "Duduk berdampingan, bersiap melangkah menuju babak baru yang lebih tenang.",
    src: "/gallery/img3.webp",
    orientation: "portrait",
  },
  {
    id: "TheConnection",
    title: "A Hand to Hold.",
    subcaption:
      "Genggaman tangan ini adalah janji bahwa tidak akan ada lagi perjalanan yang dilalui sendirian.",
    src: "/gallery/img4.webp",
    orientation: "portrait",
  },
  {
    id: "TheRadiantLove",
    title: "Shining Together.",
    subcaption:
      "Di antara tawa dan putihnya janji, kita menemukan masa depan yang paling cerah.",
    src: "/gallery/img5.webp",
    orientation: "portrait",
  },
  {
    id: "TheForeverUs",
    title: "Written in the Stars.",
    subcaption:
      "Bukan lagi tentang aku atau kamu, tapi tentang 'kita' yang akan terus bersama selamanya.",
    src: "/gallery/img6.webp",
    orientation: "portrait",
  },
];
