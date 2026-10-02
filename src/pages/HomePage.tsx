import { Link } from "react-router-dom";

/**
 * Página provisória da raiz (/) enquanto a landing page do Gatil não
 * é implementada — só encaminha pras campanhas ativas.
 */
export function HomePage() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
      <h1 className="font-display text-3xl font-bold text-verde-escuro">
        Gatil Irmã Francisca
      </h1>
      <p className="text-sm text-carvao/70">
        Nossa página principal está em construção. Enquanto isso, você pode
        ajudar os gatos por aqui:
      </p>
      <div className="flex w-full flex-col gap-3 sm:flex-row">
        <Link
          to="/rifa"
          className="flex-1 rounded-full bg-verde px-6 py-3 font-display text-sm font-bold text-white transition hover:bg-verde-escuro"
        >
          Participar da rifa
        </Link>
        <Link
          to="/doar"
          className="flex-1 rounded-full border border-verde bg-white px-6 py-3 font-display text-sm font-bold text-verde-escuro transition hover:bg-verde/5"
        >
          Fazer uma doação
        </Link>
      </div>
    </div>
  );
}
