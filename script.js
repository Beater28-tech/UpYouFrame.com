const photoInput = document.getElementById('photoInput');
const frameInput = document.getElementById('frameInput');
const previewImage = document.getElementById('previewImage');
const cropBtn = document.getElementById('cropBtn');
const downloadBtn = document.getElementById('downloadBtn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const statusText = document.getElementById('status');

let cropper;
let frameImage = null;

// Upload user photo
photoInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    previewImage.src = URL.createObjectURL(file);
    previewImage.style.display = 'block';

    previewImage.onload = () => {
      if (cropper) cropper.destroy();
      cropper = new Cropper(previewImage, {
        aspectRatio: 1,
        viewMode: 1,
        movable: true,
        cropBoxResizable: true
      });
    };

    cropBtn.style.display = 'inline-block';
    statusText.textContent = 'Step 2: Upload your frame and crop your image.';
  }
});

// Upload frame image
frameInput.addEventListener('change', function () {
  const file = this.files[0];
  if (file) {
    const img = new Image();
    img.onload = () => {
      frameImage = img;
      statusText.textContent = '✅ Frame uploaded!';
    };
    img.src = URL.createObjectURL(file);
  }
});

// Crop and merge
cropBtn.addEventListener('click', function () {
  if (!cropper || !frameImage) {
    alert('Please upload both photo and frame.');
    return;
  }

  const croppedCanvas = cropper.getCroppedCanvas({
    width: 800,
    height: 800,
  });

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(croppedCanvas, 0, 0, canvas.width, canvas.height);
  ctx.drawImage(frameImage, 0, 0, canvas.width, canvas.height);

  canvas.style.display = 'block';
  downloadBtn.style.display = 'inline-block';
  statusText.textContent = '✅ Ready to download!';
});

// Download final image
downloadBtn.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'framed-photo.png';
  link.href = canvas.toDataURL('image/png');
  link.click();
});