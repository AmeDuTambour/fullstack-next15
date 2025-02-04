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
  products: [
    {
      name: "Tambour en peau de bison",
      slug: "tambour-en-peau-de-bison",
      description: "Deep vibration",
      images: [
        "https://example.com/image1.jpg",
        "https://example.com/image2.jpg",
      ],
      price: 130.0,
      stock: 5,
      isFeatured: false,
      banner: null,
      codeIdentifier: "TMB001",
      category: "Drum",
      specifications: {
        skinType: "Bison",
        dimensions: "40x12",
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
      price: 150.0,
      stock: 3,
      isFeatured: true,
      banner: null,
      codeIdentifier: "TMB002",
      category: "Drum",
      specifications: {
        skinType: "Cerf",
        dimensions: "45x14",
      },
    },
    {
      name: "Housse de tambour en cuir",
      slug: "housse-de-tambour-en-cuir",
      description: "Protection durable pour tambour",
      images: ["https://example.com/image5.jpg"],
      price: 50.0,
      stock: 10,
      isFeatured: false,
      banner: null,
      codeIdentifier: "ACC001",
      category: "Other",
      specifications: {
        color: "Noir",
        material: "Cuir",
        size: "M",
      },
    },
  ],
};

export default sampleData;
