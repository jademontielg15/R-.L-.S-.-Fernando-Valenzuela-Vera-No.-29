import React from 'react';
import { Card } from '@/components/ui/Card';

interface TiempoItem {
  anio: number;
  titulo: string;
  descripcion: string;
}

interface LineaDeTiempoProps {
  items: TiempoItem[];
  titulo?: string;
}

export const LineaDeTiempo: React.FC<LineaDeTiempoProps> = ({ items, titulo }) => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {titulo && (
          <h2 className="font-serif text-4xl font-bold text-center text-institucional-primario mb-12">
            {titulo}
          </h2>
        )}

        <div className="relative">
          {/* Línea vertical (solo en desktop) */}
          <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-institucional-secundario opacity-30" />

          {/* Items */}
          <div className="space-y-8">
            {items.map((item, idx) => (
              <div
                key={idx}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                  idx % 2 === 0 ? '' : 'md:grid-flow-dense'
                }`}
              >
                {/* Texto */}
                <div className={idx % 2 === 1 ? 'md:col-start-2' : ''}>
                  <Card variant="bordered" className="relative">
                    <h3 className="font-serif text-2xl font-bold text-institucional-primario mb-3">
                      {item.anio}
                    </h3>
                    <h4 className="font-semibold text-lg mb-3">{item.titulo}</h4>
                    <p className="text-gray-700">{item.descripcion}</p>
                  </Card>
                </div>

                {/* Punto en la línea (solo desktop) */}
                <div className="hidden md:flex justify-center">
                  <div className="w-6 h-6 bg-institucional-secundario rounded-full border-4 border-white" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
