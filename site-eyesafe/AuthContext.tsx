
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import type { User, Session } from '@supabase/supabase-js';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Получаем существующую сессию при загрузке
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Ошибка при получении сессии:', error);
          toast.error('Ошибка при проверке аутентификации');
        } else {
          setSession(data.session);
          setUser(data.session?.user || null);
        }
      } catch (error) {
        console.error('Непредвиденная ошибка:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Устанавливаем слушатель изменений состояния аутентификации
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        console.log('Auth state changed:', _event, session?.user?.email);
        setSession(session);
        setUser(session?.user || null);
        setLoading(false);
      }
    );

    // Очистка слушателя при размонтировании
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Ошибка входа:', error.message);
        toast.error(error.message === 'Invalid login credentials' 
          ? 'Неверный email или пароль' 
          : error.message || 'Ошибка при входе');
        return;
      }

      toast.success('Вход выполнен успешно!');
      navigate('/profile');
    } catch (error) {
      console.error('Ошибка при входе:', error);
      toast.error('Произошла ошибка при входе');
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setLoading(true);
      // Важно: используем signUp вместо signInWithPassword для регистрации
      const { error, data } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('Ошибка регистрации:', error.message);
        
        let errorMessage = 'Ошибка при регистрации';
        
        if (error.message.includes('already')) {
          errorMessage = 'Пользователь с таким email уже существует';
        } else if (error.message.includes('password')) {
          errorMessage = 'Пароль должен содержать минимум 6 символов';
        } else if (error.message.includes('email')) {
          errorMessage = 'Укажите корректный email';
        }
        
        toast.error(errorMessage);
        return;
      }

      console.log('Результат регистрации:', data);
      
      if (data.user && !data.session) {
        toast.info('Проверьте вашу почту для подтверждения аккаунта');
      } else {
        toast.success('Аккаунт успешно создан!');
        navigate('/profile');
      }
    } catch (error) {
      console.error('Ошибка при регистрации:', error);
      toast.error('Произошла неизвестная ошибка при регистрации');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Ошибка выхода:', error.message);
        toast.error(error.message || 'Ошибка при выходе');
        return;
      }
      
      toast.success('Выход выполнен успешно');
      navigate('/');
    } catch (error) {
      console.error('Ошибка при выходе:', error);
      toast.error('Произошла ошибка при выходе');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, session, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth должен использоваться внутри AuthProvider');
  }
  return context;
};
