import React, { useContext, useState } from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Navbar = () => {

  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedIn } = useContext(AppContent);  //useContext used to get shared values from AppContext.jsx.
  // userData => userData is an object that contains the user's information from db.

  const [showConfirmModal, setShowConfirmModal] = useState(false); // State to toggle delete account confirmation modal


  //This Function runs when the user clicks the logout button
  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true; // Axios request-ல் cookies-ஐ send/receive செய்ய allow செய்கிறது.
      const { data } = await axios.post(backendUrl + '/api/auth/logout');
      data.success && setIsLoggedIn(false);
      data.success && setUserData(false);
      navigate('/');
      toast.success('Logged out successfully');

    } catch (error) {
      toast.error(error.message);
    }
  };

  
  // This function runs when the user clicks "Confirm" in the delete account confirmation modal
  const handleDeleteAccount = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.delete(backendUrl + '/api/auth/delete-account');

      if (data.success) {
        setIsLoggedIn(false);
        setUserData(false);
        setShowConfirmModal(false);
        navigate('/');
        toast.success(data.message || 'User account deleted successfully.');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };


  //This Function runs to send verification OTP when the user clicks the "Verify Email" button
  const handleSendEmailVerifyOtp = async () => {
    try {
      axios.defaults.withCredentials = true;

      const { data } = await axios.post(backendUrl + '/api/auth/send-verify-otp'); // this axios request will run sendVerifyOtp controller function in authController.js

      if (data.success) {
        navigate('/email-verify');
        toast.success('Verification OTP sent to your email');
      } else {
        toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt="" className='w-28 sm:w-32' />
      {/* இந்த இடத்தில் userData தான் suitable 👍:ஏனென்றால் நீங்கள் check பண்ணுவது: "User data இருக்கிறதா? இருந்தால் profile icon காட்ட வேண்டும்."  */}
      {userData ?
        <div className='w-10 h-10 flex justify-center items-center rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-semibold shadow-md ring-2 ring-indigo-200 cursor-pointer relative group transition-transform duration-200 hover:scale-105'>
          {userData.name[0].toUpperCase()}
          <div className='absolute hidden group-hover:block top-0 right-0 z-20 pt-12'>
            <ul className='list-none m-0 p-1.5 bg-white text-gray-700 text-sm rounded-2xl shadow-xl border border-gray-100 w-44'>

              {!userData.isAccountVerified ? <li onClick={handleSendEmailVerifyOtp} className='py-2 px-3 hover:bg-red-50 hover:text-red-500 rounded-xl cursor-pointer transition-colors duration-150 font-medium'>Verify Email</li> : <li className='py-2 px-3 hover:bg-indigo-50 hover:text-indigo-600 rounded-xl cursor-pointer transition-colors duration-150 font-medium'>Account Verified</li>}

              <li onClick={handleLogout} className='py-2 px-3 hover:bg-gray-100 text-gray-700 rounded-xl cursor-pointer transition-colors duration-150 font-medium'>Logout</li>

              <li onClick={() => setShowConfirmModal(true)} className='py-2 px-3 hover:bg-red-50 text-red-500 rounded-xl cursor-pointer transition-colors duration-150 font-medium'>Delete Account</li>

            </ul>
          </div>
        </div>
        : <button onClick={() => navigate('/login')} className='flex items-center gap-2  border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all'>Login <img src={assets.arrow_icon} alt="" /></button>

      }

      {/* Delete Account Confirmation Modal */}
      {showConfirmModal && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs px-4'>
          <div className='bg-white rounded-2xl p-6 sm:p-7 max-w-sm w-full shadow-2xl border border-gray-100 text-center relative'>
            <div className='w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center text-red-600'>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            
            <h3 className='text-lg font-semibold text-gray-800 mb-2'>Delete Account</h3>
            <p className='text-gray-500 text-sm mb-6'>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>

            <div className='flex items-center justify-center gap-3'>
              <button
                type='button'
                onClick={() => setShowConfirmModal(false)}
                className='flex-1 py-2.5 px-4 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 font-medium text-sm transition-colors cursor-pointer'
              >
                Cancel
              </button>
              <button
                type='button'
                onClick={handleDeleteAccount}
                className='flex-1 py-2.5 px-4 rounded-xl bg-red-600 hover:bg-red-700 text-white font-medium text-sm transition-colors shadow-sm cursor-pointer'
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

export default Navbar;

// ------- NOTE: ---------- |

// 1. w-full --> Navbar Screen in முழு width-ஐ எடுத்துக்கொள்ளும்.
// 2. flex →  Inside இருக்கும் elements-ஐ ஒரே row-ல் arrange செய்யும்.
// 3. justify-between →  Left element-ஐ left side-லும், right element-ஐ right side-லும் வைக்கும்.
// 4. items-center → Elements-ஐ vertically center செய்யும்.
// 5. px → padding left + right


