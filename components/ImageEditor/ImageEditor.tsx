"use client";

import { ChangeEventHandler, FC, useCallback, useRef } from "react";

export const ImageEditor: FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const onImageUpload: ChangeEventHandler<HTMLInputElement> = useCallback(async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const cntx = canvasRef.current?.getContext("2d");
    if (!cntx) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result;
      if (typeof result === "string") {
        img.src = result;
      }
    };
    reader.readAsDataURL(file);

    const img = new Image();
    img.onload = () => {
      if (!canvasRef.current) return;
      canvasRef.current.width = img.width;
      canvasRef.current.height = img.height;
      cntx.drawImage(img, 0, 0, img.width, img.height);
    };
  }, []);

  return (
    <div className="h-[1024px] w-full overflow-auto border border-solid border-gray-200 dark:border-gray-600">
      <input
        ref={inputRef}
        onChange={onImageUpload}
        className="hidden"
        type="file"
        accept="image/png, image/jpeg, image/bmp, image/webp"
      />

      <canvas
        onClick={() => {
          inputRef.current?.click();
        }}
        ref={canvasRef}
        width={1024}
        height={1024}
      />
    </div>
  );
};
