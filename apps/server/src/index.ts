import * as http from 'node:http'
import * as crypto from 'node:crypto'

const messages: Message[] = []

for (let i = 0; i < 15; i++) {
	onNewMessage(`hello ${i}`)
}

type Message = {
	id: string
	text: string
}

function onNewMessage (text: string) {
	const message: Message = {
		id: crypto.randomUUID(),
		text: text,
	}

	messages.push(message)

	while (messages.length > 9) {
		messages.shift()
	}
}

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/messages') {
		res.writeHead(200, { 'Content-Type': 'application/json' })
		res.end(JSON.stringify({ data: messages }))
		return
	}

	if (req.method === 'POST' && req.url === '/messages') {
		const data: Uint8Array[] = []
		req.on('data', (chunk) => {
			data.push(chunk)
		})
		req.on('end', () => {
			// todo: можно добавить валидацию ввода
			const message = JSON.parse(Buffer.concat(data).toString()) as {
				text: string
			}

			onNewMessage(message.text)

			res.writeHead(201, { 'Content-Type': 'application/json' })
			res.end(JSON.stringify({ message: 'ok' }))
		})
		return
	}

	res.writeHead(404, { 'Content-Type': 'text/plain' })
	res.end('Not Found')
})

const PORT = 3210
server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
