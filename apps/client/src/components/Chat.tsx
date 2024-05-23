import { useQuery } from '@tanstack/react-query'
import Input from './Input.tsx'

async function getMessages() {
	const res = await fetch('http://localhost:3210/messages')
	const { data } = (await res.json()) as {
		data: { id: string; text: string }[]
	}

	return data
}

function Chat() {
	const { isPending, isError, data, error } = useQuery({
		queryKey: ['messages'],
		queryFn: getMessages,
	})

	if (isPending) {
		return <>...</>
	}

	if (isError) {
		return <>{JSON.stringify(error)}</>
	}

	return (
		<div>
			<ul>
				{data.map((message) => (
					<li key={message.id}>{message.text}</li>
				))}
			</ul>
			<Input />
		</div>
	)
}

export default Chat
