import Product from '../../domain/entities/product';
import ProductRepositoryInterface from '../../domain/repositories/product-repository-interface';
import ProductModel from '../db/sequelize/model/product.model';

export default class ProductRepository implements ProductRepositoryInterface {
  async find(id: string): Promise<Product> {
    const productModel = await ProductModel.findOne({ where: { id } });
    return this.mapToEntity(productModel);
  }

  async findAll(): Promise<Product[]> {
    const productModels = await ProductModel.findAll();
    return productModels.map((productModel) => this.mapToEntity(productModel));
  }

  async create(entity: Product): Promise<void> {
    await ProductModel.create(this.mapToModel(entity));
  }

  async update(entity: Product): Promise<void> {
    await ProductModel.update(
      this.mapToModel(entity),
      {
        where: {
          id: entity.id
        }
      }
    );
  }

  private mapToModel(entity: Product) {
    return {
      id: entity.id,
      name: entity.name,
      price: entity.price
    };
  }

  private mapToEntity(model: ProductModel): Product {
    return new Product(model.id, model.name, model.price);
  }
}
