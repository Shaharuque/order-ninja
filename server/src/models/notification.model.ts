import mongoose from "mongoose";
import { generateUUID } from "../utils/generic.util";

export interface INotification{
    orderId: string,
    product_name : string,
    userId : string,
    message : string,
    isread : boolean,
}

const notificationSchema = new mongoose.Schema<INotification>({
    orderId : String,
    product_name : String,
    userId : String,
    message:{
        type : String,
        default : 'New Order Created Successfully'
    },
    isread : {
        type : Boolean,
        default : false
    }
},{
    timestamps : true
});

export const notificationModel = mongoose.model<INotification>('notification',notificationSchema);