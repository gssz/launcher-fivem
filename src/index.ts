import { app, BrowserWindow, protocol } from 'electron'

protocol.registerSchemesAsPrivileged([{ scheme: 'https', privileges: { bypassCSP: true } }])

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

if (require('electron-squirrel-startup')) {
	// eslint-disable-line global-require
	app.quit()
}

const createWindow = (): void => {
	const mainWindow = new BrowserWindow({
		width: 600,
		minWidth: 600,
		height: 400,
		minHeight: 400,
		autoHideMenuBar: true,
		show: false,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			nativeWindowOpen: true
		}
	})

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)

	mainWindow.once('ready-to-show', () => {
		mainWindow.show()
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
})
