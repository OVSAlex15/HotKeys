
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EyeAuthForm from '@/components/EyeAuthForm';
import { useAuth } from '@/contexts/AuthContext';

const SignUp: React.FC = () => {
  const { user, signUp, loading } = useAuth();

  // Перенаправляем, если пользователь уже вошел
  if (user && !loading) {
    return <Navigate to="/profile" />;
  }

  const handleSignUp = async (values: { email: string; password: string; confirmPassword?: string }) => {
    try {
      await signUp(values.email, values.password);
    } catch (error) {
      console.error('Ошибка при обработке формы регистрации:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 page-transition">
        <div className="w-full max-w-md">
          <EyeAuthForm type="signup" onSubmit={handleSignUp} />
        </div>
      </main>
      
      <footer className="py-6">
        <div className="container text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Eyesafe. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default SignUp;
