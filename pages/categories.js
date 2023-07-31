import Layout from "@/components/Layout"

const categories = () => {


  const [name, saveName] = useState('')

  // Create a save category handler function that will run on submit 
  const saveCategory = () => {

  }
  return (
    <Layout>
        <h1>Categories</h1>

         {/* flex used to put input category name NEXT to a save button */}
        <form onSubmit={saveCategory} className="flex gap-1"> 
        {/* remove the slight margin at the bottom */}
          <input 
            className="mb-0" 
            type="text" 
            placeholder={'Category Name'}
            // set the name to event.target when the input is changed
            onChange = {event => setName(event.target.value)} 
            />  
          <button type="submit" className="btn-primary py-1">Save</button>
        </form>
        
    </Layout>
  )
}

export default categories