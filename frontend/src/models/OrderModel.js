class Order {
  constructor({ id, order_number, order_date, num_products, final_price, status, products }) {
    this.id = id;
    this.order_number = order_number || '';
    this.order_date = order_date || new Date().toISOString().split('T')[0];
    this.num_products = parseInt(num_products) || 0;
    this.final_price = parseFloat(final_price) || 0;
    this.status = status || 'Pending';
    this.products = products || [];
  }
}
export default Order;