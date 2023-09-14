import { Router } from "express";
import userRoute from "./user.route";
import { checkAuth } from "../middlewares/auth";
import loginRoute from "./login.route";
import registrationRouter from "./register.route";
import storeRouter from "./store.route";
import cloudinaryRouter from "./cloudinary.route";
import productRouter from "./product.route";
import publicRouter from "./public.route";
import cateogryRouter from "./admin/category.route";
import pathaoRouter from "./pathao.route";
import orderRoute from "./order.route";
import paymentRoute from "./payment.route";




const indexRouter = Router();



indexRouter.use(cloudinaryRouter);
indexRouter.get('/', (req, res) => {
    res.send('Order Ninja Server.');
});



indexRouter.use('/pathao', pathaoRouter);

indexRouter.use(`/payment`, paymentRoute);


indexRouter.use('/login', loginRoute);
indexRouter.use('/register', registrationRouter);
indexRouter.use('/category', cateogryRouter);
indexRouter.use('/public', publicRouter);

indexRouter.use(checkAuth);


indexRouter.use('/user', userRoute);
indexRouter.use('/order', orderRoute);
indexRouter.use('/store', storeRouter);
indexRouter.use('/product', productRouter);


export default indexRouter;