
import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { LogOut, CreditCard, KeyRound, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { format, addMonths } from 'date-fns';
import { ru } from 'date-fns/locale';

const Profile: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [userCode, setUserCode] = useState<string | null>(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [nextBillingDate, setNextBillingDate] = useState<Date>(new Date());

  // Получаем активационный код пользователя при загрузке страницы
  useEffect(() => {
    const fetchUserCode = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('activation_codes')
          .select('code')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Ошибка при получении кода активации:', error);
          return;
        }
        
        if (data) {
          setUserCode(data.code);
        }
      } catch (error) {
        console.error('Ошибка при запросе кода активации:', error);
      }
    };

    // Устанавливаем дату следующего платежа (через месяц от текущей даты)
    const now = new Date();
    const nextMonth = addMonths(now, 1);
    setNextBillingDate(nextMonth);
    
    fetchUserCode();
  }, [user]);

  // Перенаправляем, если пользователь не авторизован
  if (!loading && !user) {
    return <Navigate to="/signin" />;
  }

  const generateUniqueCode = async () => {
    if (!user) return;
    
    // Проверяем, есть ли уже код
    if (userCode) {
      toast.error("У вас уже есть активационный код");
      return;
    }
    
    setCodeLoading(true);
    
    try {
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      let code = '';
      
      for (let i = 0; i < 12; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        code += characters.charAt(randomIndex);
      }
      
      // Сохраняем код в базе данных
      const { error } = await supabase
        .from('activation_codes')
        .insert([
          { user_id: user.id, code: code }
        ]);
      
      if (error) {
        console.error('Ошибка при сохранении кода:', error);
        toast.error('Не удалось сгенерировать код. Попробуйте позже.');
        return;
      }
      
      setUserCode(code);
      
      toast.success('Код активации успешно создан');
    } catch (error) {
      console.error('Ошибка при генерации кода:', error);
      toast.error('Произошла ошибка при создании кода');
    } finally {
      setCodeLoading(false);
    }
  };

  const copyCodeToClipboard = () => {
    if (userCode) {
      navigator.clipboard.writeText(userCode);
      toast.success('Код скопирован в буфер обмена');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-grow flex items-center justify-center">
          <p>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8 page-transition">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Личный кабинет</h1>
              <p className="text-gray-500">Добро пожаловать, {user?.email}</p>
            </div>
            
            <div className="mt-4 md:mt-0">
              <Button variant="outline" size="sm" onClick={() => signOut()}>
                <LogOut className="mr-2 h-4 w-4" />
                Выйти
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Личная информация</CardTitle>
                <CardDescription>Данные вашего аккаунта</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b">
                    <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                      {user?.email?.charAt(0).toUpperCase() || 'П'}
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="font-semibold text-lg">{user?.email?.split('@')[0] || 'Пользователь'}</h3>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                      <p className="text-sm text-primary">Тарифный план Pro</p>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Статус подписки:</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Активна
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Следующее списание:</span>
                    <span>{format(nextBillingDate, 'dd MMMM yyyy', { locale: ru })}</span>
                  </div>
                  
                  <Button className="w-full mt-4">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Обновить подписку
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Код активации</CardTitle>
                <CardDescription>Уникальный код для активации Eyesafe на ваших устройствах</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {userCode ? (
                    <div className="flex flex-col space-y-4">
                      <div className="bg-white p-4 rounded-lg border flex items-center justify-between">
                        <span className="font-mono text-lg tracking-wide">{userCode}</span>
                        <Button variant="ghost" size="sm" onClick={copyCodeToClipboard}>
                          <Copy className="h-4 w-4" />
                          <span className="sr-only">Копировать в буфер обмена</span>
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500">
                        Этот код можно использовать для активации Eyesafe на ваших устройствах. 
                        В целях безопасности не делитесь этим кодом с посторонними.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col space-y-4">
                      <p className="text-sm text-gray-500">
                        Сгенерируйте уникальный 12-символьный код для активации Eyesafe на ваших устройствах.
                        Каждый код привязан к вашему аккаунту и может использоваться для аутентификации.
                      </p>
                      <Button 
                        onClick={generateUniqueCode} 
                        disabled={codeLoading}
                      >
                        <KeyRound className="mr-2 h-4 w-4" />
                        {codeLoading ? 'Генерация кода...' : 'Сгенерировать код активации'}
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <footer className="py-6 bg-white border-t">
        <div className="container px-4 md:px-6 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Eyesafe. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
