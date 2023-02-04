import Customer from '../../domain/entities/customer';
import CustomerRepositoryInterface from '../../domain/repositories/customer-repository-interface';
import Address from '../../domain/vos/address';
import CustomerModel from '../db/sequelize/model/customer.model';

export default class CustomerRepository implements CustomerRepositoryInterface {
  async find(id: string): Promise<Customer> {
    let customerModel;
    try {
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true
      });
    } catch (error) {
      throw new Error('Customer not found');
    }

    return this.mapToEntity(customerModel);
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();
    return customerModels.map((customerModel) => this.mapToEntity(customerModel));
  }

  async create(entity: Customer): Promise<void> {
    await CustomerModel.create(this.mapToModel(entity));
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(this.mapToModel(entity), {
      where: {
        id: entity.id
      }
    });
  }

  private mapToModel(entity: Customer) {
    return {
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      district: entity.address.district,
      complement: entity.address.complement,
      zipcode: entity.address.zip,
      city: entity.address.city,
      state: entity.address.state,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints
    };
  }

  private mapToEntity(model: CustomerModel): Customer {
    const entity = new Customer(model.id, model.name)
    const address = new Address(
      model.street,
      model.number,
      model.district,
      model.complement,
      model.zipcode,
      model.city,
      model.state
    );

    entity.changeAddress(address);
    entity.addRewardPoints(model.rewardPoints);

    if (model.active) {
      entity.activate();
    }

    return entity;
  }
}
