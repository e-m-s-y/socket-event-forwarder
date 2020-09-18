# Socket event forwarder
A plugin for forwarding real-time socket events from an Ark relay node towards connected clients.

## Installation
1 Add the plugin to your relay node. 
```bash
cd ~/{core-bridgechain}/plugins && git clone https://github.com/e-m-s-y/socket-event-forwarder
```
2 Open `~/.config/{ark-core}/{mainnet|devnet|testnet}/plugins.js` and add the plugin config at the bottom of the file.
```js
"@foly/socket-event-forwarder": {
    "port": 3333, // The port the socket server server will listen to
    "events": ['block.applied'],  // Events that you want to forward
    "confirmations": [5, 15, 51] // The amount of confirmations needed before firing the transaction.confirmed event 
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
