import { ArticleCategory } from "@prisma/client";

const CategorySelectItem = ({ category }: { category: ArticleCategory }) => {
  return <div className=" w-fit font-medium">{category.name}</div>;
};

export default CategorySelectItem;
