import { Request, Response } from "express";
import { generateUUID } from "../utils/generic.util";
import { IUser, createUser, getUserByEmail } from '../models/user.model';
import bcrypt from 'bcrypt';
import { createStore } from "../models/store.model";
import { generateOTP, sendOTP } from "../services/mail.service";
import redis from "../services/redis.service";


export async function registrationRequest(req: Request, res: Response) {
    try {
        const saltRounds = process.env.SALT_ROUND!;

        // console.log(req.body);
        //extract data
        const { first_name, last_name, isbussiness, password, email } = req.body;
        //check if user already exists
        const oldUser = await getUserByEmail(email);
        if (oldUser?.email) {
            return res.status(404).json({
                error: "User Already Exist!"
            });
        }

        const id = await generateUUID();
        const role = isbussiness ? "business" : "supplier";

        // console.log('i am here')
        //has password

        const hassedPassword = await bcrypt.hash(password, parseInt(saltRounds));

        const userObj: IUser = {
            id: id,
            first_name: first_name,
            last_name: last_name,
            password: hassedPassword,
            email: email,
            role: role
        };

        const code = generateOTP(6);

        let data = await redis.set(`${code}`, JSON.stringify(userObj), { EX: 60 * 3 });
        // let data = await redis.setEx('tonmoy', 10, 'kumar');

        if (data === "OK") {
            sendOTP(req.body.email, code);
            return res.status(200).json({
                status: "success",
                data: "Check your mail & confirm by submitting your OTP"
            })
        } else {
            throw "Something wrong";
        }
    } catch (error) {
        // console.log((error as Error).message);
        return res.status(500).send((error as Error).message);
    }
}


export async function newUserController(req: Request, res: Response) {
    try {
        console.log(req.body.code);
        const data = await redis.get(`${req.body.code}`);
        console.log(data);

        if (!data) {
            throw "OTP not match";
        }
        const confirmData = JSON.parse(data as string);
        const { role, first_name, id, last_name, isbussiness, password, email } = confirmData;

        if (role == 'supplier') {
            const drd = await createStore(id, first_name + ' ' + last_name);
            confirmData.store_id = drd.id;
            console.log('new store created', confirmData);
        }
        const dbRes = await createUser(confirmData);
        console.log(confirmData, dbRes);


        return res.status(200).json({
            message: 'created',
            status: 'ok',
            data: dbRes
        });
    } catch (error) {
        // console.log((error as Error).message);
        return res.status(500).send((error as Error).message);
    }
}