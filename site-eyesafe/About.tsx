
import React from 'react';
import Navbar from '@/components/Navbar';
import { Eye, Monitor, Sun, Heart, Shield, Users } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50">
      <Navbar />
      
      <main className="flex-grow py-16 px-4 page-transition">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-blue-600 text-center">
            О проекте Eyesafe
          </h1>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Наша миссия</h2>
            <p className="text-lg text-gray-700 mb-6">
              Проект Eyesafe был создан с целью сохранения зрения людей, которые проводят много времени за компьютером. 
              Мы верим, что современные технологии должны помогать людям заботиться о своем здоровье, а не наносить ему вред.
            </p>
            <p className="text-lg text-gray-700">
              Наша миссия — разработать инновационные решения, которые позволят миллионам пользователей компьютеров 
              сохранить здоровье глаз и предотвратить развитие заболеваний, связанных с длительной работой за экраном.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Как работает Eyesafe</h2>
            <p className="text-lg text-gray-700 mb-8">
              Наше приложение использует несколько ключевых технологий для защиты вашего зрения:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex">
                <div className="mr-4 bg-blue-100 p-3 rounded-full h-min">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">Отслеживание расстояния</h3>
                  <p className="text-gray-700">
                    Используя камеру устройства, приложение измеряет расстояние между глазами пользователя и экраном, 
                    предупреждая, когда оно становится слишком малым.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 bg-blue-100 p-3 rounded-full h-min">
                  <Monitor className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">Контроль осанки</h3>
                  <p className="text-gray-700">
                    Алгоритмы компьютерного зрения анализируют положение головы и плеч, 
                    помогая поддерживать правильную осанку во время работы.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 bg-blue-100 p-3 rounded-full h-min">
                  <Sun className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">Анализ освещения</h3>
                  <p className="text-gray-700">
                    Приложение оценивает условия освещения рабочего места и предлагает оптимальные настройки 
                    яркости и контрастности экрана.
                  </p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-4 bg-blue-100 p-3 rounded-full h-min">
                  <Heart className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2 text-blue-600">Напоминания о перерывах</h3>
                  <p className="text-gray-700">
                    Регулярные напоминания о необходимости делать перерывы и выполнять упражнения 
                    для глаз помогают снизить нагрузку.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100 mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Наша команда</h2>
            <p className="text-lg text-gray-700 mb-6">
              Команда Eyesafe состоит из опытных разработчиков, дизайнеров и специалистов в области офтальмологии, 
              объединенных общей целью — сделать работу за компьютером безопасной для здоровья глаз.
            </p>
            <p className="text-lg text-gray-700">
              Мы сотрудничаем с ведущими медицинскими учреждениями и экспертами в области здравоохранения, 
              чтобы обеспечить научно обоснованный подход к разработке наших решений.
            </p>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-md border border-blue-100">
            <h2 className="text-2xl font-semibold mb-6 text-blue-600">Свяжитесь с нами</h2>
            <p className="text-lg text-gray-700 mb-6">
              Мы всегда открыты для обратной связи, предложений и сотрудничества. 
              Если у вас есть вопросы или идеи, пожалуйста, не стесняйтесь обращаться к нам:
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Поддержка пользователей</h3>
                <p className="text-gray-700">
                  Email: support@eyesafe.com<br />
                  Телефон: +7 (999) 123-45-67
                </p>
              </div>
              
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold mb-3 text-blue-600">Деловые запросы</h3>
                <p className="text-gray-700">
                  Email: business@eyesafe.com<br />
                  Телефон: +7 (999) 765-43-21
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} Eyesafe. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
