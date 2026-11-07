import { useEffect, useRef } from "react"

/**
 * Cloudflare Turnstile (captcha quase sempre invisível) antes de reservar os
 * números: sem ele, um robô travaria o quadro reservando tudo. Sem
 * VITE_TURNSTILE_SITE_KEY (dev, testes), não aparece e o token é null.
 */
const SITE_KEY = import.meta.env.VITE_TURNSTILE_SITE_KEY
const SCRIPT = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"

interface TurnstileApi {
  render: (el: HTMLElement, opts: Record<string, unknown>) => string
  reset: (id: string) => void
  remove: (id: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

export const turnstileAtivo = Boolean(SITE_KEY)

let carregando: Promise<void> | null = null
function carregarScript(): Promise<void> {
  if (window.turnstile) return Promise.resolve()
  carregando ??= new Promise((resolve, reject) => {
    const s = document.createElement("script")
    s.src = SCRIPT
    s.async = true
    s.onload = () => resolve()
    s.onerror = () => { carregando = null; reject(new Error("Turnstile indisponível")) }
    document.head.appendChild(s)
  })
  return carregando
}

/**
 * Mostra o desafio e avisa o token (ou null quando expira). `versao` muda
 * para pedir um token novo — cada token só vale para uma reserva.
 */
export function Turnstile({ onToken, versao }: { onToken: (token: string | null) => void; versao: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const id = useRef<string | null>(null)
  const callback = useRef(onToken)
  callback.current = onToken

  useEffect(() => {
    if (!SITE_KEY || !ref.current) return
    let ativo = true
    carregarScript()
      .then(() => {
        if (!ativo || !ref.current || !window.turnstile) return
        id.current = window.turnstile.render(ref.current, {
          sitekey: SITE_KEY,
          action: "reservar",
          language: "pt-br",
          appearance: "interaction-only",
          callback: (token: string) => callback.current(token),
          "expired-callback": () => callback.current(null),
          "error-callback": () => callback.current(null),
        })
      })
      .catch(() => callback.current(null))
    return () => {
      ativo = false
      if (id.current && window.turnstile) window.turnstile.remove(id.current)
      id.current = null
    }
  }, [])

  useEffect(() => {
    if (versao > 0 && id.current && window.turnstile) {
      callback.current(null)
      window.turnstile.reset(id.current)
    }
  }, [versao])

  if (!SITE_KEY) return null
  return <div className="turnstile" ref={ref} />
}
