const { Command } = require('commander');
const ora = require('ora');
const chalk = require('chalk');
const WebSocket = require('ws');

// configure cli args option
const program = new Command();
program.version('0.0.1');
program
  .option('-h, --host <host>', 'host for port scan, host default', 'localhost')
  .option('-p, --port <port>', 'ports for scan', '80,21,22,23,25,53,110,443,1433,1863,2289,3306,5631,5632,5000,8080,9090');
// parse the cli args
program.parse(process.argv);

// get cli args
const { host, port } = program.opts()

// console the start port scan info
console.info(chalk.blue(`start port scan host: ${host}, port: ${port}`));

// do the port scan work
const url = 'ws://coolaf.com:9010/tool/ajaxport';
const socket = new WebSocket(url, {
  origin: 'http://coolaf.com',
})

socket.on("open", () => {
  console.info(chalk.green(`connect to ${url} success!`));
  // send the request text message like
  // {"ip":"localhost","port":"80,21,22"}
  socket.send(`{"ip":"${host}","port":"${port}"}`)
  // close the socket
  socket.close()
});

socket.on("message", (data) => {
  // parse the response text message like
  // {"Host":"hao.360.cn","Ip":"36.110.236.68","Port":"2289","Status":"2"}
  const response = JSON.parse(data)
  console.info(chalk.blue(`${response.Host}(${response.Ip}) ${response.Port} ${response.Status === '1' ? chalk.green('open') : chalk.red('closed')}`));
})

socket.on("error", (err) => console.log(chalk.red(`connection error: ${err}`)));

socket.on("close", (err) => console.log(chalk.red(`connection close: ${err}`)));
