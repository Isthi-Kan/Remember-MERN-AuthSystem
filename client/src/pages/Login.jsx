import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const navigate = useNavigate(); //used to page navigation function

  const { backendUrl, setIsLoggedIn, getUserData } = useContext(AppContent);  //use backendUrl and setIsLoggedIn from AppContext. 

  const [status, setStatus] = useState('Sign Up'); // if user clicks 'Already have an account?' -> status change to 'Login' (89th line)
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {  //runs when the form is submitted.
    try {
      e.preventDefault();  //Stops the browser from refreshing the page after form submission.

      axios.defaults.withCredentials = true;  //Allows Axios to send cookies with the request.

      if (status === 'Sign Up') {
        const { data } = await axios.post(backendUrl + '/api/auth/register', { name, email, password })  // axios Sends a POST request to your backend: "http://localhost:4000/api/auth/register"

        if (data.success) { // After Successfully Sign Up,..
          setIsLoggedIn(true); // set the user as logged.
          getUserData();  //get user data from AppContext.jsx then send it to Header.jsx to display the user name. 
          navigate('/');
        } else {
          toast.error(data.message);
        }

      } else {
        const { data } = await axios.post(backendUrl + '/api/auth/login', { email, password })

        if (data.success) {  //After Successfully Login,..
          setIsLoggedIn(true);
          getUserData();
          navigate('/');
        } else {
          toast.error(data.message);
        }

      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

  }


  return (

    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-purple-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5  w-28 sm:w-32 cursor-pointer' />
      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm'>
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{status === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p className='text-center text-sm mb-6'>{status === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>

        {/* Form for user input */}
        <form onSubmit={onSubmitHandler} className='flex flex-col'>
          {status === 'Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
              <img src={assets.person_icon} alt="" />
              <input onChange={e => setName(e.target.value)} value={name} className='bg-transparent outline-none' type="text" placeholder='Full Name' required />
            </div>

          )}

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" />
            <input onChange={e => setEmail(e.target.value)} value={email} className='bg-transparent outline-none' type="email" placeholder='Email id' required />
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="Lock" />
            <input onChange={e => setPassword(e.target.value)} value={password} className='bg-transparent outline-none' type="password" placeholder='Password' required />
          </div>

          {status === 'Login' && (
            <p onClick={() => navigate('/reset-password')} className='mb-4 text-indigo-500 cursor-pointer' >Forgot Password?</p>
          )}

          <button type="submit" className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium'>{status}</button>

        </form>
        {status === 'Sign Up' ? (
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '}<span onClick={() => setStatus('Login')} className='text-blue-400 cursor-pointer'>Login here</span>
          </p>
        ) : (
          <p className='text-gray-400 text-center text-xs mt-4'>Don't have an account?{' '}<span onClick={() => setStatus('Sign Up')} className='text-blue-400 cursor-pointer'>Sign up</span>
          </p>
        )}

      </div>

    </div>
  )
}

export default Login


// ------------- Important Notes: ------------------ |

// 1. This is the actual frontend → backend communication.

//        Login.jsx
//           ↓
//     click submit Button
//           ↓
//     run onSubmitHandler function
//           ↓
//     Axios POST request
//           ↓
//backendUrl + "/api/auth/login"
//           ↓
// gets backendUrl from AppContext.jsx via useContext(AppContent)
//           ↓
// http://localhost:4000/api/auth/login
//           ↓
// Backend checks /api/auth inside the server.js
//           ↓
// authRouter (then checks /login inside authRoutes.js)
//           ↓
//       Login controller
//           ↓
//        MongoDB