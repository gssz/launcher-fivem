import { ipcRenderer, contextBridge } from 'electron'
import { exec } from 'child_process'
import path from 'path'
import fs from 'fs'

contextBridge.exposeInMainWorld('api', {
	send: (channel: string, data: any) => {
		const validChannels = ['none']
		if (validChannels.includes(channel)) {
			ipcRenderer.send(channel, data)
		}
	},
	receive: (channel: string, func: Function) => {
		const validChannels = ['none']
		if (validChannels.includes(channel)) {
			ipcRenderer.on(channel, (event, ...args) => func(...args))
		}
	},
	openGame: () => {
		const dirFivem = path.resolve(process.env.APPDATA, '..\\Local\\FiveM\\FiveM.app') + '\\'

		if (fs.existsSync(`${dirFivem}adhesive.dll`)) {
			exec(`Ren ${dirFivem}adhesive.dll adhesivessss.dll`)

			setTimeout(() => {
				exec(`Ren ${dirFivem}adhesivessss.dll adhesive.dll`)
			}, 3000)
		}

		exec(
			'start fivem://connect/rp.mzgtarp.com.br',
			{ shell: 'powershell.exe' },
			(error, stdout, stderr) => {
				if (error) {
					console.log(`error: ${error.message}`)
					return
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`)
					return
				}
				console.log(`stdout: ${stdout}`)
			}
		)
	}
})
