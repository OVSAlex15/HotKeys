
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

interface EyeAuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (values: { email: string; password: string; confirmPassword?: string }) => void;
}

const EyeAuthForm: React.FC<EyeAuthFormProps> = ({ type, onSubmit }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pupilPosition, setPupilPosition] = useState(0);
  const [eyeOpen, setEyeOpen] = useState(true);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    const direction = newEmail.length > email.length ? 1 : -1; 
    const newPosition = Math.min(Math.max(pupilPosition + (direction * 5), -15), 15);
    
    setPupilPosition(newPosition);
    setEmail(newEmail);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setEyeOpen(false);
    setPassword(newPassword);
  };

  const handleEmailFocus = () => {
    setEyeOpen(true);
    setPupilPosition(-15); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Email и пароль обязательны для заполнения');
      return;
    }
    
    if (type === 'signup') {
      if (password !== confirmPassword) {
        toast.error('Пароли не совпадают');
        return;
      }
      
      if (password.length < 6) {
        toast.error('Пароль должен содержать минимум 6 символов');
        return;
      }
    }
    
    try {
      setIsSubmitting(true);
      await onSubmit({ email, password, confirmPassword });
    } catch (error) {
      console.error('Ошибка при отправке формы:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-md bg-glass animate-fade-in">
      <div className="flex justify-center mt-6">
        <div className="relative w-32 h-24">
          <img 
            src={eyeOpen ? "/images/05a01e7d-51c7-404b-b680-15ac23f67a85.png" : "/images/981dacc3-a81a-466b-ac41-21d6b0cf32c3.jpg"} 
            alt={eyeOpen ? "Открытый глаз" : "Закрытый глаз"} 
            className="w-full h-full object-contain"
          />

          {eyeOpen && (
            <div 
              className="absolute w-6 h-6 bg-black rounded-full top-1/2 -translate-y-1/2"
              style={{ 
                left: `calc(50% - 12px + ${pupilPosition}px)`,
                transition: 'left 0.2s ease-out'
              }}
            />
          )}
        </div>
      </div>

      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-medium text-center">
          {type === 'signin' ? 'Вход в аккаунт' : 'Создать аккаунт'}
        </CardTitle>
        <CardDescription className="text-center">
          {type === 'signin' 
            ? 'Введите данные для входа в ваш аккаунт' 
            : 'Заполните форму для создания нового аккаунта'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={handleEmailChange}
              onFocus={handleEmailFocus}
              className="h-11 bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password">Пароль</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={handlePasswordChange}
              onFocus={() => setEyeOpen(false)}
              className="h-11 bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
              required
              minLength={6}
            />
          </div>
          
          {type === 'signup' && (
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Подтвердите пароль</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onFocus={() => setEyeOpen(false)}
                className="h-11 bg-white/50 border-gray-200 focus:border-blue-400 focus:ring-blue-400 transition-all duration-200"
                required
                minLength={6}
              />
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full h-11 bg-blue-500 hover:bg-blue-600 transition-colors duration-300"
            disabled={isSubmitting}
          >
            {isSubmitting 
              ? (type === 'signin' ? 'Вход...' : 'Регистрация...') 
              : (type === 'signin' ? 'Войти' : 'Зарегистрироваться')}
          </Button>
        </form>
      </CardContent>
      <CardFooter>
        <p className="text-sm text-center w-full text-gray-500">
          {type === 'signin' ? (
            <>
              Нет аккаунта?{' '}
              <Link to="/signup" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Зарегистрироваться
              </Link>
            </>
          ) : (
            <>
              Уже есть аккаунт?{' '}
              <Link to="/signin" className="text-blue-500 hover:text-blue-600 font-medium transition-colors">
                Войти
              </Link>
            </>
          )}
        </p>
      </CardFooter>
    </Card>
  );
};

export default EyeAuthForm;
