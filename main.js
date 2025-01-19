const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 800,
    fullscreenable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on('select-google-json-file', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ]
  });
  event.reply('google-json-file-selected', result.filePaths[0]);
});

ipcMain.on('select-multi-file', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ]
  });
  event.reply('google-json-file-selected', result.filePaths);
});

ipcMain.on('select-flavor-file', async (event) => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const fileContent = await fs.readFile(filePath, 'utf8');
      
      try {
        // Verify if it's valid JSON
        const jsonContent = JSON.parse(fileContent);
        event.reply('flavor-file-selected', {
          path: filePath,
          content: jsonContent
        });
      } catch (jsonError) {
        event.reply('json-error', 'Invalid JSON file');
      }
    }
  } catch (error) {
    event.reply('json-error', `Error reading file: ${error.message}`);
  }
});

ipcMain.on('select-single-file', async (event) => {
  try {
    const result = await dialog.showOpenDialog({
      properties: ['openFile'],
      filters: [
        { name: 'JSON Files', extensions: ['json'] }
      ]
    });
    
    if (!result.canceled && result.filePaths.length > 0) {
      const filePath = result.filePaths[0];
      const fileContent = await fs.readFile(filePath, 'utf8');
      
      try {
        // Verify if it's valid JSON
        const jsonContent = JSON.parse(fileContent);
        event.reply('single-file-selected', {
          path: filePath,
          content: jsonContent
        });
      } catch (jsonError) {
        event.reply('json-error', 'Invalid JSON file');
      }
    }
  } catch (error) {
    event.reply('json-error', `Error reading file: ${error.message}`);
  }
});

ipcMain.on('select-directory-android-studio', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  event.reply('directory-selected-android-studio', result.filePaths[0]);
  let gradleFile = path.join(result.filePaths[0], 'app/build.gradle');
  let gradleFileContent = await fs.readFile(gradleFile, 'utf8');
  event.reply('build-gradle-content-detected', gradleFileContent);
});

ipcMain.on('select-directory-result', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  event.reply('directory-selected-result', result.filePaths[0]);
});

ipcMain.on('run-script', (event) => {
  exec('sh path/to/your/script.sh', (error, stdout, stderr) => {
    if (error) {
      event.reply('script-output', `Error: ${error.message}`);
      return;
    }
    if (stderr) {
      event.reply('script-output', `stderr: ${stderr}`);
      return;
    }
    event.reply('script-output', `Output: ${stdout}`);
  });
});

ipcMain.on('create-folder', async (event) => {
  try {
    const documentPath = app.getPath('documents');
    // Create the folder in the Documents directory give the name Naufal
    const folderPath = path.join(documentPath, 'Naufal');

    await fs.mkdir(folderPath);
    event.reply('folder-created', 'Folder created successfully');
  } catch (error) {
    event.reply('folder-error', `Error creating folder: ${error.message}`);
  }
});

ipcMain.on('create-file', async (event, data) => {
  try {
    const filePath = path.join(data.path, data.fileName);
    await fs
      .writeFileSync(filePath, data.content, 'utf8');
    event.reply('file-created', 'File created successfully');
  } catch (error) {
    event.reply('file-error', `Error creating file: ${error.message}`);
  }
});

ipcMain.on('coba', async (event) => {
  try {
    let t = localStorage.getItem('test');
    console.log(t);
    // /Users/macbookpro/Downloads/coba
    const filePath = '/Users/macbookpro/Downloads/coba/test.txt';
    await fs.writeFile(filePath, 'Hello World', 'utf8');
  } catch (error) {
    ;
  }
});