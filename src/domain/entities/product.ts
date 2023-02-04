export default class Product {
  private _id: string;

  private _name: string;

  private _price: number;

  constructor(id: string, name: string, price: number) {
    this._id = id;
    this._name = name;
    this._price = price;

    this.validate();
  }

  private validate(): void {
    if (this._id.length === 0) {
      throw new Error('Id is required.');
    }

    if (this._name.length === 0) {
      throw new Error('Name is required.');
    }

    if (this._price <= 0) {
      throw new Error('Price must be greater than 0.');
    }
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  public changeName(newName: string): void {
    this._name = newName;
    this.validate();
  }

  public changePrice(newPrice: number): void {
    this._price = newPrice;
    this.validate();
  }
}
