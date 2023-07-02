import React, { useState, useEffect } from "react";
import Cropper from "react-easy-crop";
import Button from "@material-ui/core/Button";
import Slider from "@material-ui/core/Slider";

export default function Image() {
  const inputRef = React.useRef();
  const [image, setImage] = useState(null);
  const [croppedArea, setCroppedArea] = useState(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);

  const triggerFileSelectPopup = () => inputRef.current.click();

  const onCropComplete = (croppedAreaPercentage, croppedAreaPixels) => {
    console.log(croppedAreaPercentage, croppedAreaPixels);
    setCroppedArea(croppedAreaPixels);
  };

  const onSelectFile = (even) => {
    if (even.target.files && even.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(even.target.files[0]);
      reader.addEventListener("load", () => {
        console.log(reader.result);
        setImage(reader.result);
      });
    }
  };

  const onDownload = () => {};

  return (
    <div className="container">
      <div className="cropperContainer">
        <Cropper
          image={image}
          crop={crop}
          zoom={zoom}
          aspect={1}
          width={width}
          height={height}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
        />
        <Slider />
      </div>
      <div className="buttonContainer">
        <input
          type="file"
          accept="image/*"
          ref={inputRef}
          onChange={onSelectFile}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={triggerFileSelectPopup}
        >
          Choose
        </Button>
        <Button variant="contained" color="secondary" onClick={onDownload}>
          Download
        </Button>
      </div>
    </div>
  );
}
