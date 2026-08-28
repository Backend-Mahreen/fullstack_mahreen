import { useEffect, useRef, useState } from "react";
import { Camera, QrCode, X } from "lucide-react";
import { scannerDemoValue } from "../verificationData";

type VerificationScannerModalProps = Readonly<{ onClose: () => void; onUseCode: (value: string) => void }>;

const VerificationScannerModal = ({ onClose, onUseCode }: VerificationScannerModalProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [cameraError, setCameraError] = useState("");
  useEffect(() => {
    let stream: MediaStream | null = null;
    let cancelled = false;
    const startCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("Kamera tidak didukung pada browser ini.");
        stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false });
        if (cancelled) { stream.getTracks().forEach((track) => track.stop()); return; }
        if (videoRef.current) { videoRef.current.srcObject = stream; await videoRef.current.play(); }
      } catch (caughtError) { setCameraError(caughtError instanceof Error ? caughtError.message : "Kamera tidak dapat dibuka."); }
    };
    void startCamera();
    return () => { cancelled = true; stream?.getTracks().forEach((track) => track.stop()); };
  }, []);

  return (
    <div className="mvc-modal" role="dialog" aria-modal="true" aria-labelledby="mvc-scanner-title">
      <button className="mvc-modal__backdrop" type="button" onClick={onClose} aria-label="Tutup scanner" />
      <div className="mvc-modal__panel">
        <button className="mvc-modal__close" type="button" onClick={onClose} aria-label="Tutup scanner"><X size={18} /></button>
        <span className="mvc-modal__icon" aria-hidden="true"><QrCode size={28} /></span>
        <h2 id="mvc-scanner-title">Scan QR Dokumen</h2><p>Arahkan kamera ke QR Code resmi Mahreen Indonesia.</p>
        <div className="mvc-camera-frame">
          <video ref={videoRef} muted playsInline /><span aria-hidden="true" />
          {cameraError && <div className="mvc-camera-frame__error"><Camera size={24} /><small>{cameraError}</small></div>}
        </div>
        <button className="mvc-modal__demo" type="button" onClick={() => onUseCode(scannerDemoValue)}>Gunakan QR Demo</button>
      </div>
    </div>
  );
};
export default VerificationScannerModal;
