const { exec } = require('child_process');
const spawn = require('cross-spawn');
global.fetch = require('node-fetch');

const cmd = spawn('npx', ['isomor-server']);
cmd.stdout.on('data', (data) => {
    console.log(data.toString());
    if (data.toString().includes('listening on port 3005')) {
        test();
    }
});
cmd.stderr.on('data', (data) => {
    console.error(data.toString());
    process.exit(1);
});

function test() {
    const getValue = require('api/getValue');
    getValue.default().then((val) => {
        if (val === 123) {
            console.log('Success');
            cmd && cmd.kill();
            process.exit(0);
        } else {
            console.error('Failed');
            cmd && cmd.kill();
            process.exit(1);
        }
    });
}
