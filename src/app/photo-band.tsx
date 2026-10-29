import Image from "next/image";
import type { ReactNode } from "react";
import { HeaderOverlay } from "@/app/header-overlay";

// "Photo: <name> / Unsplash", the short credit that sits on or under a photo.
export function PhotoCredit({
  name,
  className = "photo-credit",
}: {
  name: string;
  className?: string;
}) {
  return <p className={className}>Photo: {name} / Unsplash</p>;
}

// A page's top photo band: a full-width photo under the see-through header,
// with the page's heading on top. It's the first thing on screen, so the photo
// loads straight away; every other photo loads as you scroll.
export function PhotoBand({
  as: Tag = "section",
  className,
  image,
  imageAlt,
  children,
}: {
  as?: "section" | "header";
  className: string;
  image: string;
  imageAlt: string;
  children: ReactNode;
}) {
  return (
    <Tag className={`photo-band ${className}`} data-hero>
      <HeaderOverlay />
      <div className="photo-band-photo">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="100vw"
          loading="eager"
          fetchPriority="high"
        />
      </div>
      <div className="photo-band-inner" data-reveal-children>
        {children}
      </div>
    </Tag>
  );
}
