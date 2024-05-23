export type Message = {
	id: string
	text: string
}

export type FetchedMessages = {
	data: Message[]
}

export type SentMessage = Pick<Message, 'text'>
