// test/run-local-test.js
// รัน: npm run test-local


import handler from '../pages/api/dreams';


function createMockReq(query) {
return { query };
}


function createMockRes() {
return {
status(code) { this._status = code; return this; },
json(payload) { console.log('Response status:', this._status || 200); console.log(JSON.stringify(payload, null, 2)); },
setHeader() {}
};
}


(async () => {
console.log('--- RUN LOCAL TEST (mock) ---');
process.env.GSHEET_ID = '';
process.env.GSA_KEY = '';
await handler(createMockReq({ q: 'งู' }), createMockRes());
console.log('\n--- END TEST ---');
})();
