// Just like api/products.js, this will be api/categories which will be the endpoint for categories 
// And will be the handler depending on the req.body method
import Category from "@/models/Category"
import mongooseConnect from "@/lib/mongoose"
import { isAdminRequest } from "./auth/[...nextauth]"
const categoryHandler = async(req, res) => {
    const {method} = req // basically accessing req.method
    await mongooseConnect()
    await isAdminRequest(req, res) // pretty much we make a call to isAdminrequest to make sure that the user logged in is an admin


    // Now if we have a get method then we just return the categories and show them 
    if (method === 'GET'){
        res.json(await Category.find().populate('parentCategory')) //by using populate, an array of documents will be returned IN PLACE of the original _ids
    }
   
    if (method === "POST"){
        const {name, parentCategory, properties} = req.body
         // If we have a post method then we want to create a category using what is pass from req.body
         // By doing parentCategory || undefined --> we are able to add a category without a parent
        const categoryDoc = await Category.create({name, parentCategory : parentCategory || undefined, properties})
        // We will want to make a connection with mongoose database and send this categoryDoc
        res.json(categoryDoc)
    }


    // If we have a put request then that means we are UPDATING a category
    if (method === "PUT"){
        const {name, parentCategory, properties, _id} = req.body
         // If we have a post method then we want to create a category using what is pass from req.body
        const categoryDoc = await Category.updateOne({_id}, {name, parentCategory : parentCategory || undefined, properties}) // the first object is what document we want to update, the second object represents the new data
        // We will want to make a connection with mongoose database and send this categoryDoc
        res.json(categoryDoc)
    }

    // If we have a delete request then delete the category by id
    if (method === "DELETE"){
        const {_id} = req.query
        await Category.deleteOne({_id}) 
        res.json("DELETED!")
    }
}

export default categoryHandler