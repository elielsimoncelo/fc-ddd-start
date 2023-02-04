import Order from '../../domain/entities/order';
import OrderItem from '../../domain/entities/order-item';
import OrderRepositoryInterface from '../../domain/repositories/order-repository-interface';
import OrderItemModel from '../db/sequelize/model/order-item.model';
import OrderModel from '../db/sequelize/model/order.model';

export default class OrderRepository implements OrderRepositoryInterface {
  async findAll(): Promise<Order[]> {
    const orderModels = await OrderModel.findAll({ include: ['items'] });
    return orderModels.map((orderModel) => this.mapToEntity(orderModel));
  }

  async find(id: string): Promise<Order> {
    let orderModel;
    try {
      orderModel = await OrderModel.findOne({
        where: { id },
        rejectOnEmpty: true,
        include: ['items']
      });
    } catch (error) {
      throw new Error('Order not found');
    }

    return this.mapToEntity(orderModel);
  }

  async update(entity: Order): Promise<void> {
    const orderModel = this.mapToModel(entity);
    await OrderModel.update(orderModel, { where: { id: entity.id } });

    orderModel.items.forEach(async (item) => {
      await OrderItemModel.upsert(item);
    });
  }

  async create(entity: Order): Promise<void> {
    const orderModel = this.mapToModel(entity);

    await OrderModel.create(orderModel, {
      include: [{
        model: OrderItemModel
      }]
    });
  }

  private mapToModel(order: Order) {
    return {
      id: order.id,
      customer_id: order.customerId,
      total: order.total(),
      items: order.items.map((item) => ({
        id: item.id,
        name: item.name,
        product_id: item.productId,
        price: item.price,
        quantity: item.quantity,
        order_id: order.id,
      }))
    };
  }

  private mapToEntity(model: OrderModel): Order {
    const items: OrderItem[] = model.toJSON().items.map((item: OrderItemModel) => (new OrderItem(
      item.id,
      item.name,
      item.price,
      item.product_id,
      item.quantity
    )));

    return new Order(model.id, model.customer_id, items);
  }
}
