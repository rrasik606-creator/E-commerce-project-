import mongoose from "mongoose";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import messages from "../utils/messages.js";



//Products
export const getAllProducts = async (req, res, next) => {
    try {
        const page =Math.max(1,parseInt(req.query.page)||1);
        const limit =Math.min(100,Math.max(1,parseInt(req.query.limit)||5));

        const search = req.query.search?.trim()||"";
        const brand = req.query.brand||"";
        const type = req.query.type||"";

        const filter = {
            deleted:false
        };

        if(search){
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

            filter.name={
                $regex:escapedSearch,
                $options:"i"
            };
        }

        if(brand){
            filter.brand = brand;
        }
        if(type){
            filter.type = type;
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts/limit);

        const products = await Product.find(filter)
            .sort({createdAt:-1})
            .skip((page-1)*limit)
            .limit(limit);
        const brands = await Product.distinct("brand", { deleted: false });
        const types = await Product.distinct("type", { deleted: true });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
            brands,
            types,
            pagination:{
                currentPage:page,
                totalPages,
                totalProducts,
                limit
            }
        });
    }
    catch (error) {
        console.error("ADMIN GET ALL PRODUCTS ERROR:", error);
        next(error);
    }
};


export const getDeletedProducts = async (req, res, next) => {
    try {
        const page = Math.max(1, parseInt(req.query.page) || 1);
        const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 5));

        const search = req.query.search?.trim() || "";
        const brand = req.query.brand || "";
        const type = req.query.type || "";

        const filter = {
            deleted: true
        };

        if (search) {
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

            filter.name = {
                $regex: escapedSearch,
                $options: "i"
            };
        }

        if (brand) {
            filter.brand = brand;
        }

        if (type) {
            filter.type = type;
        }

        const totalProducts = await Product.countDocuments(filter);
        const totalPages = Math.ceil(totalProducts / limit);

        const products = await Product.find(filter)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const brands = await Product.distinct("brand", {
            deleted: true
        });

        return res.status(200).json({
            success: true,
            count: products.length,
            products,
            brands,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts,
                limit
            }
        });
    }
    catch (error) {
        console.error("ADMIN GET DELETED PRODUCTS ERROR:", error);
        next(error);
    }
};


export const createProduct = async(req,res,next) => {
    try{
        const product = await Product.create(req.body);

        return res.status(201).json({
            success:true,
            message:messages.PRODUCT_CREATED,
            product
        });
    }
    catch(error){
        console.log("ADMIN CREATE PRODUCT ERROR:", error);
        next(error);
    }
};


export const updateProduct = async (req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            });
        }

        const product = await Product.findOneAndUpdate(
            {_id:id,deleted:false},
            {$set:req.body},
            {new:true,runValidators:true}
        )

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            })
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_UPDATED,
            product
        });
    }
    catch(error){
        console.log("ADMIN UPDATE PRODUCT ERROR:",error);
        next(error);
    }
};


export const temporaryDeleteProduct = async(req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            })
        }

        const product= await Product.findOneAndUpdate(
            {_id:id,deleted:false},
            {$set:{deleted:true}},
            {new:true}
        );

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            })
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_DELETED,
            product
        })
    }
    catch(error){
        console.log("ADMIN DELETE PRODUCT ERROR:",error);
        next(error)
    }
};


export const permanentDeleteProduct = async(req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            })
        }

        const product = await Product.findOneAndDelete({_id:id,deleted:true});

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            });
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_PERMANENTLY_DELETED
        });
    }
    catch(error){
        console.log("ADMIN PERMANENT DELETE PRODUCT ERROR:",error);
        next(error)
    }
}

