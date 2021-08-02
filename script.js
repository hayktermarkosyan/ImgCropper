let imgPlace = document.querySelector('.img-place');
let imgChooseInp = document.getElementById('imgChooseInp');
let imgPlaceHead = document.getElementById('imgPlaceHead');
let img = document.getElementById('choosenImage');
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');
let widthInput = document.getElementById('widthInput');
let heightInput = document.getElementById('heightInput');
let cropBtn = document.getElementById('crop-btn');

let imgCropper = document.querySelector('.img-cropper')



img.onload = function() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.width = img.width;
    canvas.height = img.height;
    // resize image
    ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);

    canvas.style.display = 'inline';
    imgPlace.style.border = 'none';
}

imgChooseInp.addEventListener('change', () => {
    imgPlaceHead.classList.add('d-none');
    imgCropper.classList.remove('d-none');

    if (imgChooseInp.files && imgChooseInp.files[0]) {

        let reader = new FileReader();
        reader.onload = function(e) {
            img.src = e.target.result;
        }

        reader.readAsDataURL(imgChooseInp.files[0]);
    }
})

widthInput.addEventListener('change', () => {
    imgCropper.style.width = widthInput.value + 'px';
});

heightInput.addEventListener('change', () => {
    imgCropper.style.height = heightInput.value + 'px';
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

    img.style.display = 'none';
    canvas.style.display = 'inline';
    imgCropper.style.display = 'none';
})



// mouse movement

let isCropperMoving = false;
imgCropper.addEventListener('mousedown', imgCropper_MouseDownEvent);
imgCropper.addEventListener('mouseup', imgCropper_MouseUpEvent);
imgCropper.addEventListener('mouseleave', imgCropper_MouseUpEvent);
imgCropper.addEventListener('mousemove', imgCropper_MouseMoveEvent);

function imgCropper_MouseDownEvent(e) {
    isCropperMoving = true;
    imgCropper.classList.add('moving');
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

    moveImgCropper(e);
}

function moveImgCropper(e) {
    let x = imgCropper.offsetLeft + e.movementX;
    let y = imgCropper.offsetTop + e.movementY;

    imgCropper.style.left = `${x}px`;
    imgCropper.style.top = `${y}px`;
}


// resizable imgCropper

function makeResizableDiv(div) {
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
                if (width > minimum_size) {
                    element.style.width = width + 'px';
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                }
            } else if (currentResizer.classList.contains('bottom-left')) {
                const height = original_height + (e.pageY - original_mouse_y);
                const width = original_width - (e.pageX - original_mouse_x);
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                }
                if (width > minimum_size) {
                    element.style.width = width + 'px';
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                }
            } else if (currentResizer.classList.contains('top-right')) {
                const width = original_width + (e.pageX - original_mouse_x);
                const height = original_height - (e.pageY - original_mouse_y);
                if (width > minimum_size) {
                    element.style.width = width + 'px';
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                }
            } else {
                const width = original_width - (e.pageX - original_mouse_x);
                const height = original_height - (e.pageY - original_mouse_y);
                if (width > minimum_size) {
                    element.style.width = width + 'px';
                    element.style.left = original_x + (e.pageX - original_mouse_x) + 'px';
                }
                if (height > minimum_size) {
                    element.style.height = height + 'px';
                    element.style.top = original_y + (e.pageY - original_mouse_y) + 'px';
                }
            }
        }

        function stopResize() {
            window.removeEventListener('mousemove', resize);
        }
    }
}

makeResizableDiv('.resizable');