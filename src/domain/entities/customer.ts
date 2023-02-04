import Address from '../vos/address';

export default class Customer {
  private _id: string;

  private _name: string;

  private _address?: Address;

  private _active: boolean;

  private _rewardPoints: number;

  constructor(id: string, name: string) {
    this._id = id;
    this._name = name;
    this._address = undefined;
    this._active = false;
    this._rewardPoints = 0;

    this.validate();
  }

  private validate(): void {
    if (this._id.length === 0) {
      throw new Error('Id is required.');
    }

    if (this._name.length === 0) {
      throw new Error('Name is required.');
    }
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  public get address(): Address | undefined {
    return this._address;
  }

  public get rewardPoints(): number {
    return this._rewardPoints;
  }

  public changeAddress(address: Address): void {
    this._address = address;
  }

  public isActive(): boolean {
    return this._active;
  }

  public changeName(newName: string): void {
    this._name = newName;
    this.validate();
  }

  public activate(): void {
    if (this._address === undefined || this._address === null) {
      throw new Error('Address is mandatory to activate customer.');
    }

    this._active = true;
  }

  public deactivate(): void {
    this._active = false;
  }

  public addRewardPoints(points: number): void {
    this._rewardPoints += points;
  }
}
