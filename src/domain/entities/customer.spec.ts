import Address from '../vos/address';
import Customer from './customer';

describe('Customer unit tests', () => {
  it('should throw error when id is empty', () => {
    const customer = () => new Customer('', 'name');
    expect(customer).toThrowError('Id is required.');
  });

  it('should throw error when name is empty', () => {
    const customer = () => new Customer('123', '');
    expect(customer).toThrowError('Name is required.');
  });

  it('should throw error on customer activation when address is undefined', () => {
    expect(() => {
      const customer = new Customer('123', 'name');
      customer.activate();
    }).toThrowError('Address is mandatory to activate customer.');
  });

  it('should activate customer', () => {
    // Arrange
    const customer = new Customer('123', 'name');
    const address = new Address('Street', 1, 'District', '', '00000000', 'City', 'State');
    customer.changeAddress(address);

    // Act
    customer.activate();

    // Assert
    expect(customer.isActive()).toBe(true);
  });

  it('should deactivate customer', () => {
    // Arrange
    const customer = new Customer('123', 'name');

    // Act
    customer.deactivate();

    // Assert
    expect(customer.isActive()).toBe(false);
  });

  it('should change name', () => {
    // Arrange
    const customer = new Customer('123', 'name');

    // Act
    customer.changeName('new');

    // Assert
    expect(customer.name).toBe('new');
  });

  it('should add reward points', () => {
    // Arrange
    const customer = new Customer('123', 'name');

    // Assert
    expect(customer.rewardPoints).toBe(0);

    // Act
    customer.addRewardPoints(10);

    // Assert
    expect(customer.rewardPoints).toBe(10);

    // Act
    customer.addRewardPoints(20);

    // Assert
    expect(customer.rewardPoints).toBe(30);
  });
});
