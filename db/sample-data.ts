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

const sampleData: {
  users: { name: string; email: string; password: string; role: string }[];
  categories: { name: string }[];
  skinTypes: { material: string }[];
  drumDimensions: { size: string }[];
  products: ProductType[];
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
    { size: "35x10" },
    { size: "40x12" },
    { size: "45x14" },
    { size: "50x12" },
    { size: "55x15" },
  ],
  products: [],
};

// 🎯 Génération de 100 produits "Drum"
for (let i = 1; i <= 30; i++) {
  const skinType =
    sampleData.skinTypes[i % sampleData.skinTypes.length].material;
  const dimension =
    sampleData.drumDimensions[i % sampleData.drumDimensions.length].size;

  sampleData.products.push({
    name: `Tambour ${i} en peau de ${skinType}`,
    slug: `tambour-${i}-peau-${skinType.toLowerCase()}`,
    description: `Un tambour unique avec une peau de ${skinType}`,
    images: [], // Aucune image
    price: 100 + i,
    stock: 5 + (i % 10),
    isFeatured: false,
    isPublished: i % 2 === 0,
    banner: null,
    codeIdentifier: `TMB${i.toString().padStart(3, "0")}`,
    category: "Drum",
    specifications: {
      skinType,
      dimensions: dimension,
    },
  });
}

// 🎯 Génération de 100 produits "Other"
for (let i = 1; i <= 10; i++) {
  sampleData.products.push({
    name: `Accessoire ${i}`,
    slug: `accessoire-${i}`,
    description: `Un accessoire pratique pour votre tambour`,
    images: [], // Aucune image
    price: 20 + i,
    stock: 10 + (i % 5),
    isFeatured: false,
    isPublished: i % 3 === 0,
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

export default sampleData;
