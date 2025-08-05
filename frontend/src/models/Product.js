export default class Product {
  constructor({ id, code_product, name, classification, stock, unit_price, previous_unit_price = null, supplier_id }) {
    if (unit_price <= 0 || stock < 0) {
      throw new Error("El precio unitario debe ser positivo y el stock no puede ser negativo.");
    }
    
    this.id = id;
    this.code_product = code_product;
    this.name = name;
    this.classification = classification;
    this.stock = stock;
    this.unit_price = unit_price;
    this.previous_unit_price = previous_unit_price;
    this.supplier_id = supplier_id; // <-- Nuevo campo para el ID del proveedor
  }

  updatePrice(newPrice) {
    if (typeof newPrice !== 'number' || newPrice <= 0) {
      throw new Error("El nuevo precio debe ser un número positivo.");
    }
    this.previous_unit_price = this.unit_price;
    this.unit_price = newPrice;
  }

  updateStock(newStock) {
    if (typeof newStock !== 'number' || newStock < 0) {
      throw new Error("El stock debe ser un número no negativo.");
    }
    this.stock = newStock;
  }

  decreaseStock(quantity) {
    if (typeof quantity !== 'number' || quantity <= 0) {
      throw new Error("La cantidad debe ser un número positivo.");
    }
    if (this.stock < quantity) {
      throw new Error("No hay suficiente stock disponible.");
    }
    this.stock -= quantity;
  }
}