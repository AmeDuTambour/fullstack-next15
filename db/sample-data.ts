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
      role: "user",
    },
  ],
  products: [],
};

export default sampleData;