export const restoreProduct = async (req,res,next) => {
    try{
        const {id} =req.params;

        if(!mongoose.Types.ObjectId.isValid(id)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_PRODUCT_ID
            });
        }

        const product = await Product.findOneAndUpdate(
            {_id:id,deleted:true},
            {$set:{deleted:false}},
            {new:true}
        );

        if(!product){
            return res.status(404).json({
                success:false,
                message:messages.PRODUCT_NOT_FOUND
            })
        }

        return res.status(200).json({
            success:true,
            message:messages.PRODUCT_RESTORED,
            product
        });
    }
    catch(error){
        console.log("ADMIN RESTORE PRDUCT ERROR:",error);
        next(error);
    }
};


//Order
export const getAllOrders = async(req,res,next) =>{
    try{
        const page = Math.max(1,parseInt(req.query.page)||1);
        const limit = Math.min(100,Math.max(1,parseInt(req.query.limit)||5));

        const search = req.query.search?.trim()||"";
        const status = req.query.status||"";

        const validStatuses =[
            "Pending",
            "Processing",
            "Shipped",
            "Delivered",
            "Cancelled"
        ];

        if(status && !validStatuses.includes(status)){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_ORDER_STATUS
            });
        }

        const pipeline = [
            {
                $lookup:{
                    from:User.collection.name,
                    let:{userId:"$userId"},
                    pipeline:[
                        {
                            $match:{
                                $expr:{$eq:["$_id","$$userId"]}
                            }
                        },
                        {
                            $project:{
                                name:1,
                                username:1,
                                email:1
                            }
                        }
                    ],
                    as:"userDetails"
                }
            },
            {
                $unwind:{
                    path:"$userDetails",
                    preserveNullAndEmptyArrays:true
                }
            }
        ];

        const filter = {};

        if(status){
            filter.status=status;
        }
        if(search){
            const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g,"\\$&");

            filter.$or=[
                {"address.name":{$regex:escapedSearch,$options:"i"}},
                {"userDetails.name":{$regex:escapedSearch,$options:"i"}},
                { "userDetails.username": { $regex: escapedSearch, $options: "i" } },
                { "userDetails.email": { $regex: escapedSearch, $options: "i" } },
                {
                    $expr:{
                        $regexMatch:{
                            input:{$toString:"$_id"},
                            regex:escapedSearch,
                            options:"i"
                        }
                    }
                },
                {
                    $expr:{
                        $regexMatch:{
                            input:{$toString:"$userId"},
                            regex:escapedSearch,
                            options:"i"
                        }
                    }
                }
            ];
        }

        pipeline.push(
            {$match:filter},
            {$sort:{createdAt:-1}},
            {
                $facet:{
                    orders:[
                        {$skip:(page-1)*limit},
                        {$limit:limit},
                        {
                            $set:{
                                userId:{
                                    $ifNull:[
                                        "$userDetails",
                                        "$userId"
                                    ]
                                }
                            }
                        },
                        {$unset:"userDetails"}
                    ],
                    totalCount:[
                        {$count:"total"}
                    ]
                }
            }
        );

        const [result] =await Order.aggregate(pipeline);

        const orders  =result.orders;
        const totalOrders = result.totalCount[0]?.total||0;
        const totalPages = Math.ceil(totalOrders/limit);

        return res.status(200).json({
            success:true,
            count:orders.length,
            orders,
            pagination:{
                currentPage:page,
                totalPages,
                totalOrders,
                limit
            }
        });

    }
    catch(error){
        console.log("ADMIN GET ALL ORDERS ERROR:", error);
        next(error);
    }
};

