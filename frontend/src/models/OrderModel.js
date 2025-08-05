class Order {
    constructor({ 
      id, 
      order_number, 
      customer_name, 
      order_date, 
      payment_status, 
      payment_method, 
      num_products, 
      final_price, 
      shipping_address, 
      shipping_method, 
      tracking_number, 
      notes, 
      updated_at, 
      status, 
      products 
    }) {
      this.id = id;
      this.order_number = order_number || '';
      this.customer_name = customer_name || '';
      this.order_date = order_date || new Date().toISOString().split('T')[0];
      this.payment_status = payment_status || 'Pending';
      this.payment_method = payment_method || 'CASH';
      this.num_products = parseInt(num_products) || 0;
      this.final_price = parseFloat(final_price) || 0;
      this.shipping_address = shipping_address || '';
      this.shipping_method = shipping_method || '';
      this.tracking_number = tracking_number || '';
      this.notes = notes || '';
      this.updated_at = updated_at || new Date().toISOString();
      this.status = status || 'Pending';
      this.products = products || [];
    }
  }
  export default Order;