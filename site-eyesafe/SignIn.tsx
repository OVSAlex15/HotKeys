
import React from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import EyeAuthForm from '@/components/EyeAuthForm';
import { useAuth } from '@/contexts/AuthContext';

const SignIn: React.FC = () => {
  const { user, signIn, loading } = useAuth();

  // Перенаправляем, если пользователь уже вошел
  if (user && !loading) {
    return <Navigate to="/profile" />;
  }

  const handleSignIn = async (values: { email: string; password: string }) => {
    try {
      await signIn(values.email, values.password);
    } catch (error) {
      console.error('Ошибка при обработке формы входа:', error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow flex items-center justify-center p-4 page-transition">
        <div className="w-full max-w-md">
          <EyeAuthForm type="signin" onSubmit={handleSignIn} />
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

export default SignIn;
