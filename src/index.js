exports.plugin = {
	pkg: require('../package.json'),
	defaults: require('./defaults.json'),
	alias: 'e-m-s-y:socket-event-forwarder',
	io: undefined,
	async register(container, options) {
		const logger = container.resolvePlugin('logger');

		if(options.events.length === 0) {
			logger.info(`[${this.alias}] No events given, plugin will be disabled.`);

			return;
		}

		try {
			this.io = require('socket.io')(options.port);

			const eventEmitter = container.resolvePlugin('event-emitter');

			for(let event of options.events) {
				eventEmitter.on(event, async(data) => {
					this.io.emit(event, data);

					logger.info(`[${this.alias}] Forwarded event ${event}.`);
				});
			}
		} catch(error) {
			logger.error(error);

			// Ignore, don't let the relay crash.
		}
	}
};


