let imgPlace = document.querySelector('.img-place');
let imgChooseInp = document.getElementById('imgChooseInp');
let imgPlaceHead = document.getElementById('imgPlaceHead');
let img = document.getElementById('choosenImage');
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let widthInput = document.getElementById('widthInput');
let heightInput = document.getElementById('heightInput');
let cropBtn = document.getElementById('crop-btn');
let imgWidthInput = document.getElementById('image-widthInput');
let imgHeightInput = document.getElementById('image-heightInput');
let resizeBtn = document.getElementById('resize-btn');
let imgCropper = document.querySelector('.img-cropper');
let imgLoader = document.querySelector('.col-lg-8');
let clearBtn = document.getElementById('clear-btn');
let mirrorBtn = document.getElementById('mirror-btn');
let rotateLeftBtn = document.getElementById('rotateL-btn');
let rotateRightBtn = document.getElementById('rotateR-btn');
let resetRotateBtn = document.getElementById('reset-rotate-btn');
let isImageLoaded = false;
let isImageMirrored = false;
let cropParameters = document.querySelector('.crop-parameters');
let imageResizers = document.querySelector('.image-resizers');
let imageParameters = document.querySelector('.image-parameters');

img.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = img.width;
    canvas.height = img.height;
    // resize image
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

    canvas.classList.remove('mirrorImage');
    canvas.style.display = 'inline';
    imgPlace.style.border = 'none';
    isImageLoaded = true;
}

imgChooseInp.addEventListener('change', () => {

    imgPlaceHead.classList.add('d-none');
    imgCropper.classList.remove('d-none');
    cropParameters.classList.remove('d-none');
    canvas.style.transform = "rotate(0deg)";
    imgPlace.style.marginTop = 10 + 'px';
    resetRotateBtn.classList.add('d-none');
    imageResizers.classList.remove('d-none');
    rotateLeftBtn.classList.remove('d-none');
    rotateRightBtn.classList.remove('d-none');
    mirrorBtn.classList.remove('d-none');
    
    mirrorBtn.innerHTML = "Mirror effect";
    canvas.classList.remove('mirrorImage');

    if (imgChooseInp.files && imgChooseInp.files[0]) {

        let reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
            imgChooseInp.value = null;
        }

        reader.readAsDataURL(imgChooseInp.files[0]);
        imgPlace.classList.add('resizable-image');
        makeResizableImg('.resizable-image');

        resizeBtn.addEventListener('click', () => {
            if (imgWidthInput.value && imgWidthInput.value <= imgLoader.offsetWidth) {
                imgPlace.style.width = imgWidthInput.value + 'px';
                imgWidthInput.setAttribute('placeholder', `${imgPlace.offsetWidth}px`);
            } else if(imgWidthInput.value === "" && imgHeightInput.value === "") {
                alert("Please enter width value to resize the image");
            } else if(imgWidthInput.value === "" && imgHeightInput.value !== "") {
                // nothing to do
            } else {
                imgWidthInput.setAttribute('placeholder', `${imgPlace.offsetWidth - 17}px, max=863`);
                alert("You have entered an image width value that is larger than the allowed value.");
            }
            if (imgHeightInput.value && imgHeightInput.value <= imgLoader.offsetHeight) {
                imgPlace.style.height = imgHeightInput.value + 'px';
                imgHeightInput.setAttribute('placeholder', `${imgPlace.offsetHeight}px`);
            } else if(imgWidthInput.value === "" && imgHeightInput.value === "") {
                alert("Please enter height value to resize the image");
            } else if(imgWidthInput.value !== "" && imgHeightInput.value === "") {
                // nothing to do
            } else {
                imgHeightInput.setAttribute('placeholder', `${imgPlace.offsetHeight}px, max=602`);
                alert("You have entered an image height value that is larger than the allowed value.");
            }

            imgWidthInput.value = ''; 
            imgHeightInput.value = '';
        });
    }
})

