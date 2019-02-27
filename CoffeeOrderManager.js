class CoffeeOrderManager {
  constructor() {
    this.orders = [];
  }
  getCurrentOrders() {
    return this.orders;
  }

  receiveOrder(order) {
    this.orders.push({ ...order, purchased: false });
  }

  assignOrdersTo(assignee) {
    this.orders = this.orders.map(order => ({ ...order, assignee }));
  }

  getTotalPrice() {
    return this.orders.reduce(
      (acc, current) => acc + current.unitPrice * current.quantity,
      0
    );
  }

  markOrderAsPurchased(orderId) {
    this.orders = this.orders.map(order => ({
      ...order,
      purchased: order.id === orderId
    }));
  }

  getUpdateFor(name) {
    const isAssignee = order => order.assignee === name;
    const isOrderer = order => order.from === name;
    return {
      ordersForYou: {
        pending: this.orders.filter(
          order => isAssignee(order) && !order.purchased
        ),
        purchased: this.orders.filter(
          order => isAssignee(order) && order.purchased
        )
      },
      yourOrders: {
        pending: this.orders.filter(
          order => isOrderer(order) && !order.purchased
        ),
        purchased: this.orders.filter(
          order => isOrderer(order) && order.purchased
        )
      }
    };
  }
}

module.exports = CoffeeOrderManager;
