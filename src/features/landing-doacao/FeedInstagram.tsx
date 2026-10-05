import { useEffect, useRef, useState, type ReactNode } from "react";

const EMBED_ID = "25719109";
const SCRIPT = "https://widgets.sociablekit.com/instagram-feed/widget.js";

/**
 * Feed do Instagram (SociableKIT). A aparência dos posts é ajustada no painel do
 * SociableKIT. Enquanto o feed não chega (ou se falhar), aparece a reserva.
 */
export function FeedInstagram({ children }: { children: ReactNode }) {
  const feed = useRef<HTMLDivElement>(null);
  const [carregou, setCarregou] = useState(false);

  useEffect(() => {
    const el = feed.current;
    if (!el) return;
    const observador = new MutationObserver(() => {
      if (el.children.length) {
        setCarregou(true);
        observador.disconnect();
      }
    });
    observador.observe(el, { childList: true });
    if (!document.querySelector(`script[src="${SCRIPT}"]`)) {
      const script = document.createElement("script");
      script.src = SCRIPT;
      script.defer = true;
      document.body.appendChild(script);
    }
    return () => observador.disconnect();
  }, []);

  return (
    <>
      <div className="instagram-feed">
        <div className="sk-instagram-feed" data-embed-id={EMBED_ID} ref={feed} />
      </div>
      {!carregou && <div className="posts posts--reserva">{children}</div>}
    </>
  );
}