resizeBtn.addEventListener('click', () => {
    if (!isImageLoaded) {
        alert("Please upload an image");
    }
})

// cropper width

widthInput.addEventListener('change', () => {
    if (imgCropper.offsetLeft + parseInt(widthInput.value) <= imgPlace.offsetLeft + imgPlace.offsetWidth - 15) {
        imgCropper.style.width = widthInput.value + 'px'; 
        widthInput.setAttribute('placeholder', `${imgCropper.offsetWidth}px`);
        widthInput.value = '';
    } else {
        imgCropper.style.width = imgCropper.offsetWidth + 'px';
        alert("The crop width you entered is out of bounds on the image. Enter a new value for the cropper width");
        widthInput.value = '';
        widthInput.setAttribute('placeholder', `${imgCropper.offsetWidth}px`);
    }
});

// cropper height

heightInput.addEventListener('change', () => {
    if (imgCropper.offsetTop + parseInt(heightInput.value) <= imgPlace.offsetTop + imgPlace.offsetHeight - 13) {
        imgCropper.style.height = heightInput.value + 'px'; 
        heightInput.setAttribute('placeholder', `${imgCropper.offsetHeight}px`);
        heightInput.value = '';
    } else {
        imgCropper.style.height = imgCropper.offsetHeight + 'px';
        alert("The crop height you entered is out of bounds on the image. Enter a new value for the cropper height");
        heightInput.value = '';
        heightInput.setAttribute('placeholder', `${imgCropper.offsetHeight}px`);
    }
});


cropBtn.addEventListener('click', () => {
    // clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    canvas.style.display = 'none';
    // crop image
    let correctionX = img.width / imgPlace.offsetWidth;
    let correctionY = img.height / imgPlace.offsetHeight;
    let left = parseInt((canvas.width / 2) - (imgCropper.offsetWidth * correctionX / 2));
    let top = parseInt((canvas.height / 2) - (imgCropper.offsetHeight * correctionY / 2));
    let width = imgCropper.offsetWidth * correctionX;
    let height = imgCropper.offsetHeight * correctionY;
    ctx.drawImage(img,
        imgCropper.offsetLeft * correctionX, imgCropper.offsetTop * correctionY, imgCropper.offsetWidth * correctionX, imgCropper.offsetHeight * correctionY,
        left, top, width, height);

    
    if (isImageLoaded) {
        img.style.display = 'none';
        canvas.style.display = 'inline';
        imgCropper.classList.add('d-none');
        cropParameters.classList.add('d-none');
        rotateLeftBtn.classList.add('d-none');
        rotateRightBtn.classList.add('d-none');
        mirrorBtn.classList.add('d-none');
    } else {
        alert("Please upload an image");
    }
    
})

// moving imgCropper

let isCropperMoving = false;
imgCropper.addEventListener('mousedown', imgCropper_MouseDownEvent);
imgCropper.addEventListener('mouseup', imgCropper_MouseUpEvent);
imgCropper.addEventListener('mouseleave', imgCropper_MouseUpEvent);
imgCropper.addEventListener('mousemove', imgCropper_MouseMoveEvent);

let x, y = null;

function imgCropper_MouseDownEvent(e) {
    isCropperMoving = true;

    imgCropper.classList.add('moving');

    x = e.clientX - imgCropper.offsetLeft;
    y = e.clientY - imgCropper.offsetTop;
    return;
}

function imgCropper_MouseUpEvent(e) {
    if (!isCropperMoving) {
        return;
    }

    isCropperMoving = false;
    imgCropper.classList.remove('moving');
}

