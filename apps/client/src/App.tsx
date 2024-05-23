import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import Chat from './components/Chat.tsx'

const queryClient = new QueryClient()

function App() {
	const [lastMessageId, setLastMessageId] = useState<string | undefined>(
		undefined,
	)

	useEffect(() => {
		const webSocket = new WebSocket('/ws')

		webSocket.addEventListener('open', () => {
			console.log('websocket open')
		})

		webSocket.addEventListener('message', (event) => {
			const data = JSON.parse(event.data)

			if (data.hasOwnProperty('lastMessageId')) {
				setLastMessageId(data.lastMessageId)
			}
		})

		// todo: можно добавить переподключение, если что-то сбилось
		webSocket.addEventListener('error', (event) => {
			console.log('websocket error', event)
		})

		return () => {
			console.log('websocket close')
			webSocket.close()
		}
	}, [])

	return (
		<QueryClientProvider client={queryClient}>
			<Chat lastMessageId={lastMessageId} />
		</QueryClientProvider>
	)
}

export default App
