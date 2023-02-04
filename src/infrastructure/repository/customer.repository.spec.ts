import { Sequelize } from 'sequelize-typescript';
import Customer from '../../domain/entities/customer';
import Address from '../../domain/vos/address';
import CustomerModel from '../db/sequelize/model/customer.model';
import CustomerRepository from './customer.repository';

describe('Customer Repository test', () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    });

    sequelize.addModels([CustomerModel]);

    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  const makeCustomer = (id: string, name = `Customer ${id}`): Customer => {
    const customer = new Customer(`${id}`, name);
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

    return customer;
  };

  it('Should create a customer', async () => {
    // Arrange
    const customerRepository = new CustomerRepository();

    // Act
    const customer = makeCustomer('1');
    await customerRepository.create(customer);

    const customerModelCreated = await CustomerModel.findOne({ where: { id: '1' } });

    // Assert
    expect(customerModelCreated.toJSON()).toStrictEqual({
      id: customer.id,
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      district: customer.address.district,
      complement: customer.address.complement,
      zipcode: customer.address.zip,
      city: customer.address.city,
      state: customer.address.state,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    });
  });

  it('Should update a customer', async () => {
    // Arrange
    const nameBeforeUpdate = 'Customer X';
    const nameAfterUpdate = 'Customer Y';
    const customerRepository = new CustomerRepository();

    // Act
    const customer = makeCustomer('1', nameBeforeUpdate);
    await customerRepository.create(customer);

    const customerModelCreated = await CustomerModel.findOne({ where: { id: '1' } });

    customer.changeName(nameAfterUpdate);
    await customerRepository.update(customer);

    const customerModelUpdated = await CustomerModel.findOne({ where: { id: '1' } });

    // Assert
    expect(customerModelCreated.toJSON()).toStrictEqual({
      id: customer.id,
      name: nameBeforeUpdate,
      street: customer.address.street,
      number: customer.address.number,
      district: customer.address.district,
      complement: customer.address.complement,
      zipcode: customer.address.zip,
      city: customer.address.city,
      state: customer.address.state,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    });

    expect(customerModelUpdated.toJSON()).toStrictEqual({
      id: customer.id,
      name: nameAfterUpdate,
      street: customer.address.street,
      number: customer.address.number,
      district: customer.address.district,
      complement: customer.address.complement,
      zipcode: customer.address.zip,
      city: customer.address.city,
      state: customer.address.state,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    });
  });

  it('Should throw an error when customer not found', async () => {
    // Arrange
    const fakeCustomerId = 'XXXABC123';
    const customerRepository = new CustomerRepository();

    // Act
    const find = async () => {
      await customerRepository.find(fakeCustomerId);
    };

    // Assert
    expect(async () => { await find(); }).rejects.toThrow('Customer not found');
  });

  it('Should find a customer', async () => {
    // Arrange
    const customerRepository = new CustomerRepository();

    // Act
    const customer = makeCustomer('1');
    await customerRepository.create(customer);

    const customerModelCreated = await CustomerModel.findOne({ where: { id: '1' } });

    const customerFound = await customerRepository.find('1');

    // Assert
    expect(customerModelCreated.toJSON()).toStrictEqual({
      id: customer.id,
      name: customer.name,
      street: customer.address.street,
      number: customer.address.number,
      district: customer.address.district,
      complement: customer.address.complement,
      zipcode: customer.address.zip,
      city: customer.address.city,
      state: customer.address.state,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
    });

    expect(customerModelCreated.toJSON()).toStrictEqual({
      id: customerFound.id,
      name: customerFound.name,
      street: customerFound.address.street,
      number: customerFound.address.number,
      district: customerFound.address.district,
      complement: customerFound.address.complement,
      zipcode: customerFound.address.zip,
      city: customerFound.address.city,
      state: customerFound.address.state,
      active: customerFound.isActive(),
      rewardPoints: customerFound.rewardPoints,
    });
  });

  it('Should find all customers', async () => {
    // Arrange
    const customerRepository = new CustomerRepository();

    // Act
    const customer1 = makeCustomer('1');
    await customerRepository.create(customer1);

    const customer2 = makeCustomer('2');
    await customerRepository.create(customer2);

    const customers = [customer1, customer2];
    const customersFound = await customerRepository.findAll();

    // Assert
    expect(customers).toEqual(customersFound);
  });
});
