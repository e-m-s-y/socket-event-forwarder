const pkg = require('../package.json');
const si = require('systeminformation');

exports.plugin = {
	pkg: pkg,
	defaults: require('./defaults.json'),
	alias: pkg.name,
	async register(container, options) {
		const logger = container.resolvePlugin('logger');
		const eventEmitter = container.resolvePlugin('event-emitter');
		const blockchain = container.resolvePlugin('blockchain');
		const database = container.resolvePlugin('database');
		const socketio = require('socket.io')(options.port);

		if(options.events.length) {
			for(let event of options.events) {
				eventEmitter.on(event, async(data) => {
					if(data && data.generatorPublicKey) {
						data.username = await database.walletManager
							.findByPublicKey(data.generatorPublicKey)
							.getAttribute('delegate.username');
					}

					socketio.emit(event, data);
					logger.info(`[${this.alias}] Forwarded event ${event}`);
				});
			}
		}

		if(options.customEvents.includes('systeminformation')) {
			setInterval(async() => {
				const packet = await si.get({
					mem: '*',
					currentLoad: '*',
					cpuTemperature: '*',
					osInfo: 'platform, release',
					cpu: 'speed, cores, speedmin, speedmax, processors, physicalCores',
				});

				packet.fs = [];

				for(let disk of await si.fsSize()) {
					packet.fs.push({
						use: disk.use,
						size: disk.size,
						used: disk.used,
					});
				}

				socketio.emit('systeminformation', packet);
				logger.info(`[${this.alias}] Forwarded event systeminformation`);
			}, options.systeminformationInterval);
		}

		if(options.customEvents.includes('network.latency')) {
			setInterval(async() => {
				socketio.emit('network.latency', await si.inetChecksite('https://google.com'));
				logger.info(`[${this.alias}] Forwarded event network.latency`);
			}, options.networkLatencyInterval);
		}

		if(options.customEvents.includes('blockheight.current')) {
			setInterval(async() => {
				const lastBlock = await blockchain.getLastBlock();

				socketio.emit('blockheight.current', lastBlock ? lastBlock.data.height : 0);
				logger.info(`[${this.alias}] Forwarded event blockheight.current`);
			}, options.blockheightCurrentInterval);
		}

		if(options.customEvents.includes('transaction.confirmed') && options.confirmations.length) {
			const transactions = [];

			eventEmitter.on('transaction.forged', async transaction => {
				transaction.confirmations = 0;

				if(transaction.senderPublicKey) {
					transaction.senderId = await database.walletManager
						.findByPublicKey(transaction.senderPublicKey)
						.address;
				}

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


