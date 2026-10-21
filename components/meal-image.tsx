import Image, { type ImageProps } from "next/image";

/** next/image wrapper — uploaded images are served by a route handler, so skip the optimizer for those. */
export default function MealImage({ alt, ...props }: ImageProps) {
  const src = typeof props.src === "string" ? props.src : "";
  return <Image alt={alt} {...props} unoptimized={src.startsWith("/uploads/")} />;
}
