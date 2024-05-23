import { useMutation } from '@tanstack/react-query'
import { type FormEvent, useState } from 'react'

function Input() {
	const [text, setText] = useState('')

	const mutation = useMutation({
		mutationFn: (messageText: string) => {
			return fetch('/messages', {
				method: 'post',
				body: JSON.stringify({ text: messageText.trim() }),
			})
		},
		onMutate: () => {
			setText('')
		},
		onError: (e) => {
			alert(e)
		},
	})

	async function onSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault()
		mutation.mutate(text)
	}

	return (
		<form onSubmit={onSubmit}>
			<input
				type="text"
				value={text}
				onChange={(e) => setText(e.target.value)}
			/>
			<button type="submit" disabled={text.trim().length === 0}>
				Submit
			</button>
		</form>
	)
}

export default Input
