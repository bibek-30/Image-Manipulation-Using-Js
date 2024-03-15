
let currentPage = 1;
const totalPages = document.getElementsByClassName("page").length;

function openOverlay() {
  document.getElementById("cropOverlay").style.cssText = "opacity: 1; visibility: visible; z-index:999;";
  document.body.classList.add('cropper-overflow');
  showPage(currentPage);
  updateButtons();
}


function closeOverlay() {
  document.getElementById("cropOverlay").style.display = "none";
  document.body.classList.remove('cropper-overflow');
}

function showPage(pageNumber) {
  const pages = document.getElementsByClassName("page");
  for (let i = 0; i < pages.length; i++) {
    pages[i].style.display = "none";
  }

  document.getElementById(`page${pageNumber}`).style.display = "block";
  document.getElementById("currentPage").textContent = pageNumber;
  updateButtons();
}

function nextPage() {
  if (currentPage < totalPages) {
    currentPage++;
    showPage(currentPage);
  }
  if (currentPage == totalPages ){
    document.querySelector('#nextBtn').style.display ="none";
    document.querySelector('#addtocart').style.display ="flex";
  } 
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    showPage(currentPage);
  }
   if (currentPage != totalPages ){
    document.querySelector('#nextBtn').style.display ="flex";
    document.querySelector('#addtocart').style.display ="none";
  } 
}

function updateButtons() {
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled =
    currentPage === totalPages;
}


var cropper;


var image = document.querySelector("#image");
var widthInput = document.querySelector("#width");
var heightInput = document.querySelector("#height");
var flipButton = document.querySelector("#flipX");
var mirrirButton = document.querySelector("#flipy");


  var zoomRangeInput = document.querySelector("#zoomRange");
   var prevZoomValue = parseFloat(zoomRangeInput.value);

  // Add an event listener for the zoom range input
  zoomRangeInput.addEventListener("input", function () {
    var currentZoomValue = parseFloat(zoomRangeInput.value);
    var zoomDifference = currentZoomValue - prevZoomValue;
    localStorage.setItem("zoom", zoomRangeInput.value);
    

    // Zoom in or out based on the difference in values
    if (zoomDifference > 0) {
      cropper.zoom(0.1); // Zoom in by 0.1
    } else if (zoomDifference < 0) {
      cropper.zoom(-0.1); // Zoom out by 0.1
    }

    if(zoomRangeInput.value == 0.1){
      console.log('default zoom');
       cropper.zoomTo(0.1);
    }

    // Update the previous value
    prevZoomValue = currentZoomValue;
  });

  // Add an event listener for the flip button
  flipButton.addEventListener("click", function () {
    toggleFlip();
  });

  mirrirButton.addEventListener("click", function () {
    toggleMirrir();
  });




  // Function to update aspect ratio based on input values
  function updateAspectRatio() {
    var aspectRatioValue = widthInput.value
      ? widthInput.value
      : localStorage.getItem("width");
    aspectRatioValue /= heightInput.value
      ? heightInput.value
      : localStorage.getItem("height");
    cropper.setAspectRatio(aspectRatioValue);

    // Update values in local storage
    localStorage.setItem("width", widthInput.value);
    localStorage.setItem("height", heightInput.value);
  }
  // Add event listeners to update aspect ratio when width or height changes
  widthInput.addEventListener("input", updateAspectRatio);
  heightInput.addEventListener("input", updateAspectRatio);


    // Function to toggle between horizontal and vertical flipping
  function toggleFlip() {
    var currentScaleX = cropper.getData().scaleX;
    // Toggle between horizontal and vertical flipping
    cropper.scaleX(currentScaleX === 1 ? -1 : 1);
  }

  function toggleMirrir() {
    var currentScaleY = cropper.getData().scaleY;

    // Toggle between horizontal and vertical flipping
    cropper.scaleY(currentScaleY === 1 ? -1 : 1);
  }


  
  var scrollableDiv = document.querySelector('.manipulated-images');
  var zoomRangeInput = document.querySelector("#zoomRange");

  scrollableDiv.onmousewheel = function (event) {
    // Cross-browser wheel delta
    var delta = event.wheelDelta || -event.deltaY || -event.detail;

    // Get the current zoom value from the input
    var currentZoomValue = parseFloat(zoomRangeInput.value);

    if (delta < 0) {
      console.log('Scrolling Down');
      if (currentZoomValue > 0) {
        cropper.zoom(-0.1);
        zoomRangeInput.value = (currentZoomValue - 0.1).toFixed(1);
        zoomRangeInput.dispatchEvent(new Event('change'))
        zoomRangeInput.dispatchEvent(new Event('input'))
      }
      
    } else {
      console.log('Scrolling Up');
      // Your code for scrolling upward
      
      if (currentZoomValue < 1) {
        cropper.zoom(0.1);
        zoomRangeInput.value = (currentZoomValue + 0.1).toFixed(1);
        zoomRangeInput.dispatchEvent(new Event('change'))
        zoomRangeInput.dispatchEvent(new Event('input'))
      }
    }

    // Prevent default scrolling behavior
    event.preventDefault();
  };

  var greyScale = document.querySelector('#BLACKANDWHITE');

  var grayscaleEnabled = false;
  
  document.querySelector('.manipulated-images').style.filter = "grayScale(0)";

  // Add an event listener to the checkbox
  greyScale.addEventListener('change', function () {
      // Update the grayscaleEnabled variable based on the checkbox state
    grayscaleEnabled = greyScale.checked;
    
    if(greyScale.checked == true) {
      document.querySelector('.manipulated-images').style.filter = "grayScale(1)";
    }else{
        document.querySelector('.manipulated-images').style.filter = "grayScale(0)";
    }
    
  });




