import mongoose from "mongoose";
import { generateUUID } from "../utils/generic.util";
import cron from "node-cron";

export interface IProduct {
  id: string;
  store_id: string;
  name: string;
  category: string[];
  price: number;
  stock: number;
  sold: number;
  description: string;
  images: string[];
  unit_size: string;
  weight: string;
  reviews: [];
  expiry_date: Date;
  discount: number;
}
const productSchema = new mongoose.Schema<IProduct>(
  {
    id: String,
    store_id: String,
    name: String,
    category: Array,
    price: Number,
    stock: {
      type: "number",
      min: 0,
    },
    sold: {
      type: "number",
      default: 0,
    },
    description: String,
    images: Array,
    reviews: Array,
    unit_size: Number,
    weight: Number,
    expiry_date: Date,
    discount: Number,
  },
  {
    timestamps: true,
  }
);

export const productModel = mongoose.model<IProduct>("product", productSchema);

export async function getProductsByStore(storeId: string) {
  try {
    const productLists = await productModel
      .find<IProduct[]>({ store_id: storeId })
      .exec();
    return productLists;
  } catch (error) {
    throw error;
  }
}

export async function getSingleProduct(productId: string): Promise<IProduct> {
  try {
    const product = await productModel.findOne({ id: productId }).exec();
    return product!;
  } catch (error) {
    throw error;
  }
}

export async function createSingleProduct(poductInfo: IProduct) {
  try {
    const newProduct = await productModel.create(poductInfo);
    return newProduct;
  } catch (error) {
    throw error;
  }
}

export async function deleteSingleProduct(productId: string) {
  try {
    const result = await productModel.deleteOne({ id: productId }).exec();
    return result;
  } catch (error) {
    throw error;
  }
}
export async function updateSingleProduct(productId: string, newObj: any) {
  try {
    const result = await productModel
      .updateOne({ id: productId }, newObj)
      .exec();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllProducts() {
  try {
    const res = await productModel.aggregate([
      {
        $match: {},
      },
      {
        $lookup: {
          from: "stores",
          localField: "store_id",
          foreignField: "id",
          as: "store",
        },
      },
    ]);
    return res;
  } catch (error) {
    throw error;
  }
}

export async function searchProducts(category: any, text: any) {
  const filter: any = {};
  if (text) {
    filter.name = { $regex: text.trim(), $options: "i" };
  }

  // Add category search criteria if provided
  if (category) {
    filter.category = { $in: category };
  }

  try {
    const results = await productModel.find(filter);
    return results;
  } catch (error) {
    throw error;
  }
}

// Function to calculate and update discounts
async function updateProductDiscounts() {
  const currentDate = new Date();

  // Find all products with expiry dates greater than the current date
  const products = await productModel.find({
    expiry_date: { $gt: currentDate },
  });

  products.forEach((product) => {
    // Calculate the time remaining until expiry
    const timeUntilExpiry = product.expiry_date.getTime() - currentDate.getTime();
    const daysUntilExpiry = timeUntilExpiry / (1000 * 3600); // Convert to days
    console.log(daysUntilExpiry)
    // let newDate = new Date(prdc?.expiry_date);
    // let currDate = new Date();
    // console.log((newDate.toLocaleTimeString('en-GB')));
    // console.log((currDate.toLocaleTimeString('en-GB')));

    //   // Define discount tiers based on days remaining
    //   if (daysUntilExpiry <= 5) {
    //     product.discount = 0.1; // 10% off for products expiring within a week
    //   } else if (daysUntilExpiry <= 10) {
    //     product.discount = 0.05; // 5% off for products expiring within two weeks
    //   } else {
    //     product.discount = 0; // No discount for products with more than two weeks until expiry
    //   }

    if (daysUntilExpiry <= 72){
      const probableLossAmount = product.price * (product.stock - product.sold);
      if (probableLossAmount > 50000) {
        product.discount = 0.4;
      } else if (probableLossAmount > 25000) {
        product.discount = 0.3;
      } else {
        product.discount = 0;
      }
    }



    // Define discount tiers based on days remaining
   if (daysUntilExpiry <= 48 && daysUntilExpiry >= 25) {
      product.discount = product.discount + 0.1; // 10% off for products expiring within two weeks
    } else if (daysUntilExpiry <= 24 && daysUntilExpiry >= 17) {
      product.discount = product.discount + 0.25 ; // No discount for products with more than two weeks until expiry
    }else if (daysUntilExpiry <= 16 && daysUntilExpiry >= 12){
      product.discount = product.discount + 0.35;
    }else if (daysUntilExpiry <= 11 && daysUntilExpiry >= 9){
      product.discount = 0.7;
    }else if (daysUntilExpiry <= 8 && daysUntilExpiry >= 6){
        product.discount = 0.8 ;
    }


    console.log("Product discounts updated.");
    // Save the updated product
    product.save();
  });
}

export const scheduleDiscountUpdate = () => {
  // Schedule the task to run daily at a specific time (adjust as needed)
  //production a each 5 days por por scheduler will run
  cron.schedule("10 10 * * *", () => {
    updateProductDiscounts();
  });
};

//get discounted products which are not expired yet
export const getNoDiscountedProducts = async () => {
  try {
    const currentDate = new Date();
    const products = await productModel.find({
      expiry_date: { $gt: currentDate },
    });
    const discountedProducts = products.filter(
      (product) => product.discount == 0
    );
    return discountedProducts;
  } catch (error) {
    throw error;
  }
};
