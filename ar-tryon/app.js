const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const canvasCtx = canvasElement.getContext('2d');
const shadePicker = document.getElementById('shadePicker');

const faceMesh = new FaceMesh({
  locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`
});
faceMesh.setOptions({
  selfieMode: true,
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});

faceMesh.onResults(onResults);

// webcam feed
const camera = new Camera(videoElement, {
  onFrame: async () => {
    await faceMesh.send({image: videoElement});
  },
  width: 640,
  height: 480
});
camera.start();

function onResults(results) {
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    const landmarks = results.multiFaceLandmarks[0];

    const upperLipIndices = [61, 185, 40, 39, 37, 0, 267, 269, 270, 409, 291];
    const lowerLipIndices = [61, 146, 91, 181, 84, 17, 314, 405, 321, 375, 291];

    const lipPoints = [...upperLipIndices, ...lowerLipIndices].map(
      index => ({
        x: landmarks[index].x * canvasElement.width,
        y: landmarks[index].y * canvasElement.height
      })
    );

    canvasCtx.beginPath();
    canvasCtx.moveTo(lipPoints[0].x, lipPoints[0].y);
    for (const pt of lipPoints) {
      canvasCtx.lineTo(pt.x, pt.y);
    }
    canvasCtx.closePath();
    canvasCtx.fillStyle = hexToRGBA(shadePicker.value, 0.5);
    canvasCtx.fill();
  }
  canvasCtx.restore();
}


function hexToRGBA(hex, alpha) {
  let r = parseInt(hex.slice(1,3),16);
  let g = parseInt(hex.slice(3,5),16);
  let b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}