function returnImage(){

  try {
    
    var croppedCanvas = cropper.getCroppedCanvas();

    var imageDataUrl;

    if (grayscaleEnabled) {
      var blackAndWhiteCanvas = document.createElement("canvas");
      var bwContext = blackAndWhiteCanvas.getContext("2d");

      blackAndWhiteCanvas.width = croppedCanvas.width;
      blackAndWhiteCanvas.height = croppedCanvas.height;

      bwContext.drawImage(
        croppedCanvas,
        0,
        0,
        croppedCanvas.width,
        croppedCanvas.height
      );

      var imageData = bwContext.getImageData(
        0,
        0,
        blackAndWhiteCanvas.width,
        blackAndWhiteCanvas.height
      );
      var data = imageData.data;

      for (var i = 0; i < data.length; i += 4) {
        var grayscale =
          data[i] * 0.3 + data[i + 1] * 0.59 + data[i + 2] * 0.11;

        data[i] = grayscale;
        data[i + 1] = grayscale;
        data[i + 2] = grayscale;
      }

      bwContext.putImageData(imageData, 0, 0);
      imageDataUrl = blackAndWhiteCanvas.toDataURL("image/jpeg");
        // document.querySelector('.croppedImage').setAttribute("src",imageDataUrl)
    } else {
      imageDataUrl = croppedCanvas.toDataURL("image/jpeg");
        // document.querySelector('.croppedImage').setAttribute("src",imageDataUrl)
    }
    return imageDataUrl;
    
  } catch (error) {
    console.error("Error processing image:", error);
  }
  return false;
}

var getCroppedImageButton = document.querySelector("#addtocart");
getCroppedImageButton.addEventListener("click", function () {

});
function cropperFun() {
// Set values from local storage to the input fields during page load
widthInput.value = localStorage.getItem("width") || "";
heightInput.value = localStorage.getItem("height") || "";

// Destroy existing Cropper instance
if (cropper) {
  cropper.destroy();
}

// Recreate Cropper instance
cropper = new Cropper(image, {
  dragMode: "move",
  aspectRatio: widthInput.value / heightInput.value,
  autoCropArea: 1,
  restore: true,
  guides: false,
  center: true,
  highlight: false,
  cropBoxMovable: false,
  cropBoxResizable: false,
  toggleDragModeOnDblclick: false,
  zoomOnWheel: false,
  zoomOnTouch: false,
  movable: true,
  viewMode: 1,
  scaleX: 1,
  scaleY: 1,
});
}

window.addEventListener('resize', function(event) {
// console.log("resetting the cropeer");
cropper.clear();
cropperFun();
$('#zoomRange').val(0.1)
zoomRangeInput.dispatchEvent(new Event('change'))
zoomRangeInput.dispatchEvent(new Event('input'))
});
cropperFun();
