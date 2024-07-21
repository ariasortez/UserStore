import { CreateCategoryDto, CustomError, PaginationDto } from '../../domain';
import { Response, Request } from 'express';
import { CategoryService } from '../services/category.service';

export class CategoryController {
  constructor(private categoryService: CategoryService) {}
  private handleError = (error: unknown, res: Response) => {
    if (error instanceof CustomError) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    return res.status(500).json({ error: 'Internal server error' });
  };

  createCategory = async (req: Request, res: Response) => {
    const [error, createCategory] = CreateCategoryDto.create(req.body);
    if (error) res.status(400).json({ error });

    this.categoryService
      .createCategory(createCategory!, req.body.user)
      .then((newCategory) => res.status(201).json(newCategory))
      .catch((error) => this.handleError(error, res));
  };

  getCategories = async (req: Request, res: Response) => {
    const { page = 1, limit = 10 } = req.query;

    const [error, paginationDto] = PaginationDto.create(+page, +limit);

    if (error) return res.status(400).json({ error });

    this.categoryService
      .getAllCategories(paginationDto!)
      .then((categories) => res.status(200).json(categories))
      .catch((error) => this.handleError(error, res));
  };
}
