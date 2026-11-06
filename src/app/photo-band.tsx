import Image from "next/image";
import type { ReactNode } from "react";
import { HeaderOverlay } from "@/app/header-overlay";
import type { Photo } from "@/lessons/lessons";

// "Image: <author> · <license>", the short credit that sits on or under a
// photo, linked to the page the image comes from. Nothing for a page without
// a photo, or a photo the credits manifest has no credit for.
export function PhotoCredit({
  photo,
  className = "photo-credit",
}: {
  photo: Photo | null;
  className?: string;
}) {
  if (!photo?.credit) return null;
  const { author, license, source } = photo.credit;
  return (
    <p className={className}>
      Image: <a href={source}>{author} · {license}</a>
    </p>
  );
}

// A page's top photo band: a full-width photo under the see-through header,
// with the page's heading on top. It's the first thing on screen, so the photo
// loads straight away; every other photo loads as you scroll. A Lesson without
// a photo gets the band's plain navy instead.
export function PhotoBand({
  as: Tag = "section",
  className,
  photo,
  children,
}: {
  as?: "section" | "header";
  className: string;
  photo: Photo | null;
  children: ReactNode;
}) {
  return (
    <Tag className={`photo-band ${className}`} data-hero>
      <HeaderOverlay />
      {photo && (
        <div className="photo-band-photo">
          <Image
            src={photo.image}
            alt={photo.imageAlt}
            fill
            sizes="100vw"
            loading="eager"
            fetchPriority="high"
          />
        </div>
      )}
      <div className="photo-band-inner" data-reveal-children>
        {children}
      </div>
    </Tag>
  );
}
