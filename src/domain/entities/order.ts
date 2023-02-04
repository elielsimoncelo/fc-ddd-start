import OrderItem from './order-item';

export default class Order {
  private _id: string;

  private _customerId: string;

  private _items: OrderItem[] = [];

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;

    this.validate();
  }

  public get id(): string {
    return this._id;
  }

  public get customerId(): string {
    return this._customerId;
  }

  public get items(): OrderItem[] {
    return this._items;
  }

  public addItem(item: OrderItem): void {
    this._items.push(item);
  }

  private validate(): void {
    if (this._id.length === 0) {
      throw new Error('Id is required.');
    }

    if (this._customerId.length === 0) {
      throw new Error('CustomerId is required.');
    }

    if (this._items.length === 0) {
      throw new Error('Order items is required.');
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error('Order items quantity must be greater than 0.');
    }
  }

  public total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
}
