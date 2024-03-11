import axios from 'axios';
import React, { SyntheticEvent, useState } from 'react';
import { API_URL } from '@/utils/constants';
import { useDispatch } from 'react-redux';
import { setUser } from '@/state/user/userSlice';
import { useRouter } from 'next/router';

const Login = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: SyntheticEvent) => {
    setFormData({ ...formData, [(e.target as HTMLInputElement).name]: (e.target as HTMLInputElement).value });
  };

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();

    // Prepare the request body
    const requestBody = { email: formData.email, password: formData.password };
    try {
      const response = await axios.post(`${API_URL}/user/api/token/`, requestBody);
      console.log(response.data);
      console.log('User logged in successfully');

      // Dispatch the setUser action with the user data
      dispatch(setUser(response.data));
      router.push('/dashboard');
    } catch (error) {
      console.error(error);
      // Handle errors here
    }
  };

  return (
    <div className='flex flex-col items-center justify-center min-h-screen bg-gray-100'>
      <form onSubmit={handleSubmit} className='p-8 bg-white rounded shadow-md w-80'>
        <h2 className='text-2xl font-bold mb-8 text-center'>Login</h2>
        <input
          type='text'
          name='email'
          required
          placeholder='Email'
          onChange={handleChange}
          className='mb-4 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
        />
        <input
          type='password'
          name='password'
          required
          placeholder='Password'
          onChange={handleChange}
          className='mb-4 w-full px-3 py-2 placeholder-gray-300 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500'
        />
        <button
          type='submit'
          className='w-full px-3 py-4 text-white bg-indigo-500 rounded-md hover:bg-indigo-600 focus:outline-none'
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
