export default class OrderProduct {
  constructor({ product_id, name, unit_price, quantity }) {
    this.productId = product_id;
    this.name = name;
    this.unitPrice = parseFloat(unit_price);
    this.qty = quantity;
    this.totalPrice = this.qty * this.unitPrice;
  }
}
