export default class OrderProduct {
  constructor({ productId, name, unitPrice, qty }) {
    this.productId = productId;
    this.name = name;
    this.unitPrice = unitPrice;
    this.qty = qty;
    this.totalPrice = this.qty * this.unitPrice;
  }
}