function imgCropper_MouseMoveEvent(e) {
    if (!isCropperMoving) {
        return;
    }

    imgCropper.style.left = e.clientX - x + 'px';
    imgCropper.style.top = e.clientY - y + 'px';

    let pRect = imgCropper.parentElement.getBoundingClientRect();
    let tgtRect = imgCropper.getBoundingClientRect();

    if (tgtRect.left < pRect.left) imgCropper.style.left = 0;

    if (tgtRect.top < pRect.top) imgCropper.style.top = 0;

    if (tgtRect.right > pRect.right) imgCropper.style.left = pRect.width - tgtRect.width + 'px';

    if (tgtRect.bottom > pRect.bottom) imgCropper.style.top = pRect.height - tgtRect.height + 'px';
}

// resizable imgCropper

function makeResizableCropper(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + ' .resizer');
    const minimum_size = 20;

    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            original_width = parseFloat(getComputedStyle(element).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(element).getPropertyValue('height').replace('px', ''));
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        })

        function resize(e) {
            isCropperMoving = false;
            if (currentResizer.classList.contains('bottom-right')) {
                const width = original_width + (e.pageX - original_mouse_x);
                const height = original_height + (e.pageY - original_mouse_y);
                if (width > minimum_size && e.pageX <= (imgPlace.offsetWidth)) {
                    element.style.width = width + 'px';
                }
                if (height > minimum_size && e.pageY <= imgPlace.offsetHeight) {
                    element.style.height = height + 'px';
                }
            } else if (currentResizer.classList.contains('bottom-left')) {
                const height = original_height + (e.pageY - original_mouse_y);
                const width = original_width - (e.pageX - original_mouse_x);
                if (height > minimum_size && e.pageY <= imgPlace.offsetHeight) {
                    element.style.height = height + 'px';
                }
                if (width > minimum_size && e.pageX >= imgPlace.offsetLeft) {
                    element.style.width = width + 'px';
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                }
            } else if (currentResizer.classList.contains('top-right')) {
                const width = original_width + (e.pageX - original_mouse_x);
                const height = original_height - (e.pageY - original_mouse_y);
                if (width > minimum_size && e.pageX <= imgPlace.offsetWidth) {
                    element.style.width = width + 'px';
                }
                if (height > minimum_size && e.pageY >= imgPlace.offsetTop) {
                    element.style.height = height + 'px';
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                }
            } else {
                const width = original_width - (e.pageX - original_mouse_x);
                const height = original_height - (e.pageY - original_mouse_y);
                if (width > minimum_size && e.pageX >= imgPlace.offsetLeft) {
                    element.style.width = width + 'px';
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                }
                if (height > minimum_size && e.pageY >= imgPlace.offsetTop) {
                    element.style.height = height + 'px';
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                }
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
            widthInput.setAttribute('placeholder', `${imgCropper.offsetWidth}px`);
            widthInput.value = '';
            heightInput.setAttribute('placeholder', `${imgCropper.offsetHeight}px`);
            heightInput.value = '';
        }
    }
}

makeResizableCropper('.resizable');

// resizable image

function makeResizableImg(div) {
    const element = document.querySelector(div);
    const resizers = document.querySelectorAll(div + ' .image-resizer');
    const minimum_size = 20;
    let original_width = 0;
    let original_height = 0;
    let original_x = 0;
    let original_y = 0;
    let original_mouse_x = 0;
    let original_mouse_y = 0;
    for (let i = 0; i < resizers.length; i++) {
        const currentResizer = resizers[i];
        currentResizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            original_width = parseFloat(getComputedStyle(element).getPropertyValue('width').replace('px', ''));
            original_height = parseFloat(getComputedStyle(element).getPropertyValue('height').replace('px', ''));
            original_x = element.getBoundingClientRect().left;
            original_y = element.getBoundingClientRect().top;
            original_mouse_x = e.pageX;
            original_mouse_y = e.pageY;
            window.addEventListener('mousemove', resize);
            window.addEventListener('mouseup', stopResize);
        })

        function resize(e) {
            isCropperMoving = false;
            if (currentResizer.classList.contains('image-bottom-right')) {
                const width = original_width + (e.pageX - original_mouse_x);
                const height = original_height + (e.pageY - original_mouse_y);
                if (width > minimum_size && width <= imgLoader.offsetWidth) {
                    element.style.width = width + 'px';
                }
                if (height > minimum_size && height <= imgLoader.offsetHeight) {
                    element.style.height = height + 'px';
                }
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
            imgWidthInput.setAttribute('placeholder', `${imgPlace.offsetWidth}px`);
            imgHeightInput.setAttribute('placeholder', `${imgPlace.offsetHeight}px`);
        }
    }
}

