import { useEffect } from "react";
import { createContext, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

axios.defaults.withCredentials = true; // Axios request-ல் cookies-ஐ send/receive செய்ய allow செய்கிறது.

export const AppContent = createContext();  //This creates a Context named AppContent. 

//"AppContent" used in Login.jsx, Navbar.jsx etc. "AppContextProvider" used in main.jsx only

export const AppContextProvider = (props) => { //AppContextProvider provides these shared values (backendUrl, isLoggedIn, setIsLoggedIn, user, setUser) to  child components. App.jsx is the child of AppContextProvider.

    const backendUrl = import.meta.env.VITE_BACKEND_URL; //tells your  frontend where the backend is running
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(false);

    
    const getAuthStatus = async () => {  
        try {
            const { data } = await axios.get(backendUrl + '/api/auth/is-auth');
            
            if (data.success) {
                setIsLoggedIn(true);
                getUserData();  //If the user is authenticated, fetch their data from the backend.
            } else {
                setIsLoggedIn(false);
                setUserData(false);  //If the user is not authenticated, clear the user data.
            }

        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }

    }

    const getUserData = async () => {  //Creates an async function to fetch user information from the backend.
        try {
            const { data } = await axios.get(backendUrl + '/api/user/get-user-data');  //Sends a GET request to your backend.

            data.success ? setUserData(data.userData) : toast.error(data.message);  // if success is true, store the db user information in userData. otherwise, show an error message. 
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        }
    };

    useEffect(() => { // indha code-ன் purpose: page/app load ஆகும்போது user ஏற்கனவே login ஆகியிருக்கிறாரா என்று check செய்வது.
        getAuthStatus();  
    }, []);  

    const value = { //This creates an object containing everything you want to share.
        backendUrl,
        isLoggedIn, setIsLoggedIn,
        userData, setUserData, 
        getUserData
    }

    return (
        // see explaination below
        <AppContent.Provider value={value}>
            {props.children}
        </AppContent.Provider>
    )
}


//----------- Important Notes: ------------------|

// 1. Think of AppContext as a common storage box for your frontend.

//              AppContext
//           ┌───────────────┐
//           │ backendUrl    │
//           │ isLoggedIn    │
//           │ setIsLoggedIn │
//           │ user          │
//           │ setUser       │
//           └───────────────┘
//                   ↓
//         Any React component
//         can access these values



// 2. const [user, setUser] = useState(false);

//  # It has two parts:
//         *user     → stores the current user information
//         *setUser  → changes the user information

//   Initially: user = false
//  # After the user logs in : Suppose your backend gives you:
//       Name: John, Email: john@gmail.com

//  # You can store it:  setUser({
//                             name: "John",
//                             email: "john@gmail.com"
//                         });

//  # Now the user state contains:
//        ├── name  → John
//        └── email → john@gmail.com

//  # Why keep it in Context? : Because many components may need the user's information.

//          AppContext
//              │
//     user = John
//              │
//     ┌────────┼────────┐
//     ↓        ↓        ↓
//  Navbar    Profile   Home


// 3. Provider

//    # < AppContent.Provider value = { value } >
//         { props.children }
//     </AppContent.Provider >

//     It says: Give these values to all my child components

//     #  Your main.jsx has:
//        <AppContextProvider>
//           <App />   // App.jsx is the child of AppContextProvider.
//        </AppContextProvider>
//                     So:

//              AppContextProvider
//                      ↓
//                     App
//                      ↓
//                ┌─────┼─────┐
//             Navbar Login Profile   All these components can access the Context.