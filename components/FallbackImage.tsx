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

    const isLocalUpload = typeof imgSrc === 'string' && imgSrc.startsWith('/uploads');

    return (
        <Image
            {...props}
            alt={alt || "Image"}
            src={imgSrc || fallbackSrc}
            onError={() => setImgSrc(fallbackSrc)}
            unoptimized={isLocalUpload || props.unoptimized}
        />
    );
}
