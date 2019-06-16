# Bloom

## server

This is the server that determines which client should render which frame and layer. This server also handles the stitching of frames uploaded by the client.

It also allows for posting base64 encoded PNG image data for saving images on the server. Images will be saved in /uploads. Example:

```
var data = document.getElementById('canvas').toDataURL("image/png");
fetch('http://localhost:3000/upload', {
    method: 'POST',
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        data: data,
        filename: 'filename.png',
    })
})
```

### prerequisites

This server runs best with node > 10.

### installation

if you don't have homebrew nor node installed, install XCode, a terminal and type these command:

```bash
ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
brew update
brew install node
```

source: [Installing Homebrew on a Mac](https://treehouse.github.io/installation-guides/mac/homebrew) and [Installing Node.js® and NPM on Mac](https://treehouse.github.io/installation-guides/mac/node-mac.html)

#### mac

Run `npm i`.

#### linux

```bash
npm i -f
```

### development

Run `npm run build` to build all resources, then run `npm run dev`, this will start an app on localhost:8080. Run `npm run server`, this will start a socket on localhost:3000.

### build for production

Run `npm run build`.

### run

```bash
npm run server
```