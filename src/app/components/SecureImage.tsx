
// src/app/components/SecureImage.tsx
"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { ImageProps } from "next/image";


interface SecureImageProps extends Omit<ImageProps, "src"> {
  src: string;
  onClick?: () => void;
}

export default function SecureImage({ src, alt, fill, className, width, height,onClick }: { src: string, alt?: string, fill?: boolean, className?: string, width?: number, height?: number, onClick?: () => void }) {
  const [signedUrl, setSignedUrl] = useState("");

  useEffect(() => {
    const fetchSignedUrl = async () => {
      const res = await fetch("/api/s3/get-signed-url", {
        method: "POST",
        body: JSON.stringify({ key: src }),
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (data.url) setSignedUrl(data.url);
    };

    fetchSignedUrl();
  }, [src]);

  if (!signedUrl) return <p>Loading image...</p>;

  return (
    <Image
      src={signedUrl}
      alt={alt || "Secure Image"}
      fill={fill}
      width={width}
      height={height}
      onClick={onClick}
      className={className || "rounded-md border object-cover"}
      unoptimized 
    />
  );
}
