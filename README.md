# fragments

Instructions to run the server:

- Test
  Type "npm test" ino the command line. This performs no test only prints out the text "echo "Error: no test specified" && exit 1".

- Lint
  Type "npm run lint" in the command line. This script checks the code for errors that needs to be fixed.

- Start
  Type "npm start" into the command line. This script runs a command defined in the start property of the "scripts" object. In the case of this project it is "node src/server.js".

- Dev
  Type "npm run dev" into the command line. This script sets the "LOG_LEVEL" to "debug", capturing debugging information. It then starts the server using "server.js" and uses nodemon. Nodemon monitors any changes and restarts the server when they are detected.

- Debug
  Type "npm run debug" into the command line. This script is very similar to npm run dev. They differ only in this part of the command: "--inspect=0.0.0.0:9229". This connects you to VSCode's debugger.
