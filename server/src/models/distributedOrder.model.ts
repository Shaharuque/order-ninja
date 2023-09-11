import mongoose from "mongoose";
import { generateUUID } from "../utils/generic.util";
type OrderStatusType = "completed" | "confirmed" | "pending";
import cron from "node-cron";
import moment from 'moment';

export interface ISuplierOrder {
  id: string;
  product_id: string;
  store_id: string;
  buyer_id: string;
  address: object;
  status: OrderStatusType;
  total_price: number;
  total_unit_size: number;
  total_weight: number;
  price: number;
  unit_size: number;
  weight: number;
  product_name: string;
  item: string;
  quantity: number;
  order_type: string;
  order_date: object;
  payment_status: boolean;
  repeatOrder: number;
}
const disOrderSchema = new mongoose.Schema<ISuplierOrder>(
  {
    id: String,
    product_id: String,
    store_id: String,
    buyer_id: String,
    quantity: Number,
    address: Object,
    status: {
      type: "string",
      default: "pending",
    },
    total_price: Number,
    total_unit_size: Number,
    total_weight: Number,
    price: Number,
    unit_size: Number,
    weight: Number,
    product_name: String,
    order_type: String,
    order_date: Object,
    repeatOrder: {
      type: "number",
      default: 0,
    },
    payment_status: { type: "boolean", default: false },
  },
  {
    timestamps: true,
  }
);

export const disOrderModel = mongoose.model("distributedOrder", disOrderSchema);

export async function createSuplierOrder(orderObj: any) {
  try {
    const id = await generateUUID();
    const dbObject = {
      id: id,
      ...orderObj,
    };
    const rs = await disOrderModel.create(dbObject);
    return rs;
  } catch (error) {
    throw error;
  }
}

