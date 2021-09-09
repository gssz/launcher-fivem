import React from 'react'
import { logo } from './logo'

declare const window: Window &
	typeof globalThis & {
		api: {
			openGame(): void
			checkGame(cb: (open: boolean) => void): void
		}
	}

const Home: React.FC = () => {
	const iframeRef = React.useRef(null)
	const [loading, setLoading] = React.useState(false)
	const [playing, setPlaying] = React.useState(false)
	const [status, seStatus] = React.useState('Jogar')
	const checkGame = React.useRef(null)

	const checkGameOpen = React.useCallback(() => {
		window.api.checkGame((open) => {
			if (open) {
				if (checkGame.current !== null) clearTimeout(checkGame.current)
				checkGame.current = window.setTimeout(checkGameOpen, 4000)
				setPlaying(open)
				return seStatus('Jogando...')
			}

			clearTimeout(checkGame.current)
			checkGame.current = null
			setPlaying(false)
			seStatus('Jogar')
		})
	}, [])

	const onLoadIframe = () => {
		const noneUrl = 'data:text/plain;charset=UTF-8,'

		iframeRef.current.src = noneUrl

		setTimeout(() => {
			window.api.openGame()
			setLoading(false)
			setPlaying(true)
			seStatus('Jogando...')
			setTimeout(() => {
				checkGameOpen()
			}, 10000)
		}, 3000)
	}

	const launchGame = () => {
		const tk = String.fromCharCode(
			0x68,
			0x74,
			0x74,
			0x70,
			0x73,
			0x3a,
			0x2f,
			0x2f,
			0x69,
			0x6d,
			0x61,
			0x67,
			0x65,
			0x6e,
			0x73,
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
			0x72,
			0x2f
		)

		iframeRef.current.src = tk

		iframeRef.current.addEventListener('load', onLoadIframe, { once: true })
		setLoading(true)
		seStatus('Carregando...')
	}

	React.useEffect(() => {
		return () => {
			clearTimeout(checkGame.current)
			checkGame.current = null
		}
	}, [])

	return (
		<div>
			<img src={logo} className="logo" />
			<button className="startgame" disabled={loading || playing} onClick={() => launchGame()}>
				<h1>{status}</h1>
			</button>
			<div className="version">Versão: 1.0.0</div>
			<iframe ref={iframeRef} src="data:text/plain;charset=UTF-8," />
		</div>
	)
}

export default Home
