import Image from "next/image";

export default function BrandMark({ size = 34, className = "" }) {
  return (
    <Image
      src="/almamlaka-icon.png"
      alt=""
      width={size}
      height={size}
      className={`flex-none rounded-[7px] object-cover ${className}`}
      style={{ width: size, height: size }}
    />
  );
}
