import React from 'react';
import RegisterForm from '../components/auth/RegisterForm';

const RegisterPage = () => {
  return (
    <div className="min-h-[calc(70vh-80px)] flex justify-center bg-gray-100 mt-8">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl overflow-hidden">
        <div className="hidden md:block w-1/2 bg-cover bg-center" style={{ backgroundImage: 'url(https://assets.vogue.com/photos/577008633b2b98273965d2d9/master/w_1600,c_limit/KIM_0021.jpg)' }} />
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8">
          <RegisterForm />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;