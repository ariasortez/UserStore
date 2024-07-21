import { CategoryModel } from '../../data';
import {
  CreateCategoryDto,
  CustomError,
  PaginationDto,
  UserEntity,
} from '../../domain';

export class CategoryService {
  constructor() {}

  async getAllCategories(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;

    try {
      const [total, categories] = await Promise.all([
        CategoryModel.countDocuments(),
        CategoryModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);
      return { page, limit, total, categories };
    } catch (error) {
      throw CustomError.interalServer('Internal Server Error');
    }
  }

  async createCategory(createCategory: CreateCategoryDto, user: UserEntity) {
    const categoryExist = await CategoryModel.findOne({
      name: createCategory.name,
    });
    if (categoryExist) throw CustomError.badRequest('La categoria ya existe');

    try {
      const category = new CategoryModel({
        ...createCategory,
        user: user.id,
      });
      await category.save();
      return {
        id: category.id,
        name: category.name,
        available: category.available,
      };
    } catch (error) {
      throw CustomError.interalServer(`${error}`);
    }
  }
}
