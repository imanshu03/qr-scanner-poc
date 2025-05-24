"use client";
import QrScanner from "qr-scanner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  FlashIcon,
  Image02Icon,
  FlashOffIcon,
} from "@hugeicons/core-free-icons";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const qrVideoRef = useRef<HTMLVideoElement>(null);
  const qrInstanceRef = useRef<QrScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [hasFlash, setHasFlash] = useState(false);
  const [isFlashOn, setIsFlashOn] = useState(false);

  const onFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      QrScanner.scanImage(reader.result as string).then((result) => {
        alert(result);
        qrInstanceRef.current?.stop();
      });
    };
    e.target.value = "";
  };

  const onDecodeQr = (result: string) => {
    alert(result);
    qrInstanceRef.current?.stop();
  };

  const onToggleFlash = () => {
    qrInstanceRef.current?.toggleFlash().then(() => {
      setIsFlashOn((old) => !old);
    });
  };

  useEffect(() => {
    if (!qrVideoRef.current) return;
    qrInstanceRef.current = new QrScanner(
      qrVideoRef.current,
      onDecodeQr,
      (error) => console.log("error", error)
    );
    qrInstanceRef.current.start();
    qrInstanceRef.current.hasFlash().then((hasFlash) => {
      setHasFlash(hasFlash);
    });

    return () => {
      qrInstanceRef.current?.destroy();
    };
  }, []);

  return (
    <div className="w-screen h-screen flex items-center justify-center bg-black">
      <div className="relative w-[300px] h-[300px] border border-solid border-white">
        <video ref={qrVideoRef} className="w-full h-full object-cover" />
        <div className="absolute bottom-2 flex items-center justify-center gap-2 w-full">
          {hasFlash ? (
            <div
              className="w-8 h-8 flex items-center justify-center p-1 rounded-full border border-solid border-white backdrop-blur-md"
              onClick={onToggleFlash}
            >
              <HugeiconsIcon
                icon={isFlashOn ? FlashOffIcon : FlashIcon}
                className="w-full h-full"
                color="#FFFFFF"
              />
            </div>
          ) : null}
          <div
            className="w-8 h-8 flex items-center justify-center p-1 rounded-full border border-solid border-white backdrop-blur-md"
            onClick={() => fileInputRef.current?.click()}
          >
            <HugeiconsIcon
              icon={Image02Icon}
              className="w-full h-full"
              color="#FFFFFF"
            />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              ref={fileInputRef}
              onChange={onFileUpload}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
