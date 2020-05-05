const { exec } = require('child_process');
const spawn = require('cross-spawn');
global.fetch = require('node-fetch');

const cmd = spawn('npx', ['isomor-server']);
cmd.stdout.on('data', (data) => {
    process.stdout.write(data.toString());
    if (data.toString().includes('listening on port 3005')) {
        test();
    }
});
cmd.stderr.on('data', (data) => {
    process.stderr.write(data.toString());
    process.exit(1);
});

function test() {
    const getValue = require('api/getValue');
    getValue.default().then((val) => {
        if (val === 123) {
            process.stdout.write('Success\n');
            cmd && cmd.kill();
            process.exit(0);
        } else {
            process.stderr.write('Failed\n');
            cmd && cmd.kill();
            process.exit(1);
        }
    });
}
