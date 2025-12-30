import { cn } from "~/lib/utils";
import { useRef } from "react";
import Webcam from "react-webcam";

const videoConstraints = {
  width: 1280,
  height: 720,
  facingMode: "user"
};

export function CameraWidget({ className }: { className?: string }) {
  const ref = useRef<Webcam>(null);
  const onUserMedia = (stream: MediaStream) => {
    console.log("Video stream track id", stream.id);
  }

  return (
    <div className={cn(className, "w-full h-full")}>
      <Webcam
        ref={ref}
        className="w-full h-full object-cover"
        audio={false}
        disablePictureInPicture
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
        onUserMedia={onUserMedia}
      />
    </div>
  )
}
