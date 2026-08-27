import { hashSync } from "bcrypt-ts-edge";
import slugify from "slugify";
import { ARTICLE_MEDIA, DRUM_PHOTOS } from "./media";

type ProductType = {
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  stock: number;
  isFeatured: boolean;
  isPublished: boolean;
  banner: string | null;
  codeIdentifier: string;
  category: string;
  specifications?: {
    skinType?: string;
    dimensions?: string;
    color?: string;
    material?: string;
    size?: string;
  };
};

type ArticleType = {
  title: string;
  slug: string;
  categoryId: string;
  categoryName: string;
  isPublished: boolean;
  isFeatured: boolean;
  banner: string | null;
  thumbnail: string | null;
  sections: { title: string; body: string; image?: string }[];
  comments: { authorEmail: string; title: string; body: string }[];
};

const sampleData: {
  users: { name: string; email: string; password: string; role: string }[];
  categories: { name: string }[];
  skinTypes: { material: string }[];
  drumDimensions: { size: string }[];
  products: ProductType[];
  articles: ArticleType[];
} = {
  users: [
    {
      name: "Julien Ribeiro",
      email: "amedutambour@gmail.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
    {
      name: "Jean-Charles Barq",
      email: "jeancharlesbarq@gmail.com",
      password: hashSync("123456", 10),
      role: "admin",
    },
  ],
  categories: [{ name: "Drum" }, { name: "Other" }],
  skinTypes: [
    { material: "Chèvre" },
    { material: "Bouc" },
    { material: "Bison" },
    { material: "Buffle" },
    { material: "Cheval" },
    { material: "Cerf" },
  ],
  drumDimensions: [
    { size: "35x7" },
    { size: "45x7" },
    { size: "40x8" },
    { size: "45x8" },
    { size: "50x7" },
    { size: "55x8" },
  ],
  products: [],
  articles: [],
};

for (let i = 1; i <= 10; i++) {
  sampleData.products.push({
    name: `Accessoire ACC${i.toString().padStart(3, "0")}`,
    slug: `accessoire-${i.toString().padStart(3, "0")}`,
    description: `Un accessoire pratique pour votre tambour`,
    images: [],
    price: 20 + i,
    stock: 10 + (i % 5),
    isFeatured: false,
    isPublished: i % 5 !== 0,
    banner: null,
    codeIdentifier: `ACC${i.toString().padStart(3, "0")}`,
    category: "Other",
    specifications: {
      color: i % 2 === 0 ? "Noir" : "Marron",
      material: i % 2 === 0 ? "Cuir" : "Tissu",
      size: i % 3 === 0 ? "M" : "L",
    },
  });
}

/**
 * Les cinq tambours réellement photographiés par l'atelier. Leurs visuels
 * viennent du compte UploadThing ; le reste du catalogue est généré pour le
 * volume et reste sans image.
 */
const realDrums: Array<{
  ref: keyof typeof DRUM_PHOTOS;
  skinType: string;
  dimensions: string;
  price: number;
}> = [
  { ref: "chevre-45x7-n1", skinType: "Chèvre", dimensions: "45x7", price: 290 },
  { ref: "chevre-45x7-n2", skinType: "Chèvre", dimensions: "45x7", price: 290 },
  { ref: "bouc-45x7-n2", skinType: "Bouc", dimensions: "45x7", price: 310 },
  { ref: "bouc-45x7-n3", skinType: "Bouc", dimensions: "45x7", price: 310 },
  { ref: "bouc-45x8-n1", skinType: "Bouc", dimensions: "45x8", price: 330 },
];

for (const drum of realDrums) {
  const [, , n] = drum.ref.split("-");
  const code = `${drum.skinType.slice(0, 2).toUpperCase()}${drum.dimensions.replace("x", "")}${n.toUpperCase()}`;

  sampleData.products.push({
    name: `Tambour ${drum.dimensions} en peau de ${drum.skinType.toLowerCase()}`,
    slug: slugify(`tambour-${drum.dimensions}-peau-${drum.skinType}-${n}`, {
      lower: true,
      strict: true,
    }),
    description: `Tambour chamanique monté à la main, peau de ${drum.skinType.toLowerCase()} tendue sur un cadre de ${drum.dimensions} cm. Chaque pièce est unique : le grain de la peau et la voix de l'instrument lui appartiennent.`,
    images: [...DRUM_PHOTOS[drum.ref]],
    price: drum.price,
    stock: 1,
    isFeatured: false,
    isPublished: true,
    banner: null,
    codeIdentifier: code,
    category: "Drum",
    specifications: { skinType: drum.skinType, dimensions: drum.dimensions },
  });
}

// Les tambours sont générés en dernier pour que « Nouvel arrivage », qui trie
// par date de création décroissante, mette en avant des tambours et non des
// accessoires.
// Tambours
for (let i = 1; i <= 30; i++) {
  const skinType =
    sampleData.skinTypes[i % sampleData.skinTypes.length].material;
  const dimension =
    sampleData.drumDimensions[i % sampleData.drumDimensions.length].size;

  sampleData.products.push({
    name: `Tambour TMB${i.toString().padStart(3, "0")} en peau de ${skinType}`,
    // slugify, comme le fait le formulaire d'administration : un slug
    // accentué ne se retrouve pas après encodage dans l'URL.
    slug: slugify(`tambour-TMB${i.toString().padStart(3, "0")}-peau-${skinType}`, {
      lower: true,
      strict: true,
    }),
    description: `Un tambour unique avec une peau de ${skinType}`,
    images: [],
    price: 100 + i,
    stock: 5 + (i % 10),
    isFeatured: false,
    // Quelques brouillons volontaires, pour éprouver le filtre de l'admin.
    isPublished: i % 7 !== 0,
    banner: null,
    codeIdentifier: `TMB${i.toString().padStart(3, "0")}`,
    category: "Drum",
    specifications: {
      skinType,
      dimensions: dimension,
    },
  });
}

/**
 * Articles de démonstration. `isFeatured` reste à false partout, produits
 * compris : le carrousel de la home affiche `banner` et se rabat sur un
 * `/default-banner.jpg` qui n'existe pas. À rouvrir quand les visuels réels
 * de l'atelier seront disponibles.
 */
/**
 * Articles de démonstration.
 *
 * ⚠️ Les **visuels** sont ceux de l'atelier, mais les **textes sont des
 * remplissages** écrits pour donner à voir la mise en page. Ils doivent être
 * remplacés par les mots de Julien avant toute mise en ligne.
 */
sampleData.articles = [
  {
    title: "La construction d'un tambour",
    slug: "la-construction-d-un-tambour",
    categoryId: "11111111-1111-4111-8111-111111111111",
    categoryName: "Savoir-faire",
    isPublished: true,
    isFeatured: true,
    banner: ARTICLE_MEDIA.construction.banner,
    thumbnail: ARTICLE_MEDIA.construction.thumbnail,
    comments: [
      {
        authorEmail: "jeancharlesbarq@gmail.com",
        title: "Question sur le temps de séchage",
        body: "Combien de temps faut-il laisser la peau sécher avant de jouer ?",
      },
      {
        authorEmail: "amedutambour@gmail.com",
        title: "Réponse",
        body: "Quelques jours, à température ambiante et à l'abri du soleil direct.",
      },
    ],
    sections: [
      {
        title: "Le cadre",
        body: "TEXTE DE REMPLISSAGE — Le bois est cintré à la vapeur puis maintenu le temps qu'il prenne sa forme. C'est l'étape qui décide de la rondeur de l'instrument.",
      },
      {
        title: "La peau",
        body: "TEXTE DE REMPLISSAGE — La peau est mise à tremper, puis tendue et lacée à la main. Sa tension finale dépend autant du geste que du séchage.",
      },
    ],
  },
  {
    title: "L'atelier sous la yourte",
    slug: "l-atelier-sous-la-yourte",
    categoryId: "22222222-2222-4222-8222-222222222222",
    categoryName: "L'atelier",
    isPublished: true,
    isFeatured: true,
    banner: ARTICLE_MEDIA.yourte.banner,
    thumbnail: ARTICLE_MEDIA.yourte.thumbnail,
    comments: [],
    sections: [
      {
        title: "Un lieu de travail",
        body: "TEXTE DE REMPLISSAGE — L'atelier est installé en Ariège, à Mirepoix, au pied des Pyrénées.",
        image: ARTICLE_MEDIA.yourte.section,
      },
    ],
  },
  {
    title: "Le salon Sésame",
    slug: "le-salon-sesame",
    categoryId: "22222222-2222-4222-8222-222222222222",
    categoryName: "L'atelier",
    isPublished: true,
    isFeatured: false,
    banner: ARTICLE_MEDIA.sesame.banner,
    thumbnail: ARTICLE_MEDIA.sesame.thumbnail,
    comments: [],
    sections: [
      {
        title: "Trois jours de rencontres",
        body: "TEXTE DE REMPLISSAGE — Retour sur le salon, les tambours présentés et les échanges avec les visiteurs.",
      },
    ],
  },
];

export default sampleData;
