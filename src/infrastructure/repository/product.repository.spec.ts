import { Sequelize } from 'sequelize-typescript';
import Product from '../../domain/entities/product';
import ProductModel from '../db/sequelize/model/product.model';
import ProductRepository from './product.repository';

describe('Product Repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it('Should create a product', async () => {
    // Arrange
    const productRepository = new ProductRepository();

    // Act
    const product = new Product('1', 'Product 1', 100);
    await productRepository.create(product);

    const productModelCreated = await ProductModel.findOne({ where: { id: '1' } });

    // Assert
    expect(productModelCreated.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 1',
      price: 100,
    });
  });

  it('Should update a product', async () => {
    // Arrange
    const productRepository = new ProductRepository();

    // Act
    const product = new Product('1', 'Product 1', 100);
    await productRepository.create(product);

    const productModelCreated = await ProductModel.findOne({ where: { id: '1' } });

    product.changeName('Product 2');
    product.changePrice(200);
    await productRepository.update(product);

    const productModelUpdated = await ProductModel.findOne({ where: { id: '1' } });

    // Assert
    expect(productModelCreated.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 1',
      price: 100
    });

    expect(productModelUpdated.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 2',
      price: 200
    });
  });

  it('Should find a product', async () => {
    // Arrange
    const productRepository = new ProductRepository();

    // Act
    const product = new Product('1', 'Product 1', 100);
    await productRepository.create(product);
    const productModelCreated = await ProductModel.findOne({ where: { id: '1' } });
    const productFound = await productRepository.find('1');

    // Assert
    expect(productModelCreated.toJSON()).toStrictEqual({
      id: '1',
      name: 'Product 1',
      price: 100
    });

    expect(productModelCreated.toJSON()).toStrictEqual({
      id: productFound.id,
      name: productFound.name,
      price: productFound.price
    });
  });

  it('Should find all products', async () => {
    // Arrange
    const productRepository = new ProductRepository();

    // Act
    const product1 = new Product('1', 'Product 1', 100);
    await productRepository.create(product1);

    const product2 = new Product('2', 'Product 2', 200);
    await productRepository.create(product2);

    const products = [product1, product2];
    const productsFound = await productRepository.findAll();

    // Assert
    expect(products).toEqual(productsFound);
  });
});
