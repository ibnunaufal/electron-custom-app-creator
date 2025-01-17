const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
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

ipcMain.on('select-multiple-files', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile', 'multiSelections'],
    filters: [
      { name: 'JSON Files', extensions: ['json'] }
    ]
  });
  event.reply('multiple-files-selected', result.filePaths);
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

ipcMain.on('select-directory', async (event) => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });
  event.reply('directory-selected', result.filePaths[0]);
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