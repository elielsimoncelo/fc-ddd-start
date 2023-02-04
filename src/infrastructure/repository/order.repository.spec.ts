import { Sequelize } from 'sequelize-typescript';
import Customer from '../../domain/entities/customer';
import Order from '../../domain/entities/order';
import OrderItem from '../../domain/entities/order-item';
import Product from '../../domain/entities/product';
import Address from '../../domain/vos/address';
import CustomerModel from '../db/sequelize/model/customer.model';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';
import ProductModel from '../db/sequelize/model/product.model';
import CustomerRepository from './customer.repository';
import OrderRepository from './order.repository';
import ProductRepository from './product.repository';

describe('Order Repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel
    ]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const makeCustomer = async (id: string): Promise<Customer> => {
    const customerRepository = new CustomerRepository();

    const customer = new Customer(`${id}`, `Customer ${id}`);

    const address = new Address(
      `Street ${id}`,
      1,
      `District ${id}`,
      `Complement ${id}`,
      `Zipcode ${id}`,
      `City ${id}`,
      `State ${id}`
    );

    customer.changeAddress(address);
    customer.addRewardPoints(100);
    customer.activate();

    await customerRepository.create(customer);

    return customer;
  };

  const makeProduct = async (): Promise<Product> => {
    const productRepository = new ProductRepository();

    const product = new Product('1', 'Product 1', 100);

    await productRepository.create(product);

    return product;
  };

  const makeOrderItem = (product: Product, orderItemId = '1'): OrderItem => (
    new OrderItem(orderItemId, product.name, product.price, product.id, 1)
  );

  const makeOrder = (customerId: string, orderId = '1', ...items: OrderItem[]): Order => (
    new Order(orderId, customerId, items)
  );

  it('Should create a new order', async () => {
    // Arrange
    const product = await makeProduct();
    const customer = await makeCustomer('1');
    const orderRepository = new OrderRepository();

    // Act
    const orderItem = makeOrderItem(product);
    const order = makeOrder(customer.id, '1', orderItem);
    await orderRepository.create(order);

    const orderModelCreated = await OrderModel.findOne({
      where: {
        id: order.id
      },
      include: ['items']
    });

    // Assert
    expect(orderModelCreated.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total(),
    });
  });

  it('Should update an order', async () => {
    // Arrange
    const product = await makeProduct();
    const customer = await makeCustomer('1');
    const orderRepository = new OrderRepository();

    // Act
    const orderItem = makeOrderItem(product);
    const order = makeOrder(customer.id, '1', orderItem);
    await orderRepository.create(order);

    const orderModelCreated = await OrderModel.findOne({
      where: {
        id: order.id
      },
      include: ['items']
    });

    const newOrderItem = makeOrderItem(product, '2');
    order.addItem(newOrderItem);
    await orderRepository.update(order);

    const orderModelUpdated = await OrderModel.findOne({
      where: {
        id: order.id
      },
      include: ['items']
    });

    // Assert
    expect(orderModelCreated.total).toBe(100);
    expect(orderModelCreated.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      items: [{
        id: orderItem.id,
        name: orderItem.name,
        order_id: order.id,
        product_id: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItem.price,
      }],
      total: 100,
    });

    expect(orderModelUpdated.total).toBe(order.total());
    expect(orderModelUpdated.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      items: [{
        id: orderItem.id,
        name: orderItem.name,
        order_id: order.id,
        product_id: orderItem.productId,
        quantity: orderItem.quantity,
        price: orderItem.price,
      }, {
        id: newOrderItem.id,
        name: newOrderItem.name,
        order_id: order.id,
        product_id: newOrderItem.productId,
        quantity: newOrderItem.quantity,
        price: newOrderItem.price,
      }
      ],
      total: 200,
    });
  });

  it('Should throw an error when order not found', async () => {
    // Arrange
    const fakeOrderId = 'XXXX####XXXX';
    const orderRepository = new OrderRepository();

    // Act
    const find = async () => {
      await orderRepository.find(fakeOrderId);
    };

    // Assert
    expect(async () => {
      await find();
    }).rejects.toThrow('Order not found');
  });

  it('Should find an order', async () => {
    // Arrange
    const product = await makeProduct();
    const customer = await makeCustomer('1');
    const orderRepository = new OrderRepository();

    // Act
    const orderItem = makeOrderItem(product);
    const order = makeOrder(customer.id, '1', orderItem);
    await orderRepository.create(order);

    const orderModelCreated = await OrderModel.findOne({
      where: {
        id: order.id
      },
      include: ['items']
    });

    const orderFound = await orderRepository.find('1');

    // Assert
    expect(orderModelCreated.toJSON()).toStrictEqual({
      id: order.id,
      customer_id: order.customerId,
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        order_id: order.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total(),
    });

    expect(orderModelCreated.toJSON()).toStrictEqual({
      id: orderFound.id,
      customer_id: orderFound.customerId,
      items: orderFound.items.map((item) => ({
        id: item.id,
        name: item.name,
        order_id: item.id,
        product_id: item.productId,
        quantity: item.quantity,
        price: item.price,
      })),
      total: order.total(),
    });
  });

  it('Should find all orders', async () => {
    // Arrange
    const product = await makeProduct();
    const customer = await makeCustomer('1');
    const orderRepository = new OrderRepository();

    // Act
    const orderItem1 = makeOrderItem(product, '1');
    const order1 = makeOrder(customer.id, '1', orderItem1);
    await orderRepository.create(order1);

    const orderItem2 = makeOrderItem(product, '2');
    const order2 = makeOrder(customer.id, '2', orderItem2);
    await orderRepository.create(order2);

    const orders = [order1, order2];
    const ordersFound = await orderRepository.findAll();

    // Assert
    expect(orders).toEqual(ordersFound);
  });
});
