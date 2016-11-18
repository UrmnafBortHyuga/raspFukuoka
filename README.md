# raspberryPi 3 + rpio + socket.io
node.js v5.4.0で動作確認

## setup
- `git clone git@github.com:UrmnafBortHyuga/raspFukuoka.git`
- `cd raspFukuoka`
- `npm i`
- `cd ../`
- `zip raspFukuoka.zip raspFukuoka`
- `scp ./raspFukuoka.zip user@xxx.xxx.xxx.xxx:~/`
- `ssh user@xxx.xxx.xxx.xxx`
- `unzip raspFukuoka.zip`
- `cd raspFukuoka`
- `npm i rpio`

## run
`node app.js`
