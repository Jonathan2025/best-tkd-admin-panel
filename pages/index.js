import { useSession, signIn, signOut } from "next-auth/react"

export default function Home() {
    // User authentication session 
    const { data: session } = useSession()
    // if the user is not logged in, then show them a login screen
    if(!session){
      return(
        // Background blue and takes up the entire screen, items are centered
        <div className = {'bg-blue-400 w-screen h-screen flex items-center'}>
        <div className = 'text-center w-full'> 
        {/* rounded button with padding all sides and extra padding on L and R */}
          {/* When user clicks on button, they will have chance to login with google */}
          <button onClick={()=> signIn('google')} className="bg-white p-2 rounded-md px-3">
            Login with Google
          </button>
        </div>
        
      </div>
          )
    }


    return(
      // Otherwise if we are logged in then show the user
      <div>Logged in as {session.user.email}</div>
    )
  
}
