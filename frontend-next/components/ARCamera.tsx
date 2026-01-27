'use client';

import React, { useEffect, useRef } from 'react';
import { FaceMesh } from '@mediapipe/face_mesh';
import { Camera } from '@mediapipe/camera_utils';

interface ARCameraProps {
  lipShade: string;
  cheekShade: string;
  browShade: string;
  browProductType: string;
  contourShade: string;
  foundationShade: string;
}

export default function ARCamera({
  lipShade,
  cheekShade,
  browShade,
  browProductType,
  contourShade,
  foundationShade,
}: ARCameraProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;
    if (!videoElement || !canvasElement) return;

    const canvasCtx = canvasElement.getContext('2d');
    if (!canvasCtx) return;

    const faceMesh = new FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });

    faceMesh.setOptions({
      selfieMode: true,
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    faceMesh.onResults((results) => {
      canvasCtx.save();
      canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
      // canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);
      // We don't need to draw the image if the video is behind it, but usually we do to sync.
      // However, to keep it simple and match standard overlay style, drawing the image is safer.
      canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

      if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
        const landmarks = results.multiFaceLandmarks[0];
        const width = canvasElement.width;
        const height = canvasElement.height;

        // Helper to convert hex to rgba
        const hexToRGBA = (hex: string, alpha: number) => {
          if (hex === 'transparent') return 'transparent';
          let r = parseInt(hex.slice(1, 3), 16);
          let g = parseInt(hex.slice(3, 5), 16);
          let b = parseInt(hex.slice(5, 7), 16);
          return `rgba(${r},${g},${b},${alpha})`;
        };

        // --- LIPS ---
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
            canvasCtx.fillStyle = hexToRGBA(lipShade, 0.25);
            canvasCtx.fill();
        }

        // --- CHEEKS ---
        const drawCheek = (idx: number) => {
            const pt = landmarks[idx];
            if(pt) {
                const x = pt.x * width;
                const y = pt.y * height - 10;
                canvasCtx.beginPath();
                canvasCtx.ellipse(x, y, 30, 20, 0, 0, 2 * Math.PI);
                canvasCtx.fillStyle = hexToRGBA(cheekShade, 0.045);
                canvasCtx.fill();
            }
        }
        drawCheek(205); // Left
        drawCheek(425); // Right

        // --- BROWS ---
        if (browShade !== 'transparent') {
            const browAlpha = browProductType.includes("Pencil") ? 0.3 : 0.2;
            const leftBrow = [70, 63, 105, 66, 107, 55];
            const rightBrow = [336, 296, 334, 293, 300, 285];

            [leftBrow, rightBrow].forEach(brow => {
                canvasCtx.beginPath();
                if(landmarks[brow[0]]) {
                    canvasCtx.moveTo(landmarks[brow[0]].x * width, landmarks[brow[0]].y * height);
                    brow.forEach(idx => {
                        const pt = landmarks[idx];
                        canvasCtx.lineTo(pt.x * width, pt.y * height);
                    });
                    canvasCtx.closePath();
                    canvasCtx.fillStyle = hexToRGBA(browShade, browAlpha);
                    canvasCtx.fill();
                }
            });
        }

        // --- CONTOUR ---
         // Helper function to draw rotated ellipse
         const drawContour = (p1_idx: number, p2_idx: number, rotationOffset: number) => {
            if (landmarks[p1_idx] && landmarks[p2_idx]) {
                const x1 = landmarks[p1_idx].x * width;
                const y1 = landmarks[p1_idx].y * height;
                const x2 = landmarks[p2_idx].x * width;
                const y2 = landmarks[p2_idx].y * height;
                const cx = (x1 + x2) / 2;
                const cy = (y1 + y2) / 2 + 20;
                const angle = Math.atan2(y2 - y1, x2 - x1) - rotationOffset;
                
                canvasCtx.save();
                canvasCtx.translate(cx, cy);
                canvasCtx.rotate(angle);
                canvasCtx.beginPath();
                canvasCtx.ellipse(0, 0, 40, 20, 0, 0, 2 * Math.PI);
                canvasCtx.fillStyle = hexToRGBA(contourShade, 0.05);
                canvasCtx.fill();
                canvasCtx.restore();
            }
        };
        drawContour(234, 132, 0.3); // Left Side
        drawContour(454, 361, -0.3); // Right Side (Fixed angle sign)

        // --- FOUNDATION ---
        const faceOutline = [
          10, 338, 297, 332, 284, 251, 389, 356, 454, 323, 361, 288,
          397, 365, 379, 378, 400, 377, 152, 148, 176, 149, 150,
          136, 172, 58, 132, 93, 234, 127, 162, 21, 54, 103, 67, 109
        ];
        
        canvasCtx.beginPath();
        if(landmarks[faceOutline[0]]) {
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
            canvasCtx.fillStyle = hexToRGBA(foundationShade, 0.09);
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

    return () => {
        // Cleanup if needed, though camera.stop() isn't always exposed cleanly
    };
  }, [lipShade, cheekShade, browShade, browProductType, contourShade, foundationShade]);

  return (
    <div className="relative w-full max-w-[640px] aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-black">
      <video
        ref={videoRef}
        className="absolute top-0 left-0 w-full h-full object-cover hidden" // Hidden because drawn to canvas
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
    </div>
  );
}
