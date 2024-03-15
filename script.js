document.addEventListener("DOMContentLoaded", () => {
    const rootElement = document.documentElement;
  
    updateLanes();
  
    function updateLanes() {
      const widthInput = document.querySelector("#width");
      const inputValue = widthInput.value || localStorage.getItem("width");
      rootElement.style.setProperty(
        "--lanes",
        Math.floor(parseFloat(inputValue) / 95)
      );
      localStorage.setItem("width", inputValue);
    }
  
    // price calculation on basis of area per sq. meter
    document.querySelector("#width").addEventListener("input", updateLanes);
  
    const widthInput = document.querySelector("#width");
    const heightInput = document.querySelector("#height");
  
    let cartPrice = 0;
  
    widthInput.addEventListener("input", calculateArea);
    heightInput.addEventListener("input", calculateArea);
  
    calculateArea();
  
    function getDollar() {
      const priceElement = document.querySelector(".price.price--large");
      const priceText = priceElement.textContent
        .trim()
        .replace(/Sale price/i, "")
        .trim();
      const matchResult = priceText.match(/(^[^\d]+)(\d+)/);
      return matchResult[1];
    }
  
    function calculateArea() {
      const pricePerMeter = document
        .querySelector("#cropOverlay")
        .getAttribute("data-price");
  
      console.log("pricePerMeter", pricePerMeter);
  
      const width = parseFloat(widthInput.value)
        ? parseFloat(widthInput.value)
        : parseFloat(localStorage.getItem("width"));
      const height = parseFloat(heightInput.value)
        ? parseFloat(heightInput.value)
        : parseFloat(localStorage.getItem("height"));
  
      if (widthInput.value < 20) {
        document.querySelector(".width-alert").textContent =
          "Width is too small.";
      } else if (widthInput.value > 5000) {
        document.querySelector(".width-alert").textContent = "Width is too big.";
      } else {
        document.querySelector(".width-alert").textContent = "";
      }
  
      if (heightInput.value < 20) {
        document.querySelector(".height-alert").textContent =
          "Height is too small.";
      } else if (heightInput.value > 5000) {
        document.querySelector(".height-alert").textContent =
          "Height is too big.";
      } else {
        document.querySelector(".height-alert").textContent = "";
      }
  
      if (heightInput.value == "") {
        document.querySelector(".height-alert").textContent = "";
      }
      if (widthInput.value == "") {
        document.querySelector(".width-alert").textContent = "";
      }
  
      const area = (width * height) / 10000;
  
      const price = (area * pricePerMeter) / 100;
  
      if (price > pricePerMeter / 100) {
        document.querySelector(".totalprice").innerHTML =
          getDollar() + parseFloat(price).toFixed(2);
        // addtocart(Math.floor(price));
  
        cartPrice = Math.floor(price);
      } else {
        document.querySelector(".totalprice").innerHTML =
          getDollar() + pricePerMeter / 100;
        // addtocart(Math.floor(pricePerMeter / 100));
        cartPrice = Math.floor(pricePerMeter / 100);
      }
  
      // console.log("Area:", area + " sq. meter and Price :", price );
    }
    // end of price calculations
  
    //upsell product add to cart
    function upsellProducts() {
      let upsell = [];
      document.querySelectorAll(".upsell_product").forEach(function (element) {
        if (element.checked) {
          let id = element.parentElement.getAttribute("data-productid");
  
          if (element.parentElement.querySelector(".upSell-qty").value != "") {
            let quantity =
              element.parentElement.querySelector(".upSell-qty").value;
            upsell.push({ id, quantity });
          }
        }
      });
      return upsell;
    }
    // end of upsell product add to cart
  
    async function lineItemProperties() {
      let width = document.querySelector("#width").value;
      let height = document.querySelector("#height").value;
      let noLanes = Math.round(parseFloat(width / 83)) - 1;
  
      let flip = document.querySelector("#flipX").checked;
      let mirror = document.querySelector("#flipy").checked;
      let grayScale = document.querySelector("#BLACKANDWHITE").checked;
  
      var radioButtons = document.querySelectorAll(".numbering");
      var selectedValue;
      radioButtons.forEach(function (radioButton) {
        if (radioButton.checked) {
          selectedValue = radioButton.value;
        }
      });
      let imageUrl = await getImageUrl();
      console.log("hello bibiek", imageUrl);
      return {
        Width: width,
        Height: height,
        "No. of Lanes": noLanes || 0,
        "Flip your photo(Horizontal)": flip ? "Yes" : "No",
        "Mirror your photot(Vertical)": mirror ? "Yes" : "No",
        "GreyScale Image": grayScale ? "Yes" : "No",
        Numbering: selectedValue,
        Image: imageUrl,
      };
    }
  
    async function getImageUrl() {
      let returnedImage = returnImage();
      // console.log(returnedImage);
      const response = await fetch(
        "https://apps.cartmade.com/bibek-test-folder/behang/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: "data=" + encodeURIComponent(returnedImage),
        }
      );
      const responseText = await response.text();
  
      return responseText;
  
      // .then(response => response.text())
      // .then(url => {
      //     // document.getElementById('result').innerHTML = '<strong>Image URL:</strong> <a href="' + url + '" target="_blank">' + url + '</a>';
      //   console.log("url",url)
      //   return url;
      // })
      // .catch(error => {
      //     // document.getElementById('result').innerText = 'Error uploading image.';
      //     console.error('Error:', error);
      // });
    }
  
    function showLoadingSpinner(button) {
      // Disable the button, add a loading spinner, and update cursor
      button.disabled = true;
      button.style.cursor = "wait";
      // button.innerHTML = '<span class="loading-spinner"></span> Loading...';
      button.innerHTML =
        '<span class="loading-spinner"></span> <svg version="1.1" id="loader-1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="40px" height="40px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"> <path fill="#000" d="M43.935,25.145c0-10.318-8.364-18.683-18.683-18.683c-10.318,0-18.683,8.365-18.683,18.683h4.068c0-8.071,6.543-14.615,14.615-14.615c8.072,0,14.615,6.543,14.615,14.615H43.935z"> <animateTransform attributeType="xml" attributeName="transform" type="rotate" from="0 25 25" to="360 25 25" dur="0.6s" repeatCount="indefinite"/> </path> </svg>';
    }
  
    function hideLoadingSpinner(button) {
      // Enable the button, remove the loading spinner, and reset cursor
      button.disabled = false;
      button.style.cursor = "pointer";
      button.innerHTML = "Add to Cart";
    }
    console.log("cartprice", cartPrice);
  
    document.querySelector("#addtocart").addEventListener("click", async (e) => {
      e.preventDefault();
      addtocart(cartPrice);
      async function addtocart(cartPrice) {
        // e.target.disabled = true
        // e.target.style.pointer="not-allowed"
  
        showLoadingSpinner(e.target);
  
        let upsellArray = upsellProducts();
  
        let properties = await lineItemProperties();
        // console.log("properties", properties);
  
        const productId = document
          .querySelector("#cropOverlay")
          .getAttribute("data-cartPrice");
  
        var cartdata = {
          id: productId,
          quantity: cartPrice,
          properties: properties,
        };
  
        upsellArray.push(cartdata);
        console.log(upsellArray);
  
        let formData = {
          items: upsellArray,
        };
        console.log(formData);
        // return;
        fetch("/cart/add.js", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        })
          .then((response) => {
            console.log("success:", response);
            hideLoadingSpinner(e.target);
            window.location.href = "/cart";
            // closeOverlay();
            // document.querySelector('#cart_drawer').click()
          })
          .catch((error) => {
            console.error("Error:", error);
          });
      }
    });
  });
  