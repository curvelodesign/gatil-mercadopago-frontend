import imgFotoAna9396 from "@/assets/doacao/foto-ana-9396.webp";
import imgFotoAna9400 from "@/assets/doacao/foto-ana-9400.webp";
import imgFotoAna9435 from "@/assets/doacao/foto-ana-9435.webp";
import imgFotoAna9451 from "@/assets/doacao/foto-ana-9451.webp";
import imgFotoGatil8199 from "@/assets/doacao/foto-gatil-8199.webp";
import imgFotoGatil8246 from "@/assets/doacao/foto-gatil-8246.webp";
import imgFotoGatil8261 from "@/assets/doacao/foto-gatil-8261.webp";
import imgFotoGatil8332 from "@/assets/doacao/foto-gatil-8332.webp";
import imgFotoGatil8333 from "@/assets/doacao/foto-gatil-8333.webp";
import imgFotoGatil8394 from "@/assets/doacao/foto-gatil-8394.webp";
import imgFotoGatil9342 from "@/assets/doacao/foto-gatil-9342.webp";
import imgFotoGatil9346 from "@/assets/doacao/foto-gatil-9346.webp";
import imgFotoGatil9359 from "@/assets/doacao/foto-gatil-9359.webp";
import imgFotoGatil9374 from "@/assets/doacao/foto-gatil-9374.webp";

export interface Foto {
  src: string;
  alt: string;
  /** ponto da foto que fica no centro quando ela é cortada */
  foco: string;
}

export const FOTOS_GATIL: Foto[] = [
  { src: imgFotoGatil8199, alt: "Ana Paula sorrindo enquanto faz carinho em um gato preto e branco", foco: "60% 40%" },
  { src: imgFotoGatil9374, alt: "Filhotes deitados juntos dentro de uma caixa", foco: "35% 60%" },
  { src: imgFotoGatil9342, alt: "Voluntária com um filhote tricolor apoiado no ombro", foco: "55% 55%" },
  { src: imgFotoGatil8246, alt: "Gatos comendo ração juntos em um pote verde", foco: "55% 50%" },
  { src: imgFotoGatil9359, alt: "Gato recebendo atendimento veterinário de mãos com luvas azuis", foco: "45% 60%" },
  { src: imgFotoGatil9346, alt: "Equipe preparando medicação para os gatos", foco: "45% 55%" },
  { src: imgFotoGatil8261, alt: "Gatos descansando no salão do abrigo", foco: "60% 60%" },
  { src: imgFotoGatil8333, alt: "Ambiente do abrigo com gaiolas e potes de comida", foco: "40% 55%" },
  { src: imgFotoGatil8394, alt: "Caixas de areia enfileiradas no espaço do abrigo", foco: "50% 60%" },
  { src: imgFotoGatil8332, alt: "Área de limpeza do abrigo, com vassouras e plantas", foco: "40% 55%" },
];

export const FOTOS_ANA_PAULA: Foto[] = [
  { src: imgFotoAna9435, alt: "Ana Paula segurando um gato laranja e branco no colo, ao ar livre", foco: "55% 45%" },
  { src: imgFotoAna9396, alt: "Ana Paula sorrindo com um gato laranja no colo, dentro do abrigo", foco: "42% 40%" },
  { src: imgFotoAna9451, alt: "Ana Paula sentada no muro do abrigo, cercada de gatos", foco: "52% 62%" },
  { src: imgFotoAna9400, alt: "Ana Paula segurando um gato no colo, dentro do abrigo", foco: "50% 40%" },
];
