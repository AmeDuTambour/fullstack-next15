import { hashSync } from "bcrypt-ts-edge";

const sampleData = {
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
  categories: [
    {
      name: "Tambour",
    },
    {
      name: "Accessoire",
    },
  ],
  skinTypes: [
    { material: "Chèvre" },
    { material: "Bouc" },
    { material: "Bison" },
    { material: "Buffle" },
    { material: "Cheval" },
    { material: "Cerf" },
  ],
  drumDiameters: [
    { size: 35 },
    { size: 40 },
    { size: 45 },
    { size: 50 },
    { size: 55 },
  ],
  products: [
    {
      name: "Tambour en peau de bison",
      slug: "tambour-en-peau-de-bison",
      description: "Deep vibration",
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
      price: 130,
      stock: 5,
      isFeatured: false,
      banner: null,
      categoryName: "Tambour", // Relation avec la catégorie
      drum: {
        skinTypeMaterial: "Bison", // Relation avec le type de peau
        diameterSize: 40, // Relation avec le diamètre
      },
    },
    {
      name: "Tambour en peau de cerf",
      slug: "tambour-en-peau-de-cerf",
      description: "Son clair et vibrant",
      images: [
        "https://example.com/image3.jpg",
        "https://example.com/image4.jpg",
      ],
      price: 150,
      stock: 3,
      isFeatured: true,
      banner: null,
      categoryName: "Tambour",
      drum: {
        skinTypeMaterial: "Cerf",
        diameterSize: 45,
      },
    },
    {
      name: "Housse de tambour en cuir",
      slug: "housse-de-tambour-en-cuir",
      description: "Protection durable pour tambour",
      images: ["https://example.com/image5.jpg"],
      price: 50,
      stock: 10,
      isFeatured: false,
      banner: null,
      categoryName: "Accessoire",
      other: {
        color: "Noir",
        material: "Cuir",
        size: "M",
      },
    },
  ],
};

export default sampleData;
