const { app, BrowserWindow, ipcMain } = require('electron')
const ipp = require('ipp-printer');
const fs = require('fs');
const gs = require('ghostscript4js')
 


//Configuring Printer
const options = {
    name: 'Virtual Printer',
    port: 6311, // Choose a port for your virtual printer
};

// const printer = await ipp.Printer.create(options);
const printer = new ipp(options);

//On printing
printer.on('job', async function(job) {
    console.log('Received a print job:', job.uri);

    const currentDate = new Date();
    console.log('Current Date:', currentDate);
    const formattedDate = currentDate.toISOString().replace(/:/g, '-').replace(/\.\d{3}/, '');
    console.log('Formatted Date:', formattedDate);

    const filePath = `Documents/printed_document_${formattedDate}.ps`;
    const writeStream = fs.createWriteStream(filePath);
    job.pipe(writeStream);

    
    
    job.on('end', () => {

      try {
        
        const inputFile = filePath;  // Replace with the actual path to your PS file
        const outputFile = 'Documents/output.pdf'; // Replace with the desired output file name
        
        // Construct the Ghostscript command for PS to PDF conversion
        const command = `-sDEVICE=pdfwrite -o ${outputFile} ${inputFile}`;
        
        gs.executeSync(command);
        
        console.log(`Conversion completed. Output PDF saved as ${outputFile}`);
      } catch (err) {
        console.error('Error:', err);
      }
      
        console.log('Print job completed:', job.id);
        console.log(`Printed document saved as ${filePath}`);
    });

    job.on('error', (error) => {
        console.error('Error processing print job:', error);
    });

    writeStream.on('error', (error) => {
        console.error('Error writing to file:', error);
    });
});

console.log('Virtual printer running on port', options.port);


// //Creating window
function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
      width: 800,
      height: 600,
      webPreferences: {
          nodeIntegration: true,
          contextIsolation: false,
      }
  });

  // Load the index.html of the app.
  win.loadFile('src/index.html');

  // Open the DevTools.
  win.webContents.openDevTools();

  return win; // Return the created BrowserWindow instance
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
// This method is equivalent to 'app.on('ready', function())'
// app.whenReady().then(createWindow)


app.whenReady().then(() => {

  printer.on('job', (job) => {
    const mainWindow = createWindow();
    console.log("Window up!");
  });
  
  // Listen for messages from renderer process
  ipcMain.on('message-from-renderer', (event, data) => {
      console.log('Received data from renderer:', data);
  });

  ipcMain.on('submit-form', (event, data) => {
    console.log('Received mobile number:', data);
    // mainWindow.close();
  });
});



  
// Quit when all windows are closed.
// app.on('window-all-closed', () => {
//   // On macOS it is common for applications and their menu bar
//   // to stay active until the user quits explicitly with Cmd + Q
//   if (process.platform !== 'darwin') {
//     app.quit()
//   }
// })
  
// app.on('activate', () => {
//     // On macOS it's common to re-create a window in the 
//     // app when the dock icon is clicked and there are no 
//     // other windows open.
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow()
//   }
// })




