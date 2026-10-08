import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useState } from 'react';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';


const ResetPassword = () => {

  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [isOtpVerified, setIsOtpVerified] = useState(false);


  const inputRefs = React.useRef([]); //This creates a ref that stores multiple input elements.

  const handleInput = (e, index) => {
    if (e.target.value.length > 0 && index < 5) {
      inputRefs.current[index + 1].focus(); //If the user types a value in the current input, focus on the next input.
    }
  }

  const handleBackspace = (e, index) => {
    if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
      inputRefs.current[index - 1].focus(); //If the user presses backspace and the current input is empty, focus on the previous input.
    }
  }

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData('text');
    const pasteArray = paste.split('').slice(0, 6); //Get the first 6 characters of the pasted string.
    pasteArray.forEach((char, index) => {
      if (inputRefs.current[index]) {
        inputRefs.current[index].value = char; //Set the value of the input to the pasted character.
      }
    })
  }

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/send-reset-otp', { email }); //see authController.js line 214
      if (data.success) {
        setIsOtpSent(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

  }


  const onSubmitOtp = async (e) => {
    try {
      e.preventDefault(); ////Normally, submitting a form refreshes the page: This line stops the default form refresh.
      const otpArray = inputRefs.current.map(e => e.value); //Get all OTP values from user inputs
      const otp = otpArray.join('');  //join('') combines all the values without spaces : "123456"

      const { data } = await axios.post(backendUrl + '/api/auth/verify-reset-otp', { email, otp });
      if (data.success) {
        setOtp(otp); 
        setIsOtpVerified(true);
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(backendUrl + '/api/auth/reset-password', { email, otp, newPassword });
      if (data.success) {
        toast.success(data.message);
        navigate('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  }


  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-purple-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5  w-28 sm:w-32 cursor-pointer' />


      {/* form to enter email id */}
      {/* email itrku otp send ahhadha varai indha form show aahum*/}
      {!isOtpSent &&
        < form onSubmit={onSubmitEmail} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your email address to reset your password.</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.mail_icon} alt="" className='w-4 h-4' />
            <input type="email" placeholder='Email id' className='bg-transparent outline-none text-white' value={email} onChange={(e) => setEmail(e.target.value)} required />

          </div>

          <button type='submit' className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white cursor-pointer rounded-full mt-3'>Send Reset OTP</button>
        </form>

      }


      {/* Reset Password OTP enter form */}
      {/*email itrku otp send aahiya pirahu, and andha otp ai enter seidhu vrify panna mudhal indha form show aahum */}
      {isOtpSent && !isOtpVerified &&
        <form onSubmit={onSubmitOtp} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>Reset Password OTP</h1>
          <p className='text-center mb-6 text-indigo-300'>Please enter the OTP sent to your email.</p>
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
            {Array(6).fill(0).map((_, index) => (
              <input type='text' maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' ref={e => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleBackspace(e, index)} />
            ))}
          </div>

          <button type='submit' className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white cursor-pointer rounded-full mt-3'>Submit</button>
        </form>
      }


      {/* Enter new password form */}
      {/* otp send aahi, otp ai verify panna pirahu mattum indha form shoe aahum */}

      {isOtpSent && isOtpVerified &&

        <form onSubmit={onSubmitNewPassword} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
          <h1 className='text-white text-2xl font-semibold text-center mb-4'>New Password</h1>
          <p className='text-center mb-6 text-indigo-300'>Enter your new password.</p>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]'>
            <img src={assets.lock_icon} alt="Lock" className='w-4 h-4' />
            <input type="password" placeholder='New Password' className='bg-transparent outline-none text-white' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />

          </div>

          <button type='submit' className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white cursor-pointer rounded-full mt-3'>Update Password</button>
        </form>

      }

    </div >
  )
}

export default ResetPassword