export const updateOrderStatus = async(req,res,next) =>{
    const {id} =req.params;
    const {status} =req.body;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.status(400).json({
            success:false,
            message:messages.INVALID_ORDER_ID
        });
    }

    const validStatuses = [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled"
    ];

    if(!validStatuses.includes(status)){
        return res.status(400).json({
            success:false,
            message:messages.INVALID_ORDER_STATUS
        });
    }

    const allowedTransitions = {
        Pending:["Processing","Cancelled"],
        Processing:["Shipped","Cancelled"],
        Shipped:["Delivered"],
        Delivered:[],
        Cancelled:[]
    };

    let session;


    try{
        session = await mongoose.startSession();

        let updatedOrder;

        await session.withTransaction(async()=>{
            const order = await Order.findById(id).session(session);

            if(!order){
                const error = new Error(messages.ORDER_NOT_FOUND);
                error.statusCode=404;
                throw error;
            }
            if(!allowedTransitions[order.status]?.includes(status)){
                const error = new Error(messages.ORDER_STATUS_CANNOT_BE_UPDATED);
                error.statusCode=400;
                throw error;
            }

            if(status==="Cancelled"){
                for(const item of order.items){
                    await Product.updateOne(
                        {_id:item.productId},
                        {$inc:{stock:item.quantity}},
                        {session}
                    );
                }
            }

            order.status = status;

            await order.save({ session });

            updatedOrder = order;
        });

        await updatedOrder.populate("userId","name username email");

        return res.status(200).json({
            success:true,
            message:messages.ORDER_STATUS_UPDATED,
            order:updatedOrder
        });
    }
    catch(error){
        console.log("ADMIN UPDATE ORDER STATUS ERROR:",error);
        next(error);
    }
    finally{
        if(session){
        await session.endSession();
        }
    }
};

//User
export const getAllUsers = async(req,res,next) =>{
    try{
        const page = Math.max(1,parseInt(req.query.page)||1);
        const limit = Math.min(100,Math.max(1,parseInt(req.query.limit)||5));

        const search = req.query.search?.trim() || "";
        const status = req.query.status || "";

        const filter={
            role:{$ne:"admin"}
        };

        if(search){
            const searchRegex = new RegExp(
                search.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),"i"
            );

            filter.$or=[
                {name:searchRegex},
                {username:searchRegex},
                {email:searchRegex}
            ];
        }

        if(status==="active"){
            filter.blocked=false;
        }
        else if(status==="blocked"){
            filter.blocked=true
        }
        else if(status!==""){
            return res.status(400).json({
                success:false,
                message:messages.INVALID_USER_STATUS
            });
        }

        const totalUsers = await User.countDocuments(filter);
        const totalPages = Math.ceil(totalUsers/limit);

        const users = await User.find(filter)
            .select("-password")
            .sort({createdAt:-1})
            .skip((page-1)*limit)
            .limit(limit);

        return res.status(200).json({
            success:true,
            count:users.length,
            users,
            pagination:{
                currentPage:page,
                totalPages,
                totalUsers,
                limit
            }
        });
    }
    catch(error){
        console.log("ADMIN USER GETING ERROR:",error);
        next(error);
    }
};

export const blockUser = async(req,res,next) => {
    try{
        const {id} =req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:messages.USER_NOT_FOUND
            });
        }

        if(user.role==="admin"){
            return res.status(403).json({
                success:false,
                message:messages.CANNOT_BLOCK_ADMIN
            });
        }
        if(user._id.toString()===req.user.userId){
            return res.status(400).json({
                success:false,
                message:messages.CANNOT_BLOCK_SELF
            });
        }
        if(user.blocked){
            return res.status(400).json({
                success:false,
                message:messages.USER_ALREADY_BLOCKED
            });
        }

        user.blocked=true;
        await user.save();

        return res.status(200).json({
            success:true,
            message:messages.USER_BLOCKED
        });
    }
    catch(error){
        console.log("ADMIN BLOCK USER ERROR:",error);
        next(error);
    }
}

export const unblockUser = async(req,res,next) =>{
    try{
        const {id} =req.params;

        const user = await User.findById(id);

        if(!user){
            return res.status(404).json({
                success:false,
                message:messages.USER_NOT_FOUND
            });
        }
        if(!user.blocked){
            return res.status(400).json({
                success:false,
                message:messages.USER_ALREADY_UNBLOCKED
            });
        }

        user.blocked=false
        await user.save();

        return res.status(200).json({
            success:true,
            message:messages.USER_UNBLOCKED
        });
    }
    catch(error){
        console.log("ADMIN UNBLOCK USER ERROR:",error);
        next(error);
    }
}

