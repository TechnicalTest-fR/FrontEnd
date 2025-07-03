// frontend/src/models/OrderModel.js (o Orden.js si ese es el nombre de tu archivo)
class Order { // O class Orden si ese es el nombre de tu clase
  constructor({ id, order_number, order_date, num_products, final_price, status, products }) {
    this.id = id;
    this.order_number = order_number || '';
    this.order_date = order_date || new Date().toISOString().split('T')[0];
    this.num_products = parseInt(num_products) || 0; // Asegura que sea un entero
    this.final_price = parseFloat(final_price) || 0; // Asegura que sea un número flotante
    this.status = status || 'Pending';
    this.products = products || [];
  }
}
export default Order; // O export default Orden;