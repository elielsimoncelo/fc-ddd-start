export default class OrderItem {
  private _id: string;

  private _name: string;

  private _price: number;

  private _productId: string;

  private _quantity: number;

  constructor(id: string, name: string, price: number, productId: string, quantity: number) {
    this._id = id;
    this._name = name;
    this._price = price;
    this._productId = productId;
    this._quantity = quantity;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get productId(): string {
    return this._productId;
  }

  public get price(): number {
    return this._price * this._quantity;
  }

  public get quantity(): number {
    return this._quantity;
  }
}
