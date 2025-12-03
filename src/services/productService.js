import Product from "../models/Product.js";

class ProductService {
  async getAllProducts() {
    const products = await Product.find().sort({ createdAt: -1 }).lean();

    const productsWithPromotion = products.map((product) => {
      const hasPromotion =
        product.promotionalPrice && product.promotionalPrice < product.price;
      const finalPrice = hasPromotion
        ? product.promotionalPrice
        : product.price;

      return {
        ...product,
        finalPrice,
        hasPromotion,
      };
    });

    return productsWithPromotion;
  }

  async getProductById(productId) {
    const product = await Product.findById(productId).lean();

    if (!product) {
      const error = new Error("Produto não encontrado");
      error.statusCode = 404;
      throw error;
    }

    const hasPromotion =
      product.promotionalPrice && product.promotionalPrice < product.price;
    const finalPrice = hasPromotion ? product.promotionalPrice : product.price;

    return {
      ...product,
      finalPrice,
      hasPromotion,
    };
  }

  async createProduct(productData, file, userRole) {
    const {
      name,
      description,
      price,
      promotionalPrice,
      stock,
      category,
      expirationDate,
    } = productData;

    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem criar produtos"
      );
      error.statusCode = 403;
      throw error;
    }

    if (!name || !price) {
      const error = new Error("Nome e preço são obrigatórios");
      error.statusCode = 400;
      throw error;
    }

    if (promotionalPrice) {
      if (!["admin", "manager"].includes(userRole)) {
        const error = new Error(
          "Apenas admin e manager podem adicionar promoções"
        );
        error.statusCode = 403;
        throw error;
      }

      if (parseFloat(promotionalPrice) >= parseFloat(price)) {
        const error = new Error(
          "Preço promocional deve ser menor que o preço normal"
        );
        error.statusCode = 400;
        throw error;
      }
    }

    const newProductData = {
      name,
      description,
      price: parseFloat(price),
      promotionalPrice: promotionalPrice ? parseFloat(promotionalPrice) : null,
      stock: stock ? parseInt(stock) : 0,
      category,
      expirationDate: expirationDate ? new Date(expirationDate) : null,
    };

    const product = await Product.create(newProductData);
    return product;
  }

  async updateProduct(productId, updateData, file, userRole) {
    const {
      name,
      description,
      price,
      promotionalPrice,
      stock,
      category,
      active,
      expirationDate,
    } = updateData;

    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem atualizar produtos"
      );
      error.statusCode = 403;
      throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Produto não encontrado");
      error.statusCode = 404;
      throw error;
    }

    const isChangingPromotion =
      promotionalPrice !== undefined &&
      promotionalPrice !== product.promotionalPrice;

    if (isChangingPromotion) {
      if (!["admin", "manager"].includes(userRole)) {
        const error = new Error(
          "Apenas admin e manager podem gerenciar promoções"
        );
        error.statusCode = 403;
        throw error;
      }

      if (promotionalPrice) {
        const newPrice = price ? parseFloat(price) : product.price;
        if (parseFloat(promotionalPrice) >= newPrice) {
          const error = new Error(
            "Preço promocional deve ser menor que o preço normal"
          );
          error.statusCode = 400;
          throw error;
        }
      }
    }

    if (name) product.name = name;
    if (description !== undefined) product.description = description;
    if (price) product.price = parseFloat(price);

    if (isChangingPromotion) {
      product.promotionalPrice = promotionalPrice
        ? parseFloat(promotionalPrice)
        : null;
    }

    if (stock !== undefined) product.stock = parseInt(stock);
    if (category !== undefined) product.category = category;
    if (typeof active === "boolean") product.active = active;
    if (expirationDate !== undefined) {
      product.expirationDate = expirationDate ? new Date(expirationDate) : null;
    }

    await product.save();
    return product;
  }

  async deleteProduct(productId, userRole) {
    if (!["admin", "manager", "employee"].includes(userRole)) {
      const error = new Error(
        "Apenas admin, manager e employee podem deletar produtos"
      );
      error.statusCode = 403;
      throw error;
    }

    const product = await Product.findById(productId);

    if (!product) {
      const error = new Error("Produto não encontrado");
      error.statusCode = 404;
      throw error;
    }

    await Product.findByIdAndDelete(productId);

    return { message: "Produto removido com sucesso" };
  }
}

export default new ProductService();
