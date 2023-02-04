import Order from './order';
import OrderItem from './order-item';

describe('Order unit tests', () => {
  it('should throw error when id is empty', () => {
    const order = () => new Order('', '', []);
    expect(order).toThrowError('Id is required.');
  });

  it('should throw error when customerId is empty', () => {
    const order = () => new Order('123', '', []);
    expect(order).toThrowError('CustomerId is required.');
  });

  it('should throw error when orderItems is empty', () => {
    const order = () => new Order('123', '456', []);
    expect(order).toThrowError('Order items is required.');
  });

  it('should throw error when order items quantity less or equal than 0', () => {
    const order = () => new Order('123', '456', [
      new OrderItem('1', 'Item 1', 100, 'p1', 0),
    ]);
    expect(order).toThrowError('Order items quantity must be greater than 0.');
  });

  it('should calculate total', () => {
    // Arrange
    const orderItems = [
      new OrderItem('1', 'Item 1', 100, 'p1', 2),
      new OrderItem('2', 'Item 2', 200, 'p2', 3),
    ];

    const order = new Order('123', '456', orderItems);

    // Act
    const total = order.total();

    // Assert
    expect(total).toBe(800);
  });
});
