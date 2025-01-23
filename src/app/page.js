import CameraFeed from './components/CameraFeed';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-6">
      <h1 className="text-3xl font-bold mb-6">Camera Calibration Website</h1>
      <CameraFeed />
    </div>
  );
}