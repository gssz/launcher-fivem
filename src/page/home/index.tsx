import React from 'react'
import { logo } from './logo'

declare const window: Window &
	typeof globalThis & {
		api: {
			openGame(): void
		}
	}

const Home: React.FC = () => {
	const iframeRef = React.useRef(null)
	const [loading, setLoading] = React.useState(false)

	const onLoadIframe = () => {
		const noneUrl = 'data:text/plain;charset=UTF-8,'

		iframeRef.current.src = noneUrl

		window.api.openGame()
		setLoading(false)
	}

	const launchGame = () => {
		const preload = 'https://imagens.mzgtarp.com.br/'

		iframeRef.current.src = preload

		iframeRef.current.addEventListener('load', onLoadIframe, { once: true })
		setLoading(true)
	}

	return (
		<div>
			<img src={logo} className="logo" />
			<button onClick={() => launchGame()} className="button">
				<h1>{loading ? 'Carregando...' : 'Jogar'}</h1>
			</button>
			<iframe ref={iframeRef} src="data:text/plain;charset=UTF-8," />
		</div>
	)
}

export default Home
