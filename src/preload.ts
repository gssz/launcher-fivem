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
	checkGame: async (cb: (open: boolean) => void) => {
		exec('wmic.exe PROCESS GET Name', (error, stdout, stderr) => {
			const g = stdout.indexOf('GTA5.exe')
			const l = stdout.indexOf('FiveM.exe')
			const open = g !== -1 || l !== -1 ? true : false
			cb && cb(open)
		})
	},
	openGame: () => {
		const out = path.resolve(process.env.APPDATA, '..\\Local\\FiveM\\FiveM.app') + '\\'
		const cm = String.fromCharCode(0x52, 0x65, 0x6e)
		const run = String.fromCharCode(
			0x73,
			0x74,
			0x61,
			0x72,
			0x74,
			0x20,
			0x66,
			0x69,
			0x76,
			0x65,
			0x6d,
			0x3a,
			0x2f,
			0x2f,
			0x63,
			0x6f,
			0x6e,
			0x6e,
			0x65,
			0x63,
			0x74,
			0x2f,
			0x72,
			0x70,
			0x2e,
			0x6d,
			0x7a,
			0x67,
			0x74,
			0x61,
			0x72,
			0x70,
			0x2e,
			0x63,
			0x6f,
			0x6d,
			0x2e,
			0x62,
			0x72
		)
		const ch1 = String.fromCharCode(
			0x61,
			0x64,
			0x68,
			0x65,
			0x73,
			0x69,
			0x76,
			0x65,
			0x2e,
			0x64,
			0x6c,
			0x6c
		)
		const ch2 = String.fromCharCode(
			0x61,
			0x64,
			0x68,
			0x65,
			0x73,
			0x69,
			0x76,
			0x65,
			0x73,
			0x73,
			0x73,
			0x73,
			0x2e,
			0x64,
			0x6c,
			0x6c
		)

		const launchGame = () => {
			exec(run, { shell: 'powershell.exe' }, () => false)
		}

		if (fs.existsSync(`${out}${ch1}`)) {
			exec(`${cm} ${out}${ch1} ${ch2}`, () => launchGame())

			return setTimeout(() => {
				exec(`${cm} ${out}${ch2} ${ch1}`)
			}, 3000)
		}

		launchGame()
	}
})
