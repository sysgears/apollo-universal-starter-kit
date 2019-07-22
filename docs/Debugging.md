# Debugging code of Apollo Universal Starter Kit

## Debugging NodeJS backend server

To debug NodeJS backend server you should enable running NodeJS backend with `inspect` protocol enabled. This is done by modifying `packages/server/webpack.config.js` and adding `--inspect` option to `nodemon`: `onBuildEnd: ['nodemon --inspect build --watch false']`

You are ready to debug your NodeJS server.

### Debugging NodeJS backend server via Chrome browser

Open dev tools panel via `F12` or `Ctrl+Shift+J` and you will see green icon in the top left corner
of the panel. Press this icon then go to `Sources` tab, from there you will be able to see project source
code and add breakpoints inside files.

### Debugging NodeJS backend server via Visual Studio code

Click debug icon in the left VS Code navbar or press `Ctrl+Shift+D`. Click on the gear icon, select Node.JS, then click on blue `Add Configuration` button in the down right corner and specify `Node.JS Attach`. This will add the configuration that attaches to Node process with inspect listener on port `9229`, delete the other configuration in launch.json:
```
{
  "type": "node",
  "request": "launch",
  "name": "Launch Program",
  "program": "${workspaceFolder}/--stream"
}
```
It is not needed. The one you need is:
```
{
  "type": "node",
  "request": "attach",
  "name": "Attach",
  "port": 9229
}
```

Click on the Debug icon in left VS Code navbar again, select `Launch` in the select box near green play button and press green play button. This will attach VS Code debugger to a running NodeJS backend. You can now add breakpoints to the source code files and use
VS Code debugging features.

## Debugging web front-end code

### Debugging via Chrome browser

You can start using Chrome dev tools to debug web front end code right away. No setup is needed. Just
open dev tools via `F12` or `Ctrl+Shift+J`, go to `Sources` tab go inside `webpack://` and find the source file where you want to place the breakpoint.

### Debugging via Visual Studio Code

In order to debug web code inside VS Code you should install `Debugger for Chrome` extension first.
Click on the Extensions icon in VS Code navbar. Type `Debugger for Chrome`, install the extension.
Click on the Debug icon in VS Code navbar, click on the gear icon in the top left, click `Add Configuration` blue button and specify `Chrome Launch`, change `url` to `http://localhost:3000`.

Click on the Debug icon in left VS Code navbar again, select `Launch Chrome` in the select box near green play button and press green play button.

## Debugging mobile app

### Debugging via Chrome browser

Activate Expo Developer Menu:
  - On iOS device by shaking device a bit
  - In iOS Simulator via `Cmd+D`
  - In Andorid Emulator via `Ctrl+M`
Then select `Debug JS Remotely`. New Tab will be opened in Chrome browser. Activate dev tools on this tab and click `Sources`, then navigate into `webpack://` and find the source file where you want to set breakpoint.

