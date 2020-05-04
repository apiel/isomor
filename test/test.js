const { exec } = require('child_process');

process = exec('npx.run isomor-server', (err, output) => {
    if (err) {
        process.stderr.write(err);
    }
    process.stdout.write(output);
});

const getValue = require('api/getValue');
getValue().then(val => {
    if (val === 123) {
        process.stdout.write('Success\n');
        process.exit(0);
    } else {
        process.stderr.write('Failed\n');
        process.exit(1);
    }
});