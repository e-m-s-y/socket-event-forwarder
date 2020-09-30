const pkg = require('../package.json');
const si = require('systeminformation');

exports.plugin = {
	pkg: pkg,
	defaults: require('./defaults.json'),
	alias: pkg.name,
	async register(container, options) {
		const logger = container.resolvePlugin('logger');
		const eventEmitter = container.resolvePlugin('event-emitter');
		const socketio = require('socket.io')(options.port);

		if(options.events.length) {
			for(let event of options.events) {
				eventEmitter.on(event, async(data) => {
					socketio.emit(event, data);
					logger.info(`[${this.alias}] Forwarded event ${event}`);
				});
			}
		}

		if(options.customEvents.includes('relay.systeminformation')) {
			setInterval(async() => {
				const packet = {
					fs: [],
					cpu: {},
					memory: await si.mem(),
					load: await si.currentLoad(),
					cpuTemperature: await si.cpuTemperature(),
				};

				for(let disk of await si.fsSize()) {
					packet.fs.push({
						use: disk.use,
						size: disk.size,
						used: disk.used,
					});
				}

				const cpu = await si.cpu();

				packet.cpu.speed = cpu.speed;
				packet.cpu.cores = cpu.cores;
				packet.cpu.speedmin = cpu.speedmin;
				packet.cpu.speedmax = cpu.speedmax;
				packet.cpu.processors = cpu.processors;
				packet.cpu.physicalCores = cpu.physicalCores;

				socketio.emit('relay.systeminformation', packet);
				logger.info(`[${this.alias}] Forwarded event relay.systeminformation`);
			}, options.systeminformationInterval);
		}

		if(options.customEvents.includes('transaction.confirmed') && options.confirmations.length) {
			const transactions = [];

			eventEmitter.on('transaction.forged', transaction => {
				transaction.confirmations = 0;

				transactions.push(transaction);
			});

			eventEmitter.on('block.forged', () => {
				for(const [index, transaction] of transactions.entries()) {
					transaction.confirmations += 1;

					if(options.confirmations.includes(transaction.confirmations)) {
						socketio.emit('transaction.confirmed', transaction);
						logger.info(`[${this.alias}] Forwarded event transaction.confirmed`);
					}

					if(transaction.confirmations >= Math.max(...options.confirmations)) {
						transactions.splice(index, 1);
						logger.info(`[${this.alias}] Removed transaction since the max confirmations is reached.`);
					}
				}
			});
		}
	}
};


