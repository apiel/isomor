const { exec } = require('child_process');

process = exec('npx.run ismor-server', (err, output) => {
    if (err) {
        process.stderr.write(err);
    }
    process.stdout.write(output);
});

const getValue = require('api/getValue');