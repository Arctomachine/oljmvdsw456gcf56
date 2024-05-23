import * as crypto from 'node:crypto'
import * as http from 'node:http'
import { WebSocket, WebSocketServer } from 'ws'
import type { Message, SentMessage } from '../../../types.ts'

const messages: Message[] = []
const webSocketClients: WebSocket[] = []

function onNewMessage(text: string) {
	const message: Message = {
		id: crypto.randomUUID(),
		text: text,
	}

	messages.push(message)

	while (messages.length > 9) {
		messages.shift()
	}

	for (const ws of webSocketClients) {
		if (ws.readyState === WebSocket.OPEN) {
			ws.send(
				JSON.stringify({
					lastMessageId: message.id,
				}),
			)
		}
	}
}

const server = http.createServer((req, res) => {
	if (req.method === 'GET' && req.url === '/messages') {
		res.writeHead(200, {
			'Content-Type': 'application/json',
		})
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
			const message = JSON.parse(Buffer.concat(data).toString()) as SentMessage

			onNewMessage(message.text)

			res.writeHead(201, {
				'Content-Type': 'application/json',
			})
			res.end(JSON.stringify({ message: 'ok' }))
		})
		return
	}

	res.writeHead(404, { 'Content-Type': 'text/plain' })
	res.end('Not Found')
})

const wss = new WebSocketServer({
	port: 3211,
	path: '/ws',
})

wss.on('connection', function connection(ws) {
	ws.on('error', console.error)

	webSocketClients.push(ws)
})

const PORT = 3210
server.listen(PORT, () => {
	console.log(`Server running at http://localhost:${PORT}/`)
})
