'use client';

import { useEffect, useRef, useState, useImperativeHandle, forwardRef } from 'react';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

interface ARCameraProps {
  lipShade: string;
  cheekShade: string;
  browShade: string;
  browProductType: string;
  contourShade: string;
  foundationShade: string;
}

export interface ARCameraRef {
  captureScreenshot: () => void;
}

declare global {
  interface Window {
    FaceMesh: any;
    Camera: any;
  }
}

const ARCamera = forwardRef<ARCameraRef, ARCameraProps>(({
  lipShade,
  cheekShade,
  browShade,
  browProductType,
  contourShade,
  foundationShade,
}: ARCameraProps, ref) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scriptsLoaded, setScriptsLoaded] = useState({ faceMesh: false, camera: false });
  const faceMeshInstance = useRef<any>(null);
  const cameraInstance = useRef<any>(null);

  // Store latest shade values in refs so the callback can access them
  const latestShades = useRef({
    lipShade,
    cheekShade,
    browShade,
    browProductType,
    contourShade,
    foundationShade,
  });

  // Update refs whenever shades change
  useEffect(() => {
    latestShades.current = {
      lipShade,
      cheekShade,
      browShade,
      browProductType,
      contourShade,
      foundationShade,
    };
  }, [lipShade, cheekShade, browShade, browProductType, contourShade, foundationShade]);

  // Expose screenshot capture method to parent
  useImperativeHandle(ref, () => ({
    captureScreenshot: () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
        link.download = `cosmetic-tryOn-${timestamp}.png`;
        link.href = url;
        link.click();

        // Cleanup
        URL.revokeObjectURL(url);
      }, 'image/png');
    },
  }));

  useEffect(() => {
    if (!scriptsLoaded.faceMesh || !scriptsLoaded.camera) return;
    if (faceMeshInstance.current) return;

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    const FaceMesh = window.FaceMesh;
    const Camera = window.Camera;

    const faceMesh = new FaceMesh({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      selfieMode: true,
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results: any) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const width = canvasElement.width;
        const height = canvasElement.height;

        const hexToRGBA = (hex: string, alpha: number) => {
          if (hex === 'transparent') return 'transparent';
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r},${g},${b},${alpha})`;
        };

        // Lips
        const upperOuterLip = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];
        const lowerOuterLip = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];

        canvasCtx.beginPath();
        if (landmarks[upperOuterLip[0]]) {
          canvasCtx.moveTo(landmarks[upperOuterLip[0]].x * width, landmarks[upperOuterLip[0]].y * height);
          [...upperOuterLip, ...lowerOuterLip.slice().reverse()].forEach(idx => {
            const pt = landmarks[idx];
            canvasCtx.lineTo(pt.x * width, pt.y * height);
          });
          canvasCtx.closePath();
          canvasCtx.fillStyle = hexToRGBA(latestShades.current.lipShade, 0.25);
          canvasCtx.fill();
        }

        // Cheeks
        const drawCheek = (idx: number) => {
          const pt = landmarks[idx];
          if (pt) {
            const x = pt.x * width;
            const y = pt.y * height - 10;
            canvasCtx.beginPath();
            canvasCtx.ellipse(x, y, 30, 20, 0, 0, 2 * Math.PI);
            canvasCtx.fillStyle = hexToRGBA(latestShades.current.cheekShade, 0.045);
            canvasCtx.fill();
          }
        };
        drawCheek(205);
        drawCheek(425);

        // Brows
        if (latestShades.current.browShade !== 'transparent') {
          const browAlpha = latestShades.current.browProductType.includes('Pencil') ? 0.3 : 0.2;
          const leftBrow = [70, 63, 105, 66, 107, 55];
          const rightBrow = [336, 296, 334, 293, 300, 285];

          [leftBrow, rightBrow].forEach(brow => {
            canvasCtx.beginPath();
            if (landmarks[brow[0]]) {
              canvasCtx.moveTo(landmarks[brow[0]].x * width, landmarks[brow[0]].y * height);
              brow.forEach(idx => {
                const pt = landmarks[idx];
                canvasCtx.lineTo(pt.x * width, pt.y * height);
              });
              canvasCtx.closePath();
              canvasCtx.fillStyle = hexToRGBA(latestShades.current.browShade, browAlpha);
              canvasCtx.fill();
            }
          });
        }

        // Contour
        const drawContour = (p1Idx: number, p2Idx: number, rotationOffset: number) => {
          if (landmarks[p1Idx] && landmarks[p2Idx]) {
            const x1 = landmarks[p1Idx].x * width;
            const y1 = landmarks[p1Idx].y * height;
            const x2 = landmarks[p2Idx].x * width;
            const y2 = landmarks[p2Idx].y * height;
            const cx = (x1 + x2) / 2;
            const cy = (y1 + y2) / 2 + 20;
            const angle = Math.atan2(y2 - y1, x2 - x1) - rotationOffset;

            canvasCtx.save();
            canvasCtx.translate(cx, cy);
            canvasCtx.rotate(angle);
            canvasCtx.beginPath();
            canvasCtx.ellipse(0, 0, 40, 20, 0, 0, 2 * Math.PI);
            canvasCtx.fillStyle = hexToRGBA(latestShades.current.contourShade, 0.05);
            canvasCtx.fill();
            canvasCtx.restore();
          }
        };
        drawContour(234, 132, 0.3);
        drawContour(454, 361, -0.3);

        // Foundation
        const faceOutline = [
          10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
          397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150,
          136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109,
        ];

        canvasCtx.beginPath();
        if (landmarks[faceOutline[0]]) {
          faceOutline.forEach((idx, i) => {
            const pt = landmarks[idx];
            const x = pt.x * width;
            const y = pt.y * height;
            if (i === 0) {
              canvasCtx.moveTo(x, y);
            } else {
              canvasCtx.lineTo(x, y);
            }
          });
          canvasCtx.closePath();
          canvasCtx.fillStyle = hexToRGBA(latestShades.current.foundationShade, 0.09);
          canvasCtx.fill();
        }
      }
      canvasCtx.restore();
    });

    const camera = new Camera(videoElement, {
      onFrame: async () => {
        await faceMesh.send({ image: videoElement });
      },
      width: 640,
      height: 480,
    });
    camera.start();

    faceMeshInstance.current = faceMesh;
    cameraInstance.current = camera;

    return () => {
      // Component unmount handles standard DOM cleanup
    };
  }, [scriptsLoaded]);

  return (
    <div className="relative w-full max-w-[640px] aspect-[4/3] rounded-xl overflow-hidden bg-warm-900">
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/face_mesh.js"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, faceMesh: true }))}
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js"
        onLoad={() => setScriptsLoaded(prev => ({ ...prev, camera: true }))}
      />
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover hidden"
        autoPlay
        muted
        playsInline
      />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-full h-full object-cover"
        width={640}
        height={480}
      />
      {(!scriptsLoaded.faceMesh || !scriptsLoaded.camera) && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-warm-900/80 backdrop-blur-sm gap-3">
          <Loader2 className="w-6 h-6 text-white animate-spin" strokeWidth={1.5} />
          <p className="text-white/70 text-sm tracking-wide">
            Loading AR Module
          </p>
        </div>
      )}
    </div>
  );
});

ARCamera.displayName = 'ARCamera';

export default ARCamera;
