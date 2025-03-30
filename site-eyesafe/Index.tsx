
import React from 'react';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Download, Eye, Monitor, Sun } from 'lucide-react';
import { Link } from 'react-router-dom';
import TrackingEye from '@/components/TrackingEye';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-20 px-4">
          <div className="container mx-auto text-center">
            {/* Blue Badge */}
            <div className="inline-block bg-blue-100 text-blue-600 px-4 py-1 rounded-full mb-6">
              Забота о вашем зрении
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Защитите ваши глаза во время работы за<br /> компьютером
            </h1>
            
            {/* Subheading */}
            <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-12">
              Интеллектуальное приложение, которое следит за вашей осанкой,
              расстоянием до экрана и освещением, чтобы сохранить ваше зрение
              здоровым.
            </p>
            
            {/* Action Button - Updated to link to Download page */}
            <div className="flex justify-center">
              <Button size="lg" className="bg-blue-500 hover:bg-blue-600 rounded-md px-8" asChild>
                <Link to="/download">
                  <Download className="mr-2 h-5 w-5" />
                  Скачать сейчас
                </Link>
              </Button>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-16">
              Основные возможности
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-blue-500 mb-4">
                  <Eye className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Отслеживание расстояния</h3>
                <p className="text-gray-600">
                  Постоянный мониторинг расстояния между вашими глазами и экраном
                </p>
              </div>
              
              {/* Feature 2 */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-blue-500 mb-4">
                  <Monitor className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Контроль осанки</h3>
                <p className="text-gray-600">
                  Анализ вашей позы и напоминания о правильном положении тела
                </p>
              </div>
              
              {/* Feature 3 */}
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <div className="text-blue-500 mb-4">
                  <Sun className="h-10 w-10" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Мониторинг освещения</h3>
                <p className="text-gray-600">
                  Оценка условий освещения для комфортной работы
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-6 bg-gray-50 border-t">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Eyesafe. Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
