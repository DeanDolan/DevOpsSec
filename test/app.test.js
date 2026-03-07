const assert = require('assert');
const http = require('http');
const path = require('path');
const { spawn } = require('child_process');

describe('Simple Application smoke tests', function () {
  this.timeout(15000);
  let serverProcess;

  before(function (done) {
    serverProcess = spawn('node', ['./bin/www'], {
      cwd: path.join(__dirname, '..'),
      env: { ...process.env, PORT: '3002', ENV: 'DEV' },
      stdio: 'ignore'
    });
    setTimeout(done, 3000);
  });

  after(function () {
    if (serverProcess) {
      serverProcess.kill();
    }
  });

  it('returns 200 on /', function (done) {
    http.get('http://127.0.0.1:3002/', function (res) {
      let body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        assert.strictEqual(res.statusCode, 200);
        assert.ok(body.includes('Simple Application'));
        done();
      });
    }).on('error', done);
  });

  it('returns 200 on /health', function (done) {
    http.get('http://127.0.0.1:3002/health', function (res) {
      let body = '';
      res.on('data', function (chunk) {
        body += chunk;
      });
      res.on('end', function () {
        assert.strictEqual(res.statusCode, 200);
        assert.ok(body.includes('ok'));
        done();
      });
    }).on('error', done);
  });
});