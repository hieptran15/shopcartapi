const express = require("express");
const bodyParser= require("body-parser");
const mongoose=require("mongoose");
const shortid=require("shortid");

const app=express();

app.use(bodyParser.json())
const MONGO_URI="mongodb+srv://pactice:hieptran@cluster0.ibjow.mongodb.net/pactice_db?retryWrites=true&w=majority"
mongoose.connect(MONGO_URI,{ useNewUrlParser: true,useUnifiedTopology: true },);


// products..................................................
const Product=mongoose.model("products", new mongoose.Schema({
    _id:{type: String, default:shortid.generate},
    title:String,
    description:String,
    image:String,
    price:String,
    availableSizes:[String],
}))

app.get("/api/products",async (req,res)=>{
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);

    const products=await Product.find({});
    res.send(products);
});

app.post("/api/products",async (req,res)=>{
    const newProduct=new Product(req.body);
    const saveProduct=await newProduct.save();
    res.send(saveProduct);
});

app.delete("/api/products/:id",async (req,res)=>{
    const deleteProduct= await Product.findByIdAndDelete(req.params.id)
    res.send(deleteProduct);
});
app.put("/api/products/:id",async (req,res)=>{
    const UpdateProduct= await Product.findByIdAndUpdate(req.params.id,req.body)
    if(!UpdateProduct) throw Error("something went wrong when update!")
    res.status(200).json({success:true})
    res.send(UpdateProduct);
});

// order...........................................................

const Order=mongoose.model("order",new mongoose.Schema({
    _id:{type: String, default:shortid.generate},
    email:String,
    name:String,
    address:String,
    total:Number,
    cartItems:[{
        _id:String,
        title:String,
        price:Number,
        count:Number,
    }],
},{
    timestamps:true,
}))

app.get("/api/order",async (req,res)=>{
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

   const order=await Order.find({});
   res.send(order);
});

app.post("/api/order",async (req,res)=>{
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);


    if(!req.body.email||!req.body.name||!req.body.address||!req.body.total||!req.body.cartItems)
    {
        return res.send("data is required")
    }
    const order=new Order(req.body);
    const saveOrder=await order.save();
    res.status(200).json({success:true})
    res.send(saveOrder);
})

app.get("/search/:title",(req,res)=>{
     // Website you wish to allow to connect
     res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

     // Request methods you wish to allow
     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
 
     // Request headers you wish to allow
     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
 
     // Set to true if you need the website to include cookies in the requests sent
     // to the API (e.g. in case you use sessions)
     res.setHeader('Access-Control-Allow-Credentials', true);
    var regex=new RegExp(req.params.title,"i");
    Product.find({title:regex}).then((result)=>{
        res.status(200).json(result)
    })

})
 app.listen(process.env.PORT,()=>{
     console.log("start server")
 });

