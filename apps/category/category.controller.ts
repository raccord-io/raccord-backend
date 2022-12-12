import {
  Body,
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './category.entity';

@Controller('project/:projectId/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  async create(
    @Param('projectId') projectId: string,
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<string> {
    return this.categoryService.create(projectId, createCategoryDto);
  }

  @Get()
  async findAll(@Param('projectId') projectId: string): Promise<Category[]> {
    return this.categoryService.findAll(projectId);
  }

  @Get(':categoryId')
  async findOne(
    @Param('projectId') projectId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<Category> {
    return this.categoryService.findOne(projectId, categoryId);
  }

  // TODO - tag route for category

  @Patch(':categoryId')
  async update(
    @Param('projectId') projectId: string,
    @Param('categoryId') categoryId: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.categoryService.update(
      projectId,
      categoryId,
      updateCategoryDto,
    );
  }

  @Delete(':categoryId')
  async delete(
    @Param('projectId') projectId: string,
    @Param('categoryId') categoryId: string,
  ): Promise<string> {
    return this.categoryService.delete(projectId, categoryId);
  }
}
