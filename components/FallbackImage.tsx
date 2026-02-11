"use client";

import { useState, useEffect } from "react";
import Image, { ImageProps } from "next/image";

interface FallbackImageProps extends ImageProps {
    fallbackSrc?: string;
}

export default function FallbackImage({
    src,
    fallbackSrc = "https://placehold.co/400?text=Audio", // Default fallback
    alt,
    ...props
}: FallbackImageProps) {
    const [imgSrc, setImgSrc] = useState(src);

    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            {...props}
            alt={alt}
            src={imgSrc || fallbackSrc}
            onError={() => setImgSrc(fallbackSrc)}
        />
    );
}
