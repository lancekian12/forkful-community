"use client";

import { useEffect, useRef, useState } from "react";
import { ImagePlus } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ImagePicker({ name, invalid }: { name: string; invalid?: boolean }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  // React resets the form after an action; the file is cleared, so clear the preview too.
  useEffect(() => {
    const form = inputRef.current?.form;
    if (!form) return;
    const onReset = () => setPreview(null);
    form.addEventListener("reset", onReset);
    return () => form.removeEventListener("reset", onReset);
  }, []);

  useEffect(() => () => void (preview && URL.revokeObjectURL(preview)), [preview]);

  return (
    <label
      className={cn(
        "group relative flex aspect-[4/3] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed bg-surface-2 text-center transition hover:border-accent",
        invalid ? "border-red-500" : "border-line"
      )}
    >
      {preview ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={preview} alt="Selected dish preview" className="absolute inset-0 size-full object-cover" />
      ) : (
        <span className="flex flex-col items-center gap-2 px-6 text-sm text-muted">
          <span className="grid size-12 place-items-center rounded-full bg-surface text-accent shadow-sm">
            <ImagePlus className="size-5" aria-hidden />
          </span>
          <span className="font-semibold text-ink">Add a photo of your dish</span>
          JPG, PNG, WebP or AVIF · up to 4 MB
        </span>
      )}
      {preview && (
        <span className="absolute bottom-3 rounded-full bg-surface/90 px-3 py-1 text-xs font-semibold opacity-0 backdrop-blur transition group-hover:opacity-100">
          Change photo
        </span>
      )}
      <input
        ref={inputRef}
        type="file"
        name={name}
        accept="image/jpeg,image/png,image/webp,image/avif"
        className="sr-only"
        aria-invalid={invalid}
        required
        onChange={(e) => {
          const file = e.target.files?.[0];
          setPreview(file ? URL.createObjectURL(file) : null);
        }}
      />
    </label>
  );
}
