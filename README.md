# Socket event forwarder
A plugin for forwarding real-time blockchain events through socket.io.

Supported blockchain events can be found [here.](https://github.com/ArkEcosystem/core/blob/master/packages/core-event-emitter/src/index.ts#L12-L45)

## Custom events

- `transaction.confirmed` fired when a transaction is confirmed for a configurable amount of times. [A demo can be found here.](https://radians.nl/realtime-transaction-confirmation-demo)
- `systeminformation` fires system information like CPU, memory and filesystem stats at an configurable interval.

## Installation
1 Add the plugin to your relay node. 
```bash
cd ~/{core-bridgechain}/plugins && git clone https://github.com/e-m-s-y/socket-event-forwarder
```
2 Open `~/.config/{bridgechain-core}/{mainnet|devnet|testnet}/plugins.js` and add the plugin config at the bottom of the file.
```js
"@foly/socket-event-forwarder": {
    "port": 3333, // The port of the socket server
    "events": ['block.applied'],  // Events that you want to forward
    "confirmations": [5, 15, 51] // The amount of confirmations needed before firing the transaction.confirmed event 
    "customEvents": ['transaction.confirmed', 'systeminformation'] // Enabled custom events
    "systeminformationInterval": 5000 // Interval of relay.systeminformation event
}
```
3 Bootstrap the plugin.
```bash
cd ~/{core-bridgechain}
yarn bootstrap
```
4 Restart your relay.

## Credits

- [e-m-s-y](https://github.com/e-m-s-y)

## License

[MIT](LICENSE)
