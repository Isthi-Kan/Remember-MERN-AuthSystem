import React, { useContext, useEffect } from 'react'
import { assets } from '../assets/assets';
import { AppContent } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const EmailVerify = () => {

  axios.defaults.withCredentials = true;

  const { backendUrl, isLoggedIn, userData, getUserData } = useContext(AppContent);

  const navigate = useNavigate();

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


  // function that runs when the form is submitted.
  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault(); //Normally, submitting a form refreshes the page: This line stops the default form refresh.
      const otpArray = inputRefs.current.map(e => e.value); //Get all OTP values from user inputs
      const otp = otpArray.join('');  //join('') combines all the values without spaces : "123456"

      const { data } = await axios.post(backendUrl + '/api/auth/verify-email', { otp });

      if (data.success) {
        toast.success(data.message);
        getUserData();
        navigate('/');
      } else {
         toast.error(data.message);
      }

    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }

  }

  useEffect(() => {
    isLoggedIn && userData && userData.isAccountVerified && navigate('/'); //If the user is logged in and email is verified, redirect to home page.
  }, [isLoggedIn, userData]);

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0 bg-gradient-to-br from-purple-200 to-purple-400'>
      <img onClick={() => navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5  w-28 sm:w-32 cursor-pointer' />

      <form onSubmit={onSubmitHandler} className='bg-slate-900 p-8 rounded-lg shadow-lg w-96 text-sm'>
        <h1 className='text-white text-2xl font-semibold text-center mb-4'>Verify Your Email</h1>
        <p className='text-center mb-6 text-indigo-300'>Please enter the OTP sent to your email.</p>
        <div className='flex justify-between mb-8' onPaste={handlePaste}>
          {Array(6).fill(0).map((_, index) => (
            <input type='text' maxLength='1' key={index} required className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-md' ref={e => inputRefs.current[index] = e} onInput={(e) => handleInput(e, index)} onKeyDown={(e) => handleBackspace(e, index)} />
          ))}
        </div>

        <button className='w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3'>Verify Account</button>
      </form>
    </div>
  )
}

export default EmailVerify