import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; 

const App = () => {
  return (
    <div>
      <ToastContainer /> {/* ToastContainer - used to show notifications */}
      <Routes> 

        <Route path='/' element={<Home />} />  {/* When the user visits /, show the Home component. */}
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
      </Routes>

       {/* Routes - holds all your routes */}

    </div>
  )
}

export default App