//Dashboard
// Dashboard
export const getDashboardStats = async (req, res, next) => {
    try {
        const period = req.query.period || "monthly";

        const validPeriods = [
            "daily",
            "weekly",
            "monthly",
            "yearly"
        ];

        if (!validPeriods.includes(period)) {
            return res.status(400).json({
                success: false,
                message: "Invalid dashboard period"
            });
        }

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        // Dashboard card statistics
        const [
            totalProducts,
            totalUsers,
            activeUsers,
            blockedUsers,
            totalOrders,
            revenueResult,
            recentOrders
        ] = await Promise.all([

            Product.countDocuments({ deleted: false }),

            User.countDocuments({ role: { $ne: "admin" } }),

            User.countDocuments({
                role: { $ne: "admin" },
                blocked: false
            }),

            User.countDocuments({
                role: { $ne: "admin" },
                blocked: true
            }),

            Order.countDocuments(),

            Order.aggregate([
                {
                    $match: {
                        status: { $ne: "Cancelled" }
                    }
                },
                {
                    $group: {
                        _id: null,
                        totalRevenue: { $sum: "$total" }
                    }
                }
            ]),

            Order.find()
                .sort({ orderDate: -1 })
                .limit(5)
                .populate("userId", "name username email")
        ]);

        const revenue = revenueResult[0]?.totalRevenue || 0;

        // Revenue chart
        const match = {
            status: { $ne: "Cancelled" }
        };

        let groupId;
        let chartData = [];

        if (period === "monthly") {

            match.orderDate = {
                $gte: new Date(year, 0, 1),
                $lt: new Date(year + 1, 0, 1)
            };

            groupId = { $month: "$orderDate" };

            chartData = Array.from(
                { length: 12 },
                (_, index) => ({
                    label: new Date(year, index).toLocaleString(
                        "en-US",
                        { month: "short" }
                    ),
                    revenue: 0
                })
            );
        }

        else if (period === "yearly") {

            groupId = { $year: "$orderDate" };
        }

        else if (period === "daily") {

            match.orderDate = {
                $gte: new Date(year, month, 1),
                $lt: new Date(year, month + 1, 1)
            };

            groupId = { $dayOfMonth: "$orderDate" };

            const daysInMonth = new Date(
                year,
                month + 1,
                0
            ).getDate();

            chartData = Array.from(
                { length: daysInMonth },
                (_, index) => ({
                    label: String(index + 1),
                    revenue: 0
                })
            );
        }

        else if (period === "weekly") {

            match.orderDate = {
                $gte: new Date(year, month, 1),
                $lt: new Date(year, month + 1, 1)
            };

            const firstWeekDay = new Date(
                year,
                month,
                1
            ).getDay();

            const lastDay = new Date(
                year,
                month + 1,
                0
            ).getDate();

            const totalWeeks = Math.ceil(
                (firstWeekDay + lastDay) / 7
            );

            groupId = {
                $ceil: {
                    $divide: [
                        {
                            $add: [
                                { $dayOfMonth: "$orderDate" },
                                firstWeekDay
                            ]
                        },
                        7
                    ]
                }
            };

            chartData = Array.from(
                { length: totalWeeks },
                (_, index) => ({
                    label: `Week ${index + 1}`,
                    revenue: 0
                })
            );
        }

        const chartResults = await Order.aggregate([
            { $match: match },
            {
                $group: {
                    _id: groupId,
                    revenue: { $sum: "$total" }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        if (period === "yearly") {

            chartData = chartResults.map((item) => ({
                label: String(item._id),
                revenue: item.revenue
            }));

        } else {

            chartResults.forEach((item) => {
                chartData[item._id - 1].revenue = item.revenue;
            });

        }

        return res.status(200).json({
            success: true,
            statistics: {
                totalProducts,
                totalUsers,
                activeUsers,
                blockedUsers,
                totalOrders,
                revenue
            },
            chartData,
            recentOrders
        });

    }
    catch (error) {
        console.log("ADMIN DASHBOARD ERROR:", error);
        next(error);
    }
};