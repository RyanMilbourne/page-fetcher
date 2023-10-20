const inputs = process.argv.slice(2)

const url = inputs[0];
const filePath = inputs[1];

const request = require('request');
const fs = require('fs');

request(url, (error, response, body, size) => {
  // if error occurs, print error
  if (error) {
    console.log('error:', error);
  }

  // exit function if status code is 400+
  if (response && response.statusCode > 400) {
    console.log(`Error. Status code: ${response.statusCode}`)
    return;
  }

  // write file based on inputed file path
  fs.writeFile(filePath, body, err => {
    // if error, log error
    if (err) {
      console.log(err);
    }

    // collect file information for return
    fs.stat(filePath, (err, stats) => {
      if (err) {
        console.error(err);
      }
      const fileSizeInBytes = stats.size;
      console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}`);
    });
  })
});



