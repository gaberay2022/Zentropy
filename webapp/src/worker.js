const canvas = document.getElementById('mycanvas');
const context = canvas.getContext('2d');

const dimensions = { height: canvas.height, width: canvas.width };

const img = new Image();
img.onload = () => {
    context.drawImage(img, 0, 0);

    const imageData =
        canvas.getImageData(0, 0, dimensions.width, dimensions.height);

    worker.postMessage({
            action: "process",
            dimensions,
            buffer: imageData.data.buffer,
        },
        [imageData.data.buffer]
    );
};

