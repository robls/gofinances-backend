import { getRepository } from 'typeorm';

import Category from '../models/Category';

class FindCategoryService {
  public async execute(category_title: string): Promise<Category> {
    const categoriesRepository = getRepository(Category);

    const insertedCategory = await categoriesRepository.findOne({
      where: {
        title: category_title,
      },
    });

    if (!insertedCategory) {
      const newCategory = categoriesRepository.create({
        title: category_title,
      });
      const returnNewCategory = await categoriesRepository.save(newCategory);
      return returnNewCategory;
    }

    return insertedCategory;
  }
}

export default FindCategoryService;
