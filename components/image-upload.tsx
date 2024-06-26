"use client";

import { useEffect, useState } from "react";
import { CldUploadButton, CloudinaryUploadWidgetResults, CloudinaryUploadWidgetInfo } from "next-cloudinary";
import Image from "next/image";

interface ImageUploadProps {
  value: string;
  onChange: (src: string) => void;
  disabled?: boolean;
}

const ImageUpload = ({
  value,
  onChange,
  disabled = false
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null; // Hydration error fixing
  }

  const handleUpload = (result: CloudinaryUploadWidgetResults) => {
    if (result.event === "success" && result.info && typeof result.info !== 'string') {
      const info = result.info as CloudinaryUploadWidgetInfo;
      if (info.secure_url) {
        onChange(info.secure_url);
      }
    }
  };

  return (
    <div className="space-y-4 w-full flex flex-col justify-center items-center">
      {!disabled && (
        <CldUploadButton
          onUpload={handleUpload}
          options={{
            maxFiles: 1
          }}
          uploadPreset="cbinhrhc"
        >
          <div className="
            p-4
            border-4
            border-dashed
            border-primary/10
            rounded-lg
            hover:opacity-75
            transition
            flex
            flex-col
            space-y-2
            items-center
            justify-center
            cursor-pointer
            "
          >
            <div className="relative h-40 w-40">
              <Image
                fill
                alt="Upload"
                src={value || "/placeholder.svg"}
                className="rounded-lg object-cover"
              />
            </div>
            <span>Click to upload</span>
          </div>
        </CldUploadButton>
      )}
      {disabled && (
        <div className="
          p-4
          border-4
          border-dashed
          border-primary/10
          rounded-lg
          flex
          flex-col
          space-y-2
          items-center
          justify-center
          cursor-not-allowed
          opacity-50
          "
        >
          <div className="relative h-40 w-40">
            <Image
              fill
              alt="Upload"
              src={value || "/placeholder.svg"}
              className="rounded-lg object-cover"
            />
          </div>
          
        </div>
      )}
    </div>
  );
}

export default ImageUpload;