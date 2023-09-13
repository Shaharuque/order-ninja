import mongoose from "mongoose";
import { generateUUID } from "../utils/generic.util";
type OrderStatusType = "completed" | "confirmed" | "pending";
import cron from "node-cron";
import moment from "moment";
import { io } from "../../server";
import { recurringOrderMdodel } from "./recurringOrders.model";
import { notificationModel } from "./notification.model";

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
  recurringDate: object;
  payment_status: boolean;
  repeatOrder: number;
  recurredOrderData:[{}]
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
    order_date: {
      type: Date,
      default: Date.now,
    },
    recurringDate:{
      type: Date,
    },
    repeatOrder: {
      type: "number",
      default: 0,
    },
    payment_status: { type: "boolean", default: false },
    recurredOrderData: [Object],
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

// //After 7 days from ordering the product ,product will be reuploaded to the store
// async function recurringOrder() {
//   const currentDate = new Date();

//   // Calculate the date 7 days ago from the current date
//   const sevenDaysAgo = moment(currentDate).subtract(7, 'days').toDate();

//   console.log("sevenDaysAgo",sevenDaysAgo,currentDate)

//   // Find all orders with order_type "weekly" and order_date exactly 7 days ago from current order_date
//   const orders = await disOrderModel.find({
//     order_type: "weekly",
//     // order_date: { $lte: currentDate },
//     order_date: { $gte: sevenDaysAgo ,$lte: currentDate  },
//     });

//   console.log("order recurring updated.",orders);

//   orders.forEach(async (order) => {
//     // Update repeat order
//     order.repeatOrder = order.repeatOrder + 1;
//     console.log("order updated.");

//     // Save the updated order
//     await order.save();
//   });
// }

// export const scheduleRecurringOrder = () => {
//   // Schedule the task to run daily at a specific time (adjust as needed)
//   //production a each 5 days por por scheduler will run
//   cron.schedule("24 9 * * *", () => {
//     recurringOrder();
//   });
// };

// Function to create a new order with the same type as the original order
const createNewOrder = async (originalOrder: any) => {
  const sevenDaysFromNow = moment(originalOrder.order_date)
    .add(7, "days")
    .toDate();

  const newOrder = new recurringOrderMdodel({
    id: await generateUUID(),
    originalOrderId: originalOrder.id,
    order_date: sevenDaysFromNow,
    order_type: originalOrder.order_type,
    product_id: originalOrder.product_id,
    store_id: originalOrder.store_id,
    buyer_id: originalOrder.buyer_id,
    quantity: originalOrder.quantity,
    address: originalOrder.address,
    status: "pending",
    total_price: originalOrder.total_price,
    total_unit_size: originalOrder.total_unit_size,
    total_weight: originalOrder.total_weight,
    price: originalOrder.price,
    unit_size: originalOrder.unit_size,
    weight: originalOrder.weight,
    product_name: originalOrder.product_name,
    item: originalOrder.item,
    payment_status: false,
  });

  try {

    const savedOrder = await newOrder.save();
    console.log("New order created and saved to recurring order model:", savedOrder);

    //make a instance to notification table
    const notification = new notificationModel({
      userId: savedOrder.buyer_id,
      orderId: originalOrder.id,
      product_name: originalOrder.product_name,
    });
    await notification.save();

    io.emit("newOrderCreated", notification); 

    // Push the updated originalOrder to the recurredOrderData array of the corresponding order
    await disOrderModel.findByIdAndUpdate(
      originalOrder._id, // Assuming there's an _id field in the originalOrder
      {
        recurringDate: sevenDaysFromNow,
        $push: {
          recurredOrderData: {
            id: savedOrder.id,
            buyer_id: savedOrder.buyer_id,
            order_date: sevenDaysFromNow,
            // Copy other properties from originalOrder as needed
          },
        },
      }
    );

    console.log("Original order updated with recurred data.");
  } catch (error) {
    console.error("Error creating new order:", error);
  }
};

export const scheduleRecurringOrder = () => {
  // Schedule the task to run daily at a specific time (adjust as needed)
  //production a each 5 days por por scheduler will run
  cron.schedule("19 17 * * *", async () => {
    const currentDate = new Date();

    // Find orders with order_date 7 days in the past
    const sevenDaysAgo = moment(currentDate).subtract(7, "days").format("YYYY-MM-DD");
    console.log('saven days ago---->',sevenDaysAgo)
    const orders = await disOrderModel.find({
      $or: [
        {
          $expr: {
            $eq: [
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$order_date",
                },
              },
              sevenDaysAgo,
            ],
          },
        },
        {
          $expr: {
            $eq: [
              {
                $dateToString: {
                  format: "%Y-%m-%d",
                  date: "$recurringDate",
                },
              },
              sevenDaysAgo,
            ],
          },
        },
      ],
    });

    console.log("Creating new orders...",orders);

    // Create new orders for each original order
    orders.forEach(async (order) => {
      await createNewOrder(order);
    });
  });
};
