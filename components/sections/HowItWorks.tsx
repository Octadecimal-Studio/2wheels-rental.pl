import { FiCalendar, FiFileText, FiKey } from 'react-icons/fi';

const steps = [
  {
    icon: FiCalendar,
    title: 'Wybierz motocykl',
    description: 'Przeglądaj naszą flotę i wybierz motocykl swoich marzeń',
  },
  {
    icon: FiFileText,
    title: 'Wypełnij formularz',
    description: 'Podaj daty wypożyczenia i swoje dane kontaktowe',
  },
  {
    icon: FiKey,
    title: 'Odbierz i jedź!',
    description: 'Odbierz motocykl w naszej wypożyczalni i ciesz się jazdą',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Wypożyczenie w 3 krokach
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Prosty i szybki proces rezerwacji
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-accent-red rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-white text-3xl" />
                </div>
                <div className="text-3xl font-bold text-accent-red mb-2">{index + 1}</div>
                <h3 className="font-heading text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-medium">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
