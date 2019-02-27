const CoffeeOrderManager = require("./CoffeeOrderManager");

describe("Coffee orders", () => {
  let coffeeManager;
  const kopiOrder = {
    id: "1",
    from: "John",
    coffee: "kopi",
    unitPrice: 1.3,
    quantity: 1,
    assignee: null,
    purchased: false
  };

  const kopiCOrder = {
    id: "2",
    from: "Mary",
    coffee: "kopi-c",
    unitPrice: 1.5,
    quantity: 2,
    assignee: null,
    purchased: false
  };

  beforeEach(() => {
    coffeeManager = new CoffeeOrderManager();
  });

  test("can return an empty list of orders", () => {
    expect(coffeeManager.getCurrentOrders()).toEqual([]);
  });

  describe("ordering one coffee", () => {
    beforeEach(() => {
      coffeeManager.receiveOrder(kopiOrder);
    });

    test("can add the order", () => {
      expect(coffeeManager.getCurrentOrders()).toEqual([kopiOrder]);
    });

    test("can assign orders to an assignee", () => {
      coffeeManager.assignOrdersTo("Bob");
      coffeeManager.getCurrentOrders().forEach(order => {
        expect(order.assignee).toEqual("Bob");
      });
    });

    test("can get total price", () => {
      expect(coffeeManager.getTotalPrice()).toEqual(1.3);
    });

    test("can get multiple orders total price", () => {
      coffeeManager.receiveOrder({ ...kopiOrder, quantity: 2 });
      expect(coffeeManager.getTotalPrice()).toBeCloseTo(3.9, 4);
    });

    describe("check status", () => {
      beforeEach(() => {
        coffeeManager.assignOrdersTo("Bob");
      });
      test("status for assignee", () => {
        expect(coffeeManager.getUpdateFor("Bob")).toEqual({
          ordersForYou: {
            pending: [{ ...kopiOrder, assignee: "Bob" }],
            purchased: []
          },
          yourOrders: {
            pending: [],
            purchased: []
          }
        });
      });

      test("status for orderer", () => {
        expect(coffeeManager.getUpdateFor("John")).toEqual({
          ordersForYou: {
            pending: [],
            purchased: []
          },
          yourOrders: {
            pending: [{ ...kopiOrder, assignee: "Bob" }],
            purchased: []
          }
        });
      });
    });

    describe("when some orders are purchased", () => {
      beforeEach(() => {
        coffeeManager.receiveOrder(kopiCOrder);
        coffeeManager.assignOrdersTo("Bob");
        coffeeManager.markOrderAsPurchased("1");
      });

      test("can mark an order as purchased", () => {
        expect(coffeeManager.getUpdateFor("Bob")).toEqual({
          ordersForYou: {
            pending: [{ ...kopiCOrder, assignee: "Bob" }],
            purchased: [{ ...kopiOrder, assignee: "Bob", purchased: true }]
          },
          yourOrders: {
            pending: [],
            purchased: []
          }
        });

        expect(coffeeManager.getUpdateFor("Mary")).toEqual({
          ordersForYou: {
            pending: [],
            purchased: []
          },
          yourOrders: {
            pending: [{ ...kopiCOrder, assignee: "Bob" }],
            purchased: []
          }
        });

        expect(coffeeManager.getUpdateFor("John")).toEqual({
          ordersForYou: {
            pending: [],
            purchased: []
          },
          yourOrders: {
            pending: [],
            purchased: [{ ...kopiOrder, assignee: "Bob", purchased: true }]
          }
        });
      });
    });
  });
});
