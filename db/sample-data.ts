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
  products: [
    {
      name: "Tamour en peau de bison",
      slug: "tambour-en-peau-de-bison",
      category: "Tambour",
      description: "Depp vibration",
      images: ["", ""],
      price: 130,
      brand: "bison",
      rating: 4.5,
      numReviews: 10,
      stock: 5,
      isFeatured: false,
      banner: "",
    },
  ],
};

export default sampleData;
