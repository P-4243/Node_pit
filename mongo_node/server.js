const mongoose = require('mongoose');
const express = require('express')
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());

//mongodb connection string
const dbURI ='mongodb://localhost:27017/crud';

//connect to mongodb
mongoose.connect(dbURI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(()=>console.log('MongoDb sucsessfully connected'))
.catch(err=>console.error('Mongo connection error:',err));

//define the schema for the collection
const productSchema =new mongoose.Schema({
    name: {type : String, required : true},
    price: {type : Number, require : true},
    category: {type : String},
    stock: {type: Number, default:0},
    createdOn: {type : Date, default : Date.now}
});

//create a model based on the schema
const Product = mongoose.model('Product',productSchema);

//create a product with POST request
app.post('/products',async(req,res)=>{
    
    try{
        const product = new Product({
            name:req.body.name,
            price:req.body.price,
            category: req.body.category,
            stock: req.body.stock
        });
        
        const saveProduct =await product.save();
        res.status(201).json(saveProduct);
    }
    catch(error){
        console.error('Error creating product:', error);
        res.status(500).send('Error creating product');
    }
});

//read all products with GET request
app.get('/products',async(req,res)=>{
    try{
        const products= await Product.find();
        res.json(products);
    } catch(error){
    res.status(500).send('Error retriving products')
    }
});

//Update a product with PUT request:
app.put('/products/:id',async(req,res)=>{
    try{
        const product =await Product.findByIdAndUpdate(req.params.id,{
            name: req.body.name,
            price: req.body.price,
            category: req.body.category,
            stock: req.body.stock
        },{new:true});
        if(!product) return res.status(404).send('Product not foud');
        res.json(product);
    }catch(error){
        res.status(500).send('error updating the product');
    }
});

//delete the product
app.delete('/products/:id', async(req,res)=>{
    try{
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) return res.status(404).send('Product not found');
        res.status(204).send('Product is Deleted!');
    }catch (error){
        res.status(500).send('Error deleting product');
    }
});


//basic server setup
app.listen(port,()=>{
    console.log(`server running at http://localhost:${port}`);
});