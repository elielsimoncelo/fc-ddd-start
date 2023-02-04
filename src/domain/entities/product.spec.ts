import Product from './product';

describe('Product unit tests', () => {
  it('should throw error when id is empty', () => {
    const product = () => new Product('', 'name', 0.00);
    expect(product).toThrowError('Id is required.');
  });

  it('should throw error when name is empty', () => {
    const product = () => new Product('123', '', 0.00);
    expect(product).toThrowError('Name is required.');
  });

  it('should throw error when price is less than 0', () => {
    const product = () => new Product('123', 'name', 0.00);
    expect(product).toThrowError('Price must be greater than 0.');
  });

  it('should success when change name', () => {
    // Arrange
    const product = new Product('123', 'name', 1.00);

    // Act
    product.changeName('new');

    // Assert
    expect(product.name).toBe('new');
  });

  it('should success when change price', () => {
    // Arrange
    const product = new Product('123', 'name', 1.00);

    // Act
    product.changePrice(2.00);

    // Assert
    expect(product.price).toBe(2.00);
  });
});
