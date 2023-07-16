// In this file we'll include the main logic of our project related to electron.js. Click cmd + option + I to get access to Chrome Developer Tools.

// const path = require("path");
// const os = require("os");
// const fs = require("fs");
// const resizeImg = require('resize-img');
// const { app, BrowserWindow, Menu, ipcMain, shell } = require("electron");


// //  Checking if the OS is Mac or not.
// const isMac = process.platform === 'darwin';

// const isDev = process.env.NODE_ENV !== 'production';

// let mainWindow;

// // Creating the Main Window.
// function createMainWindow() {
//      mainWindow = new BrowserWindow ({
//         title: 'Image Resizer',
//         width: isDev ? 1000 : 500,
//         height: 600,  
//         webPreferences: { // Doing all of this from the preload.js
//             contextIsolation: true,
//             nodeIntegration: true, 
//             preload: path.join(__dirname, 'preload.js')
//         },
//     });

//     // Open Dev Tools id in Dev env. Used for easily opening Dev Tools directly.
//     if(isDev){
//         mainWindow.webContents.openDevTools();
//     }

//     mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
// }


// // Create about window.
// function createAboutWindow() {
//     const aboutWindow = new BrowserWindow ({
//         title: 'About Image Resizer',
//         width: 300,
//         height: 300,  
//     });


//     aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
// }


// // App is ready.
// app.whenReady().then(() =>{
//     createMainWindow();

//     // Implementing the Menu.
//     const mainMenu = Menu.buildFromTemplate(menu);
//     Menu.setApplicationMenu(mainMenu);

//     // Remove mainWindow from memory on close.
//     mainWindow.on('closed', () => (mainWindow = null));

//     app.on('activate', () =>{
//         if(BrowserWindow.getAllWindows().length === 0){
//             createMainWindow()
//         }
//     })
// });


// // Menu Template.
// const menu = [
//     ...(isMac 
//         ? 
//         [
//            {
//         label: app.name,
//         submenu: [
//         {    
//             label: 'About',
//             click: createAboutWindow,
//            },    
//         ],
//     },
//     ] 
// : []),

//     {
//                         // label: 'File',
//                         // submenu: [
//                         //     {
//         role: 'fileName',                //         label: 'Quit',
//                         //         click: () => app.quit(),
//                         //         accelerator: 'CmdOrCtrl+W' // Used for defining keyboard shortcuts.
//                         //     }
//                         // ]
//     },
//     ...(!isMac ? [{
//         label: 'Help',
//         submenu: [{
//             label: 'About',
//             click: createAboutWindow,
//         },
//       ], 
//     },
// ] : []),
// ];


// // Respond to ipcRenderer resize.
// ipcMain.on('image:resize', (e, options) =>{
//     options.dest = path.join(os.homedir(), 'iamgeresizer');
//     resizeImage(options);
// });


// // Resize the Image
// async function resizeImage({imgPath, width, height, dest}) {
//     try {
//         const newPath = await resizeImg(fs.readFileSync(imgPath), {
//             width: +width,
//             height: +height
//         });

//         // Create filename
//         const filename = path.basename(imgPath);

//         // Create destination (dest) folder if it doesn't exist
//         if(!fs.existsSync(dest)) {
//             fs.mkdirSync(dest);
//         }

//         // Write the file to dest (i.e destination).
//         fs.writeFileSync(path.join(dest, filename), newPath);
//         // Send success to render.
//         mainWindow.webContents.send('image:done');
//         // Open dest folder.
//         shell.openPath(dest);

//     } catch (error) {
//         console.log(error);
//     }
// }

// // It contains the after processes of quiting the App as macOS takes time to do so.
// app.on('window-all-closed', () =>{ 
//     if(!isMac){
//         app.quit();
//     }
// });

const path = require('path');
const os = require('os');
const fs = require('fs');
const resizeImg = require('resize-img');
const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron');

const isDev = process.env.NODE_ENV !== 'production';
const isMac = process.platform === 'darwin';

let mainWindow;
let aboutWindow;

// Main Window
function createMainWindow() {
  mainWindow = new BrowserWindow({
    width: isDev ? 1000 : 500,
    height: 600,
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
    resizable: isDev,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Show devtools automatically if in development
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }

    // mainWindow.loadURL(`file://${__dirname}/renderer/index.html`);
   mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
}

// About Window
function createAboutWindow() {
  aboutWindow = new BrowserWindow({
    width: 300,
    height: 300,
    title: 'About Electron',
    icon: `${__dirname}/assets/icons/Icon_256x256.png`,
  });

   aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
}

// When the app is ready, create the window
app.on('ready', () => {
  createMainWindow();

  const mainMenu = Menu.buildFromTemplate(menu);
  Menu.setApplicationMenu(mainMenu);

  // Remove variable from memory
  mainWindow.on('closed', () => (mainWindow = null));
});

// Menu template
const menu = [
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  {
    role: 'fileMenu',
  },
  ...(!isMac
    ? [
        {
          label: 'Help',
          submenu: [
            {
              label: 'About',
              click: createAboutWindow,
            },
          ],
        },
      ]
    : []),
  // {
  //   label: 'File',
  //   submenu: [
  //     {
  //       label: 'Quit',
  //       click: () => app.quit(),
  //       accelerator: 'CmdOrCtrl+W',
  //     },
  //   ],
  // },
  ...(isDev
    ? [
        {
          label: 'Developer',
          submenu: [
            { role: 'reload' },
            { role: 'forcereload' },
            { type: 'separator' },
            { role: 'toggledevtools' },
          ],
        },
      ]
    : []),
];

// Respond to the resize image event
ipcMain.on('image:resize', (e, options) => {
  // console.log(options);
  options.dest = path.join(os.homedir(), 'imageresizer');
  resizeImage(options);
});

// Resize and save image
async function resizeImage({ imgPath, height, width, dest }) {
  try {
    // console.log(imgPath, height, width, dest);

    // Resize image
    const newPath = await resizeImg(fs.readFileSync(imgPath), {
      width: +width,
      height: +height,
    });

    // Get filename
    const filename = path.basename(imgPath);

    // Create destination folder if it doesn't exist
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest);
    }

    // Write the file to the destination folder
    fs.writeFileSync(path.join(dest, filename), newPath);

    // Send success to renderer
    mainWindow.webContents.send('image:done');

    // Open the folder in the file explorer
    shell.openPath(dest);
  } catch (err) {
    console.log(err);
  }
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  if (!isMac) app.quit();
});

// Open a window if none are open (macOS)
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});