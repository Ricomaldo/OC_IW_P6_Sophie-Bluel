const http = require('http');
const app = require('./app');

const port = 5678;
app.set('port', port);

const server = http.createServer(app);

server.on('error', error => {
	if (error.syscall !== 'listen') {
		throw error;
	}
	const bind = typeof port === 'string' ? 'pipe ' + port : 'port ' + port;
	switch (error.code) {
		case 'EACCES':
			console.error(bind + ' requires elevated privileges');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use - exiting process');
			process.exit(1);
			break;
		default:
			throw error;
	}
});

server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? 'pipe ' + address : 'port ' + port;
	console.log('Listening on ' + bind);
});

server.listen(port, () => {
	console.log(`Server attempting to listen on port ${port}`);
});