export async function getStoreOrders(storeId: string) {
  try {
    const rs = await disOrderModel.find({ store_id: storeId }).exec();
    return rs;
  } catch (error) {
    throw error;
  }
}
export async function getTodayOrders(storeId: string) {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const rs = await disOrderModel
      .aggregate([
        {
          $match: {
            store_id: storeId,
            status: { $ne: "pending" },
            createdAt: { $gte: today },
          },
        },
        {
          $group: {
            _id: "$buyer_id",
            numberOfOrders: { $sum: 1 },
            totalQuantity: { $sum: "$quantity" },
            totalPrice: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
        {
          $group: {
            _id: null,
            orders: { $sum: "$numberOfOrders" }, // Sum the number of orders
            quantity: { $sum: "$totalQuantity" }, // Sum the total quantity
            customers: { $sum: 1 }, // Count the unique customers
            sells: { $sum: "$totalPrice" },
          },
        },
        {
          $project: {
            _id: 0,
          },
        },
      ])
      .exec();

    // const rs = await disOrderModel
    // .find({ store_id: storeId,createdAt: {$gte : today } })
    // .count()
    // .exec();

    return rs;
  } catch (error) {
    throw error;
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  try {
    // console.log(` ${orderId }=id -> status = ${status} `);
    const rs = await disOrderModel
      .findOneAndUpdate(
        { id: orderId },
        {
          status: status,
        }
      )
      .exec();

    // console.log(rs);
    return rs;
  } catch (error) {
    throw error;
  }
}

export async function getLastestSalesByStore(storeId: string) {
  try {
    // console.log(` ${orderId }=id -> status = ${status} `);
    const rs = await disOrderModel
      .find({ store_id: storeId, status: { $ne: "pending" } })
      .sort({ createdAt: -1 })
      .exec();

    // console.log(rs);
    return rs;
  } catch (error) {
    throw error;
  }
}

export async function getTopNSalesByStore(storeId: string, limit: number = 3) {
  try {
    // console.log(` ${orderId }=id -> status = ${status} `);
    // const rs = await disOrderModel
    //         .find({store_id:storeId}).agg;

    //         // console.log(rs);
    // return rs;

    const rs = await disOrderModel
      .aggregate([
        {
          $match: {
            store_id: storeId,
            status: "confirmed",
          },
        },
        {
          $group: {
            _id: "$product_id",
            totalOrder: { $sum: "$quantity" },
          },
        },
        {
          $sort: { totalQuantitySold: -1 },
        },
        {
          $limit: limit,
        },
        // {
        //     $lookup: {
        //       from: 'product', // Name of the Product collection
        //       localField: 'product_id', // Field from the Order collection to match
        //       foreignField: 'id', // Field from the Product collection to match
        //       as: 'pdc',
        //     },
        // }
      ])
      .exec();
    return rs;
  } catch (error) {
    throw error;
  }
}

export async function getUserOrders(userId: string) {
  try {
    const result = await disOrderModel
      // .find({ buyer_id:userId  })
      .aggregate([
        {
          $match: {
            buyer_id: userId,
          },
        },
        {
          $lookup: {
            from: "products",
            localField: "product_id",
            foreignField: "id",
            as: "product",
          },
        },
      ])
      .exec();
    return result;
  } catch (error) {
    throw error;
  }
}
export async function storeWeeklyStats(storeId: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  try {
    const result = await disOrderModel
      // .find({ buyer_id:userId  })
      .aggregate([
        {
          $match: {
            store_id: storeId,
            createdAt: {
              $gte: sevenDaysAgo,
            },
          },
        },
        {
          $group: {
            //   _id: {
            //     $dateToString: {
            //         format: '%Y-%m-%d',
            //         date: '$createdAt'
            //     }
            // },
            _id: {
              day: {
                $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
              },
              dayOfWeek: { $dayOfWeek: "$createdAt" },
            },
            order: { $sum: 1 },
            quantity: { $sum: "$quantity" },
            price: { $sum: { $multiply: ["$quantity", "$price"] } },
          },
        },
        {
          $project: {
            _id: 0,
            date: "$_id.day",
            order: 1,
            quantity: 1,
            price: 1,
            day_name: {
              $switch: {
                branches: [
                  { case: 0, then: "Sun" },
                  { case: 1, then: "Mon" },
                  { case: 2, then: "Tue" },
                  { case: 3, then: "Wed" },
                  { case: 4, then: "Thu" },
                  { case: 5, then: "Fri" },
                  { case: 6, then: "Sat" },
                ],
                default: "Unknown",
              },
            },
          },
        },
        // {
        //     $lookup:{
        //         from:'products',
        //         localField:'product_id',
        //         foreignField:'id',
        //         as : 'product'
        //     }
        // },
      ])
      .exec();
    return result;
  } catch (error) {
    throw error;
  }
}

export async function getAllOrdersWithStore() {
  try {
    const result = disOrderModel
      .aggregate([
        { $match: {} },
        {
          $lookup: {
            from: "stores",
            localField: "store_id",
            foreignField: "id",
            as: "store",
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "buyer_id",
            foreignField: "id",
            as: "buyer",
          },
        },
      ])
      .exec();

    return result;
  } catch (error) {
    throw error;
  }
}


//After 7 days from ordering the product ,product will be reuploaded to the store
async function recurringOrder() {
  //   const currentDate = new Date();

  //   // Find all products with expiry dates greater than the current date
  //   const orders = await disOrderModel.find({ order_type: "weekly" });
  //   console.log("order recurring updated.");
  //   orders.forEach((order) => {
  //     //update repeat order
  //     order.repeatOrder = order.repeatOrder + 1;
  //     console.log("order updated.");
  //     // Save the updated product
  //     order.save();
  //   });

  const currentDate = new Date();

  // Calculate the date 7 days ago from the current date
  const sevenDaysAgo = moment(currentDate).subtract(7, 'days').toDate();

  console.log("sevenDaysAgo",sevenDaysAgo,currentDate)

  // Find all orders with order_type "weekly" and order_date >= 7 days ago
  const orders = await disOrderModel.find({
    order_type: "weekly",
    order_date: { $lte: currentDate, $gte: sevenDaysAgo },
    });

  console.log("order recurring updated.",orders);

  orders.forEach(async (order) => {
    // Update repeat order
    order.repeatOrder = order.repeatOrder + 1;
    console.log("order updated.");

    // Save the updated order
    await order.save();
  });
}

export const scheduleRecurringOrder = () => {
  // Schedule the task to run daily at a specific time (adjust as needed)
  //production a each 5 days por por scheduler will run
  cron.schedule("09 20 * * *", () => {
    recurringOrder();
  });
};
