import React from 'react';

interface TiempoItem {
  anio: number;
  titulo: string;
  descripcion: string;
}

interface LineaDeTiempoProps {
  items: TiempoItem[];
  titulo?: string;
}

/**
 * Raíl único a la izquierda en vez del zigzag a dos columnas anterior. El
 * zigzag obligaba a leer en diagonal, dejaba una columna vacía en cada fila y
 * por debajo de `md` se derrumbaba en una lista sin línea ni marcadores.
 */
export const LineaDeTiempo: React.FC<LineaDeTiempoProps> = ({ items, titulo }) => (
  <section className="py-20 md:py-24">
    <div className="container mx-auto px-4">
      {titulo && <h2 className="rule-accent font-serif">{titulo}</h2>}

      <ol className="relative mt-14 max-w-3xl">
        {/* El raíl arranca en el centro del primer marcador y muere en el del
            último, en lugar de sobresalir por ambos extremos. */}
        <div
          aria-hidden="true"
          className="absolute bottom-3 left-[5px] top-3 w-px bg-line"
        />

        {items.map((item, idx) => (
          <li key={idx} className="relative pb-12 pl-10 last:pb-0">
            <span
              aria-hidden="true"
              className="absolute left-0 top-2.5 block h-[11px] w-[11px] rounded-full border-2 border-surface-page bg-gold-700"
            />
            <p className="font-serif text-2xl font-semibold text-gold-700">{item.anio}</p>
            <h3 className="mt-2 font-serif text-xl text-navy-800">{item.titulo}</h3>
            <p className="mt-2 leading-relaxed text-content-secondary">{item.descripcion}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
