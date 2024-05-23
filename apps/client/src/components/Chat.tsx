import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import type { FetchedMessages } from '../../../../types.ts'
import Input from './Input.tsx'

async function getMessages() {
	const res = await fetch('/messages')
	const { data } = (await res.json()) as FetchedMessages

	return data
}

function Chat(props: {
	lastMessageId?: string
}) {
	const { isPending, isError, data, error, refetch } = useQuery({
		queryKey: ['messages'],
		queryFn: getMessages,
	})

	useEffect(() => {
		refetch()
	}, [props.lastMessageId, refetch])

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
