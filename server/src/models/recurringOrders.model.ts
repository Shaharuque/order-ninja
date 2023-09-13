import mongoose from "mongoose";
import { generateUUID } from "../utils/generic.util";
type OrderStatusType = "completed" | "confirmed" | "pending";

export interface IRecurringOrderBySupplier {
  id: string;
  originalOrderId: string;
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
}
const recurringOrderSchema = new mongoose.Schema<IRecurringOrderBySupplier>(
  {
    id: String,
    originalOrderId: String,
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
    payment_status: { type: "boolean", default: false },
  },
  {
    timestamps: true,
  }
);

export const recurringOrderMdodel = mongoose.model(
  "recurringOrder",
  recurringOrderSchema
);
