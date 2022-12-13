import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectService } from 'apps/project/project.service';
import { Tag } from 'apps/tag/tag.entity';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { ModuleRef } from '@nestjs/core';

@Injectable()
export class CategoryService {
  constructor(
    private moduleRef: ModuleRef,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
    private readonly projectService: ProjectService,
  ) {}

  throwUndefinedElement(type: string): HttpException {
    return new HttpException(
      {
        status: HttpStatus.NOT_FOUND,
        error: type + ' not found.',
      },
      HttpStatus.NOT_FOUND,
    );
  }

  async create(
    projectId: string,
    createCategoryDto: CreateCategoryDto,
  ): Promise<string> {
    const project: boolean = await this.projectService.exist(projectId);
    if (!project) {
      throw this.throwUndefinedElement('project');
    }
    const category: Category = this.categoryRepository.create({
      ...createCategoryDto,
      projectId: projectId,
    });
    return (await this.categoryRepository.save(category)).uuid;
  }

  async exist(id: string): Promise<boolean> {
    return this.categoryRepository.exist({ where: { uuid: id } });
  }

  async findAll(projectId: string): Promise<Category[]> {
    return this.categoryRepository
      .findBy({ projectId: projectId })
      .catch((e) => {
        console.error(e);
        throw this.throwUndefinedElement('category');
      });
  }

  async findOne(projectId: string, categoryId: string): Promise<Category> {
    return this.categoryRepository
      .findOneByOrFail({ uuid: categoryId, projectId: projectId })
      .catch((e) => {
        console.error(e);
        throw this.throwUndefinedElement('category');
      });
  }

  async findTags(projectId: string, categoryId: string): Promise<Tag[]> {
    return this.tagRepository
      .findBy({ projectId: projectId, categoryId: categoryId })
      .catch((e) => {
        console.error(e);
        throw this.throwUndefinedElement('project or category');
      });
  }

  async update(
    projectId: string,
    categoryId: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    this.categoryRepository
      .update({ uuid: categoryId, projectId: projectId }, updateCategoryDto)
      .catch((e) => {
        console.error(e);
        throw this.throwUndefinedElement('category');
      });
    return this.findOne(projectId, categoryId);
  }

  async delete(projectId: string, categoryId: string): Promise<string> {
    const result = await this.categoryRepository
      .delete({ uuid: categoryId, projectId: projectId })
      .catch((e) => {
        console.error(e);
        throw this.throwUndefinedElement('category');
      });
    return result.affected + ' category has been successfully deleted';
  }
}