// mirror image
mirrorBtn.addEventListener('click', () => {
    if (!isImageLoaded) {
        alert("Please upload an image");
    } else {
        canvas.classList.add('mirrorImage');
        cropParameters.classList.toggle('d-none');
        imgCropper.classList.toggle('d-none');
        isImageMirrored = !isImageMirrored;
    }

    if (isImageMirrored) {
        mirrorBtn.innerHTML = "Reset mirror effect";
    } else {
        mirrorBtn.innerHTML = "Mirror effect";
        canvas.classList.remove('mirrorImage');
    }
});

let rotateMemory = 0;

// rotate image left&right
rotateLeftBtn.addEventListener('click', () => {

    if (!isImageLoaded) {
        alert("Please upload an image");
    } else {
        rotateMemory -= 90;
        imgPlace.style.marginTop = 10 + 'px';
        canvas.style.transform = `rotate(${rotateMemory}deg)`;

        if(rotateMemory / 180 !== 1 && rotateMemory / 180 !== -1 &&
            rotateMemory / 180 !== 2 && rotateMemory / 180 !== -2 && rotateMemory !== 0) {
            imgPlace.style.marginTop = 150 + 'px';
        } else {
            if(rotateMemory / 180 === 2 || rotateMemory / 180 === -2) {
                rotateMemory = 0;
            }
            imgPlace.style.marginTop = 10 + 'px';
        }
        
        cropParameters.classList.add('d-none');
        imageParameters.classList.add('d-none');
        imgCropper.classList.add('d-none');
        imageResizers.classList.add('d-none');
        resetRotateBtn.classList.remove('d-none');
        mirrorBtn.setAttribute('disabled', 'disabled');
    }
});

rotateRightBtn.addEventListener('click', () => {

    if (!isImageLoaded) {
        alert("Please upload an image");
    } else {
        rotateMemory += 90; 
        imgPlace.style.marginTop = 10 + 'px';
        canvas.style.transform = `rotate(${rotateMemory}deg)`;
        
        if(rotateMemory / 180 !== 1 && rotateMemory / 180 !== -1 &&
            rotateMemory / 180 !== 2 && rotateMemory / 180 !== -2 && rotateMemory !== 0) {
            imgPlace.style.marginTop = 150 + 'px';
        } else {
            if(rotateMemory / 180 === 2 || rotateMemory / 180 === -2) {
                rotateMemory = 0;
            }
            imgPlace.style.marginTop = 10 + 'px';
        }
        
        cropParameters.classList.add('d-none');
        imageParameters.classList.add('d-none');
        imgCropper.classList.add('d-none');
        imageResizers.classList.add('d-none');
        resetRotateBtn.classList.remove('d-none');
        mirrorBtn.setAttribute('disabled', 'disabled');
    }
});

// reset rotation settings
resetRotateBtn.addEventListener('click', () => {
    rotateMemory = 0;
    canvas.style.transform = `rotate(${rotateMemory}deg)`;
    cropParameters.classList.remove('d-none');
    imageParameters.classList.remove('d-none');
    imgCropper.classList.remove('d-none');
    imageResizers.classList.remove('d-none');
    resetRotateBtn.classList.add('d-none');
    imgPlace.style.marginTop = 10 + 'px';
    mirrorBtn.removeAttribute('disabled', 'disabled');
});
