
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Download, CheckCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface DownloadInfo {
  platform: string;
  version: string;
  filename: string;
}

const DownloadPage: React.FC = () => {
  const [downloading, setDownloading] = useState<string | null>(null);

  const handleDownload = async (info: DownloadInfo) => {
    try {
      setDownloading(info.platform);
      
      // В будущем здесь будет логика для получения и скачивания файла из Supabase Storage
      // Но пока просто выводим сообщение
      toast.info(`Скачивание ${info.platform} версии ${info.version} начнется автоматически через несколько секунд`);
      
      // Имитация загрузки
      setTimeout(() => {
        setDownloading(null);
        toast.success(`${info.platform} версия ${info.version} успешно скачана`);
      }, 2000);
      
      // Код для скачивания файла из хранилища Supabase Storage
      // const { data, error } = await supabase.storage
      //   .from('downloads')
      //   .download(info.filename);
      
      // if (error) throw error;
      
      // if (data) {
      //   const url = URL.createObjectURL(data);
      //   const a = document.createElement('a');
      //   a.href = url;
      //   a.download = info.filename;
      //   document.body.appendChild(a);
      //   a.click();
      //   URL.revokeObjectURL(url);
      //   document.body.removeChild(a);
      // }
    } catch (error) {
      console.error('Ошибка при скачивании:', error);
      toast.error('Произошла ошибка при скачивании файла');
    } finally {
      setDownloading(null);
    }
  };

  const downloadOptions = [
    {
      platform: 'Windows',
      version: '1.2.0',
      description: 'Для Windows 10 и выше',
      filename: 'eyesafe-windows-1.2.0.exe'
    },
    {
      platform: 'macOS',
      version: '1.2.0',
      description: 'Для macOS 11.0 и выше',
      filename: 'eyesafe-mac-1.2.0.dmg'
    },
    {
      platform: 'Linux',
      version: '1.2.0',
      description: 'Для Ubuntu, Debian и других дистрибутивов',
      filename: 'eyesafe-linux-1.2.0.deb'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow flex flex-col items-center justify-center py-16 px-4 page-transition">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600">
            Скачать Eyesafe
          </h1>
          
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            Выберите версию для вашего устройства и начните заботиться о своем зрении уже сегодня.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {downloadOptions.map((option) => (
              <div key={option.platform} className="bg-white p-8 rounded-xl shadow-md border border-blue-100 flex flex-col">
                <h3 className="text-xl font-semibold mb-4 text-blue-600">{option.platform}</h3>
                <p className="text-gray-600 mb-6 flex-grow">{option.description}</p>
                <Button 
                  className="w-full bg-blue-500 hover:bg-blue-600"
                  onClick={() => handleDownload(option)}
                  disabled={downloading === option.platform}
                >
                  <Download className="mr-2 h-5 w-5" />
                  {downloading === option.platform ? 'Скачивание...' : `Скачать для ${option.platform}`}
                </Button>
                <p className="text-sm text-gray-500 mt-2">Версия {option.version}</p>
              </div>
            ))}
          </div>
          
          <div className="bg-blue-50 p-8 rounded-xl border border-blue-100">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Системные требования</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">Минимальные требования:</h3>
                <ul className="space-y-2">
                  {[
                    "Процессор: Intel Core i3 или аналогичный",
                    "Оперативная память: 4 GB RAM",
                    "Видеокамера",
                    "Подключение к интернету",
                    "50 MB свободного места"
                  ].map((req, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3 text-blue-600">Рекомендуемые требования:</h3>
                <ul className="space-y-2">
                  {[
                    "Процессор: Intel Core i5 или аналогичный",
                    "Оперативная память: 8 GB RAM",
                    "HD веб-камера",
                    "Стабильное интернет-соединение",
                    "100 MB свободного места"
                  ].map((req, i) => (
                    <li key={i} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Eyesafe. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default DownloadPage;
