import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import UploadSpinner from "./UploadSpinner";
import {ReactSortable} from "react-sortablejs"

// we pass in the CURRENT product information PROPS IF it exists, since we are using this form for both edit and new products
const ProductForm = 
    ({_id, // we pass in the id 
    // we dont want the same names as the state names so we use currentTitle, etc
    title: currentTitle,
    description: currentDescription,
    price: currentPrice,
    images: currentImages,
    category: currentCategory,
    properties: currentProperties
    }) => 
{

    // When the fields are changed on the form, we need to hold its value in useState
    // normally we would have the useState initialized as '' but if it has existing information we will start there

    const [title, setTitle] = useState(currentTitle || '') 
    const [description, setDescription] = useState(currentDescription || '')
    const [price, setPrice] = useState(currentPrice || '')
    const [images, setImages] = useState(currentImages || [])
    const [backToProducts, setBackToProducts] = useState(false) // we want to set a state where we can go back to the products page after submitting the form 
    const [isUploading, setIsUploading] = useState(false)
    const [categories, setCategories] = useState([false]) // this is the data that we get back from request from the categories endpoint
    const [category, setCategory] = useState(currentCategory || '') // this is setting the category ON the product 
    const [productProperties, setProductProperties] = useState( currentProperties || {})





    const router  = useRouter()

    // This is a cool thing to do, getting information from a seperate endpoint
    // we are in the product form and here we make a request to get the category data from the endpoint
    useEffect(() =>{
        axios.get('/api/categories').then(result => {
            setCategories(result.data) // now we can access all thje categories that were created
        })
    }, [])




    // Function handler which is an async function that makes a post request to the api end point --> products.js
    // We used fetch in the past but here we will use axios to make the request
    const saveProduct = async(event) => {
        event.preventDefault() // clicking on submit button will submit the form right away, this prevents that 
        const data = {title, description, price, images, category, properties:productProperties} // set properties as productProperties thats why in our api endpoint we can just use "properties"
        if(_id){
            // if we have an id then we should be updating the product 
            await axios.put('/api/products', {...data, _id})// here we use a spread operator to pass in the data OF the specific product
        } else {
            await axios.post('/api/products', data) // sample post request format - axios.post(url[, data[, config]])
        }
        setBackToProducts(true) // once done then the user will be sent back to the product page
    }

    if (backToProducts === true) {
        // redirect the user back to the products page 
        router.push('/products')
    }

    // When we select a file to be uploaded, its information will be in the event
    const uploadImages = async(event) => {
        const files = event.target?.files //Inside the event we have the target attribute which has the name of file
        if (files?.length > 0){

            setIsUploading(true) // we will create a spinner that tells us if image is uploading
            // We may have multiple images
            const data = new FormData() // this is a constructor in js that creates a new instance of FormData object and allows you to construct and handle HTML form data to be sent to server
            // such as through HTTP requests
            // In other words instead of json data which we normally send we send form data. This is because as we learned from our previous projects 
            // Json data doesnt work the best with other data types such as images
            for (const file of files){
                data.append('file', file) // append the data to each file 
            }
            const response = await axios.post('/api/upload', data) // Not updating our product we are just uploading photos 
            setImages(oldImages => {
                console.log("this is the", response.data.links)
                return [...oldImages, ...response.data.links] // so pretty much here for the setImages state we will have both the old links AND newly added ones
            })
            setIsUploading(false)
        }   
    }

    // After the drag and drop, new order will be set and saved
    const updateImagesOrder = (images) => {
       setImages(images)
    }


    const propertiesToFill = []

    if (categories.length > 0 && category){
        // Here we must find the category that is selected
        let selectedCategoryInfo = categories.find(({_id}) => _id === category)
        
        // we need to check if the selected category has a parent category
        // but first we need to add the properties from the selected category info
        if(selectedCategoryInfo){
            propertiesToFill.push(...selectedCategoryInfo.properties)
            // while we have a parent in the selected category information then we should add those properties
            while(selectedCategoryInfo?.parent?.id){
                const parentCategory = categories.find(({_id}) => _id === selectedCategoryInfo?.parent?._id)
                propertiesToFill.push(...parentCategory.properties)
                selectedCategoryInfo = parentCategory
            }
        }

        console.log("heres", propertiesToFill)
    }


    const setProductProperty = (propertyName, value) => {
        setProductProperties(prev => {
            // We are starting to see a pattern here, when we set the new product proeprties we first grab the PREVIOUS properties then add the new ones
            const newProductProperties = {...prev}
            newProductProperties[propertyName] = value
            return newProductProperties
        })
    }
    



    return(
       <>
            {/* On the form submit we need a function handler */}
            <form onSubmit={saveProduct}>
                {/* The input will be styled from the global css file */}
                <input 
                    type="text"
                    placeholder="New Product Name"
                    value={title}
                    // onchange we will change the title state with what was added from the event.target
                    onChange = {event => setTitle(event.target.value)}

                />


                {/* here we will allow the user to choose the category */}
                <select value={category}
                    onChange={event => setCategory(event.target.value)}
                    >
                    <option value = "">Uncategorized</option>

                    {/* from our use state we are able to get all the categories and then map them */}
                    {categories.length > 0 && categories.map(category => (
                        <option value={category._id}>{category.name}</option>
                    ))}

                </select>


                {/* From the categories we want to grab all the properties and then list them out*/}
                {propertiesToFill.length > 0 && propertiesToFill.map(property => (
                <div className = "flex gap-1">
                    <div>{property.name}</div>


                    {/* Now for each properties, allow the user to select from the property values that we have set when the property was created */}
                    <select value = {productProperties[property.name]} onChange={event => setProductProperty(property.name, event.target.value)}>
                        {property.values.map( value => (
                            <option value={value}>{value}</option>
                        ))}
                    </select>
                </div>
                    

                    
                ))}
                



                <textarea 
                    placeholder="Description"
                    value={description}
                    onChange = {event => setDescription(event.target.value)}
                />



              



                <div className="mb-2 mt-2 flex flex-wrap gap-2">
                    

                    


                    {/* For the upload button center the items and place some space in between */}
                    {/* we use label instead of button because we have the input tag, with file upload */}
                    <label className="w-32 h-32 cursor-pointer text-center flex items-center justify-center gap-1 text-gray-500 rounded-lg text-sm bg-sky-300 shadow-md">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                        </svg>
                        Upload Photos
                        <input type="file" onChange = {uploadImages} className="hidden"/>
                    </label>
                    
                    {/* React sortable will allow us to drag and drop the images in an order we choose */}
                    <ReactSortable 
                        list={images} 
                        className = "flex flex-wrap gap-1"
                        setList={updateImagesOrder}>

                         {/* Similar to our kickflix app if there is an image uploaded we are pretty much using the link to then show the actual image */}
                        {!!images?.length && images.map((link) => (
                        <div key={link} className="h-32 bg-sky-500 p-2 rounded-md shawdow-sm">
                            <img src={link} alt="" className="rounded-lg"/>
                        </div>
                    ))}
                    </ReactSortable>
                {isUploading && (
                    <div className="h-24 flex items-center">
                        <UploadSpinner />
                    </div>
                )}
                </div>


               
                <input 
                    type="number" 
                    placeholder="Price"
                    value={price}
                    onChange = {event => setPrice(event.target.value)}
                    />
                <button  
                type="submit"
                className="btn-primary">Save</button>
            </form>
        </>
    )
}



export default ProductForm