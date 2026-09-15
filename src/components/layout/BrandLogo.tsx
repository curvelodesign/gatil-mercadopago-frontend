import { ImageWithFallback } from "@/components/ImageWithFallback";
import avatarImg from "@/assets/avatar.png";
import logoImg from "@/assets/logo.png";

export function BrandLogo() {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <div className="h-9 w-9 shrink-0 sm:h-11 sm:w-11 lg:h-12 lg:w-12">
        <ImageWithFallback
          src={avatarImg}
          alt="Gatil Irmã Francisca"
          className="h-full w-full rounded-full scale-[0.9] object-contain"
        />
      </div>
      <div className="h-9 w-32 shrink-0 sm:h-11 sm:w-48 lg:h-12 lg:w-52">
        <ImageWithFallback
          src={logoImg}
          alt="Gatil Irmã Francisca"
          className="block h-full w-full origin-left scale-[0.6] object-contain object-left"
        />
      </div>
    </div>
  );
}