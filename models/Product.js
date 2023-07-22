// This will be our products model schema 


import { model, Schema } from "mongoose"

// Mongoose Schema is the blue print that defines the structure of documents that will be stored in MongoDB
const ProductSchema = new Schema({
    title: {type:String, required:true}, 
    description: String, 
    price: {type:Number, required:true}
})

// After creating a schema, we created a mongoose model based on that schema 
const Product = model('product', ProductSchema)