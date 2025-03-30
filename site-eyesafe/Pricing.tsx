
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PricingCard from '@/components/PricingCard';
import { Check, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectPlan = (plan: string) => {
    console.log('Selected plan:', plan);
    
    toast({
      title: "План выбран",
      description: `Вы выбрали план ${plan}. Перейдите к оформлению.`,
    });
    
    // In a real app, you would handle payment processing here
    // For demo purposes, we'll just redirect to sign up or dashboard
    if (plan === 'Free') {
      navigate('/signup');
    } else {
      navigate('/signup', { state: { selectedPlan: plan } });
    }
  };

  const pricingPlans = [
    {
      title: "Бесплатный",
      price: "Бесплатно",
      description: "Базовые функции защиты зрения для случайных пользователей компьютера.",
      features: [
        { text: "Базовый мониторинг расстояния до глаз", included: true },
        { text: "Простые напоминания о осанке", included: true },
        { text: "Анализ обнаружения света", included: true },
        { text: "Использование на 1 устройстве", included: true },
        { text: "Расширенная аналитика", included: false },
        { text: "Настраиваемые напоминания", included: false },
        { text: "Мониторинг в реальном времени", included: false },
        { text: "Приоритетная поддержка", included: false }
      ],
      buttonText: "Начать бесплатно",
      popular: false
    },
    {
      title: "Про",
      price: "399 ₽",
      description: "Расширенные функции для регулярных пользователей компьютеров, которые ценят здоровье глаз.",
      features: [
        { text: "Расширенное отслеживание расстояния до глаз", included: true },
        { text: "Комплексный мониторинг осанки", included: true },
        { text: "Подробный анализ освещения", included: true },
        { text: "Использование на 3 устройствах", included: true },
        { text: "Детальная аналитика и отчеты", included: true },
        { text: "Настраиваемые напоминания и оповещения", included: true },
        { text: "Мониторинг в реальном времени", included: false },
        { text: "Приоритетная поддержка", included: false }
      ],
      buttonText: "Подписаться на Про",
      popular: true
    },
    {
      title: "Премиум",
      price: "699 ₽",
      description: "Полный комплекс защиты для профессионалов и активных пользователей компьютера.",
      features: [
        { text: "Отслеживание расстояния до глаз в реальном времени", included: true },
        { text: "Расширенный анализ осанки", included: true },
        { text: "Динамические рекомендации по освещению", included: true },
        { text: "Неограниченное количество устройств", included: true },
        { text: "Комплексная аналитика здоровья", included: true },
        { text: "Полностью настраиваемая система", included: true },
        { text: "Мониторинг в реальном времени с ИИ", included: true },
        { text: "Круглосуточная приоритетная поддержка", included: true }
      ],
      buttonText: "Подписаться на Премиум",
      popular: false
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow py-20 page-transition">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-blue-100 text-blue-600 mb-4">
              <span>Гибкие планы</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-blue-600">
              Выберите подходящий план для вашего зрения
            </h1>
            <p className="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">
              Выберите план, который соответствует вашим потребностям, и начните защищать свое зрение уже сегодня.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div 
                key={index}
                className="animate-fade-in" 
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <PricingCard
                  title={plan.title}
                  price={plan.price}
                  description={plan.description}
                  features={plan.features}
                  buttonText={plan.buttonText}
                  popular={plan.popular}
                  onSelect={() => handleSelectPlan(plan.title)}
                />
              </div>
            ))}
          </div>
          
          {/* Features comparison */}
          <div className="mt-20 max-w-6xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">Сравнение функций</h2>
            
            <div className="overflow-x-auto glass-card rounded-xl">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4">Функция</th>
                    <th className="text-center p-4">Бесплатный</th>
                    <th className="text-center p-4">Про</th>
                    <th className="text-center p-4">Премиум</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    "Отслеживание расстояния до глаз",
                    "Мониторинг осанки",
                    "Анализ условий освещения",
                    "Напоминания о перерывах",
                    "Аналитика и отчеты",
                    "Настраиваемые оповещения",
                    "Поддержка нескольких устройств",
                    "Экспорт данных",
                    "Приоритетная поддержка",
                    "Рекомендации на основе ИИ"
                  ].map((feature, i) => (
                    <tr key={i} className="border-b last:border-b-0">
                      <td className="p-4">{feature}</td>
                      <td className="text-center p-4">
                        {i < 3 ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-4">
                        {i < 7 ? (
                          <Check className="h-5 w-5 text-green-500 mx-auto" />
                        ) : (
                          <X className="h-5 w-5 text-gray-300 mx-auto" />
                        )}
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-5 w-5 text-green-500 mx-auto" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {/* FAQs */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center text-blue-600">Часто задаваемые вопросы</h2>
            
            <div className="space-y-6">
              {[
                {
                  q: "Могу ли я изменить свой план позже?",
                  a: "Да, вы можете повысить или понизить свой план в любое время. Изменения будут применены к вашему следующему периоду оплаты."
                },
                {
                  q: "Есть ли бесплатный пробный период для платных планов?",
                  a: "Да, все платные планы предлагают 14-дневный бесплатный пробный период. Кредитная карта не требуется до тех пор, пока вы не решите продолжить."
                },
                {
                  q: "На скольких устройствах я могу использовать Eyesafe?",
                  a: "Бесплатный план поддерживает 1 устройство, план Про поддерживает до 3 устройств, а план Премиум поддерживает неограниченное количество устройств."
                },
                {
                  q: "Могу ли я отменить подписку в любое время?",
                  a: "Да, вы можете отменить подписку в любое время. Ваш доступ будет продолжаться до конца текущего платежного периода."
                },
                {
                  q: "Предлагаете ли вы возврат средств?",
                  a: "Мы предлагаем 30-дневную гарантию возврата денег, если вы не удовлетворены своей подпиской."
                }
              ].map((faq, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-blue-100">
                  <h3 className="text-lg font-medium mb-2 text-blue-600">{faq.q}</h3>
                  <p className="text-gray-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t py-8">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Eyesafe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;
