import { hashSync } from "bcrypt-ts-edge";

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
  sections: { title: string; body: string }[];
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
    slug: `tambour-TMB${i.toString().padStart(3, "0")}-peau-${skinType.toLowerCase()}`,
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
sampleData.articles = [
  {
    title: "Choisir la peau de son tambour",
    slug: "choisir-la-peau-de-son-tambour",
    categoryId: "11111111-1111-4111-8111-111111111111",
    categoryName: "Savoir-faire",
    isPublished: true,
    isFeatured: false,
    banner: null,
    thumbnail: null,
    sections: [
      {
        title: "La chèvre, une voix claire",
        body: "La peau de chèvre donne un son ouvert, avec des aigus présents et une attaque nette. C'est souvent la première rencontre : elle pardonne les gestes hésitants et répond vite.",
      },
      {
        title: "Le bison, une voix profonde",
        body: "Plus épaisse, la peau de bison descend bas et met du temps à s'installer. Elle demande une frappe plus assurée, mais tient longtemps la vibration.",
      },
    ],
  },
  {
    title: "Accorder un tambour chamanique",
    slug: "accorder-un-tambour-chamanique",
    categoryId: "11111111-1111-4111-8111-111111111111",
    categoryName: "Savoir-faire",
    isPublished: true,
    isFeatured: false,
    banner: null,
    thumbnail: null,
    sections: [
      {
        title: "L'humidité fait le son",
        body: "Un tambour à peau naturelle n'a pas d'accordage mécanique : c'est l'air ambiant qui tend ou détend la peau. Approcher la peau d'une source de chaleur douce la retend ; l'humidité la détend.",
      },
      {
        title: "Écouter avant de corriger",
        body: "Avant toute intervention, laisser l'instrument prendre la température de la pièce une vingtaine de minutes. Beaucoup de tambours jugés faux sont simplement froids.",
      },
    ],
  },
  {
    title: "L'atelier de Mirepoix",
    slug: "atelier-de-mirepoix",
    categoryId: "22222222-2222-4222-8222-222222222222",
    categoryName: "L'atelier",
    isPublished: true,
    isFeatured: false,
    banner: null,
    thumbnail: null,
    sections: [
      {
        title: "Au pied des Pyrénées",
        body: "L'atelier est installé en Ariège, à Mirepoix. Le bois est cintré sur place, la peau tendue à la main, et chaque tambour porte les traces de ce travail.",
      },
    ],
  },
];

export default sampleData;
