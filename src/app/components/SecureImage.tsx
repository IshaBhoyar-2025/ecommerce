"use client";

import { useEffect, useState } from "react";
import Image, { ImageProps } from "next/image";

// Define props interface and use it
interface SecureImageProps extends Omit<ImageProps, "src"> {
  src: string;
  onClick?: () => void;
}

export default function SecureImage({
  src,
  alt = "Secure Image",
  fill,
  className = "rounded-md border object-cover",
  width,
  height,
  onClick,
}: SecureImageProps) {
  const [signedUrl, setSignedUrl] = useState("");

  useEffect(() => {
    const fetchSignedUrl = async () => {
      try {
        const res = await fetch("/api/s3/get-signed-url", {
          method: "POST",
          body: JSON.stringify({ key: src }),
          headers: { "Content-Type": "application/json" },
        });

        const data = await res.json();
        if (data.url) setSignedUrl(data.url);
      } catch (err) {
        console.error("Failed to fetch signed URL", err);
      }
    };

    fetchSignedUrl();
  }, [src]);

  if (!signedUrl) return <p>Loading image...</p>;

  return (
    <Image
      src={signedUrl}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      onClick={onClick}
      className={className}
      unoptimized
    />
  );
}
