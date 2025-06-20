import React from 'react';
import LoginForm from '../components/auth/LoginForm';

const LoginPage = () => {
  return (
    <div className="min-h-[calc(100vh-80px)] flex justify-center bg-gray-100 mt-8">
      <div className="flex w-full max-w-4xl bg-white rounded-2xl overflow-hidden h-[750px]">
        <div className="hidden md:block w-1/2 h-full bg-cover bg-center" style={{ backgroundImage: 'url(https://assets.vogue.com/photos/577008633b2b98273965d2d9/master/w_1600,c_limit/KIM_0021.jpg)' }} />
        <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 h-full">
          <LoginForm />
          <div className="mt-4 text-center">
            <span className="text-gray-600">Chưa có tài khoản? </span>
            <a href="/register" className="text-blue-600 hover:underline font-semibold">Đăng ký ngay</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;