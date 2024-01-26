
const axios = require('axios');
const fs = require('fs');
const path = require('path');

let imageUrls=[
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/resize.jpeg.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Patrick-Murphy.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Jennifer-Rocha.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Link-Jarrett.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Kelsey-Stewart.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Mike-White.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Stephanie-Best.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Barry-Batson.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Allan-Dykstra.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Lorie-Coleman.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Sami-Fagan.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Ruben-Felix.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Kundy-Gutierrez.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Rob-Crews.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Joe-Shovald.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Courtney-Miller.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Frank-Griffin.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Amber-Patton.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Troy-Canaba.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Melvin-Jenkins.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Megan-Willis.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Angel-Santiago.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Mike-Larabee.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Troy-Nakamura.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Roger-Frash.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Mik-Aoki.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Jay-Miller.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Mike-Candrea.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Cindy-Bristow.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Marty-Smith.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Kevin-Fagan.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Wayne-Yancey.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Crystl-Bustos.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Weekly.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Tim-Walton.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Jason-Romano.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Russ-Canzler.png.webp",
    "https://cdn.shopify.com/s/files/1/0676/4000/0753/files/Nathan-Samson.png.webp"
]

async function downloadAndSaveImage(url) {
    try {
        const response = await axios({
            method: 'get',
            url: url,
            responseType: 'stream',
        });

        // Extract the filename from the URL using the path module
        const filename = path.basename(new URL(url).pathname);

        const imagePath = path.join(__dirname, 'images', filename);

        response.data.pipe(fs.createWriteStream(imagePath));

        return new Promise((resolve, reject) => {
            response.data.on('end', () => resolve(imagePath));
            response.data.on('error', (err) => reject(err));
        });
    } catch (error) {
        console.error(`Error downloading image from ${url}: ${error.message}`);
    }
}

async function saveImages() {
    const imageDirectory = path.join(__dirname, 'images');

    // Create the images directory if it doesn't exist
    if (!fs.existsSync(imageDirectory)) {
        fs.mkdirSync(imageDirectory);
    }

    for (let i = 0; i < imageUrls.length; i++) {
        const imageUrl = imageUrls[i];

        try {
            const imagePath = await downloadAndSaveImage(imageUrl);
            console.log(`Image saved successfully: ${imagePath}`);
        } catch (error) {
            console.error(`Error saving image from ${imageUrl}: ${error.message}`);
        }
    }

    console.log('Download and save process completed.');
}

saveImages();
