import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Chat from './components/Chat.tsx'

const queryClient = new QueryClient()

function App() {
	return (
		<QueryClientProvider client={queryClient}>
			<Chat />
		</QueryClientProvider>
	)
}

export default App
