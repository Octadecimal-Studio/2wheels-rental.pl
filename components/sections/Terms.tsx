'use client';

import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

const terms = [
  {
    title: 'Wymagany wiek',
    content: 'Minimalny wiek wypożyczającego to 21 lat. Wymagane jest posiadanie prawa jazdy kategorii A od minimum 2 lat.',
  },
  {
    title: 'Prawo jazdy',
    content: 'Wymagane jest ważne prawo jazdy kategorii A. Prawo jazdy musi być ważne przez cały okres wypożyczenia.',
  },
  {
    title: 'Dokumenty potrzebne',
    content: 'Przy odbiorze motocykla wymagane są: dowód osobisty lub paszport, prawo jazdy kategorii A, karta kredytowa do blokady kaucji.',
  },
  {
    title: 'Kaucja',
    content: 'Wymagana jest kaucja zwrotna w wysokości 2000-5000 zł (w zależności od modelu). Kaucja jest blokowana na karcie kredytowej i zwracana po zwrocie motocykla w stanie nienaruszonym.',
  },
  {
    title: 'Ubezpieczenie',
    content: 'Wszystkie motocykle są w pełni ubezpieczone. Ubezpieczenie obejmuje OC, AC oraz NNW. Wypożyczający odpowiada za szkody wynikające z nieprawidłowego użytkowania.',
  },
  {
    title: 'Zasady zwrotu',
    content: 'Motocykl należy zwrócić w stanie nienaruszonym, z pełnym bakiem paliwa. Zwrot możliwy w godzinach pracy wypożyczalni. Opóźnienie w zwrocie skutkuje dodatkowymi opłatami.',
  },
];

export default function Terms() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="py-20 bg-gray-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-4">
            Warunki wypożyczenia
          </h2>
          <p className="text-lg text-gray-medium max-w-2xl mx-auto">
            Przed wypożyczeniem zapoznaj się z naszymi warunkami
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          {terms.map((term, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-md mb-4 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-gray-light transition-colors"
              >
                <span className="font-heading text-lg font-bold">{term.title}</span>
                {openIndex === index ? (
                  <FiChevronUp className="text-accent-red" />
                ) : (
                  <FiChevronDown className="text-gray-medium" />
                )}
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 text-gray-medium">
                  {term.content}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
