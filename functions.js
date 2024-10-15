const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Function to download a single image
async function downloadImage(url, filepath) {
    const writer = fs.createWriteStream(filepath);

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading ${url}: ${error.message}`);
    }
}

// Function to download images sequentially
async function downloadImagesSequentially(fileNamesData, downloadDir) {

    for (let i = 0; i < fileNamesData.length; i++) {    
        const url = "http://192.168.0.100:8080/files/"+fileNamesData[i].trim();
        const getFileName = url.split('/');
        const filename = getFileName[getFileName.length-1];
        const filepath = path.join(downloadDir, filename);

        console.log(`Downloading file ${i + 1} of ${fileNamesData.length}`);
        try {
            await downloadImage(url, filepath);
            console.log(`Downloaded: ${filename}`);
        } catch (error) {
            console.error(`Failed to download file ${getFileName}:`, error);
        }
    }
}

function callDownloadImg(data){// Example usage
    const fileNames = data;
    const downloadDir = "/save/in/dir"; // Directory to save images

    if (!fs.existsSync(downloadDir)) {
        fs.mkdirSync(downloadDir);
    }

    downloadImagesSequentially(fileNames, downloadDir);
}

async function writeData(data) {
    const content = data.toString();
    fs.writeFile('fileNames.txt', content ,err => {
    if (err) {
        console.error(err);
    } else {
        console.log("file written successfully")
    }
    });
  }
  
module.exports={
    callDownloadImg,
    writeData
}