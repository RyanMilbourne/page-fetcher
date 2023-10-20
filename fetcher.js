const inputs = process.argv.slice(2)

const url = inputs[0];
const filePath = inputs[1];

const request = require('request');
const fs = require('fs');
const readline = require('readline');

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

  if (fs.existsSync(filePath, body)) {
    // create a readline interface if the filePath already exists
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    })

    // ask user if they want to overwrite or not
    rl.question(`The filepath "${filePath}" already exists❗ Overwrite, y/n `, (answer) => {
      // process if 'y' is chosen
      if (answer === 'y' || answer === 'Y') {
        console.log("overwriting file...");
        fs.writeFile(filePath, body, err => {
          fs.stat(filePath, (err, stats) => {
            if (err) {
              console.error(err);
            } else {
              const fileSizeInBytes = stats.size;
              console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}`);
            }
          });
        });
      } else {
        // process if 'n' is chosen
        console.log(`The filepath "${filePath}" not overwritten`);
      }
      // close readline interface
      rl.close();
    });
  } else {
    // create file if filePath is open
    fs.writeFile(filePath, body, err => {
      fs.stat(filePath, (err, stats) => {
        if (err) {
          console.error(err);
        } else {
          const fileSizeInBytes = stats.size;
          console.log(`Downloaded and saved ${fileSizeInBytes} bytes to ${filePath}`);
        }
      });
    })
  }
});