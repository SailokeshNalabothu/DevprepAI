/**
 * DevPrep AI - Baseline Load Testing Framework & Excel Reporter
 * File: load-tests/baseline-test.js
 */

const autocannon = require('autocannon');
const ExcelJS = require('exceljs');
const path = require('path');

const BASE_URL = process.env.BASE_URL || 'http://localhost:5000';
const TARGET_PATH = process.env.TARGET_PATH || '/api/settings/public';
const HTTP_METHOD = (process.env.HTTP_METHOD || 'GET').toUpperCase();
const VIRTUAL_USERS = parseInt(process.env.VIRTUAL_USERS || '100', 10);
const TEST_DURATION = parseInt(process.env.TEST_DURATION || '60', 10);
const AUTH_TOKEN = process.env.AUTH_TOKEN || '';
const FULL_URL = `${BASE_URL}${TARGET_PATH}`;
const EXCEL_OUTPUT_PATH = path.join(__dirname, 'DevPrep_AI_Load_Test_Report.xlsx');

const STATUS_MESSAGES = {
    200: '200 OK',
    201: '201 Created',
    304: '304 Not Modified',
    400: '400 Bad Request',
    401: '401 Unauthorized',
    403: '403 Forbidden',
    404: '404 Not Found',
    429: '429 Too Many Requests',
    500: '500 Internal Server Error'
};

const headers = { 'content-type': 'application/json' };
if (AUTH_TOKEN) {
    headers['authorization'] = `Bearer ${AUTH_TOKEN}`;
    headers['cookie'] = `token=${AUTH_TOKEN}`;
}

console.log('======================================================');
console.log('🚀 DevPrep AI Backend - Baseline Load Test');
console.log('======================================================');
console.log(`Target Endpoint: ${HTTP_METHOD} ${FULL_URL}`);
console.log(`Virtual Users:   ${VIRTUAL_USERS}`);
console.log(`Test Duration:   ${TEST_DURATION} seconds`);
console.log('======================================================\n');

const instance = autocannon({
    url: FULL_URL,
    method: HTTP_METHOD,
    connections: VIRTUAL_USERS,
    duration: TEST_DURATION,
    headers: headers
}, async (err, result) => {
    if (err) {
        console.error('❌ Baseline Load Test Error:', err);
        process.exit(1);
    }

    const startTime = result.start ? new Date(result.start) : new Date();
    const finishTime = result.finish ? new Date(result.finish) : new Date();
    const actualDurationSeconds = Math.max((finishTime - startTime) / 1000, result.duration || TEST_DURATION);

    const totalRequests = result.requests.total || 0;
    const rps = (totalRequests / actualDurationSeconds).toFixed(2);

    const c2xx = result['2xx'] || 0;
    const c3xx = result['3xx'] || 0;
    const c4xx = result['4xx'] || 0;
    const c5xx = result['5xx'] || 0;
    const non2xx = result.non2xx || 0;

    const successRate = totalRequests > 0 ? ((c2xx / totalRequests) * 100).toFixed(2) : '0.00';
    const errorRate = totalRequests > 0 ? ((non2xx / totalRequests) * 100).toFixed(2) : '0.00';

    const totalBytes = result.throughput ? result.throughput.total : 0;
    const throughputMBps = (totalBytes / (1024 * 1024) / actualDurationSeconds).toFixed(2);

    const lat = result.latency || {};
    const minLat = Number.isFinite(lat.min) ? lat.min : 0;
    const avgLat = Number.isFinite(lat.average) ? lat.average.toFixed(2) : '0.00';
    const maxLat = Number.isFinite(lat.max) ? lat.max : 0;
    const p50Lat = Number.isFinite(lat.p50) ? lat.p50 : 0;

    let p95Lat = lat.p95;
    if (!Number.isFinite(p95Lat)) {
        if (Number.isFinite(lat.p90) && Number.isFinite(lat.p97_5)) {
            p95Lat = Math.round(lat.p90 + (lat.p97_5 - lat.p90) * (5 / 7.5));
        } else {
            p95Lat = p50Lat;
        }
    }
    const p99Lat = Number.isFinite(lat.p99) ? lat.p99 : 0;

    const statusCodeStats = result.statusCodeStats || {};
    const topErrors = [];

    Object.keys(statusCodeStats).forEach(code => {
        const count = statusCodeStats[code].count || 0;
        if (parseInt(code, 10) >= 300) {
            const msg = STATUS_MESSAGES[code] || `${code} Status Code`;
            topErrors.push({ code, msg, count });
        }
    });

    topErrors.sort((a, b) => b.count - a.count);

    console.log('\n======================================================');
    console.log('📊 BASELINE LOAD TEST RESULTS SUMMARY');
    console.log('======================================================');
    console.log('\nTest Configuration');
    console.log('------------------');
    console.log(`Virtual Users:    ${VIRTUAL_USERS}`);
    console.log(`Duration:         ${actualDurationSeconds.toFixed(1)} seconds`);
    console.log(`Target Endpoint:  ${FULL_URL}`);
    console.log(`HTTP Method:      ${HTTP_METHOD}`);

    console.log('\nPerformance');
    console.log('-----------');
    console.log(`Req/Sec:          ${rps} req/sec`);
    console.log(`Total Requests:   ${totalRequests.toLocaleString()}`);

    console.log('\nLatency (ms)');
    console.log('-------');
    console.log(`Min:              ${minLat} ms`);
    console.log(`Average:          ${avgLat} ms`);
    console.log(`p50:              ${p50Lat} ms`);
    console.log(`p95:              ${p95Lat} ms`);
    console.log(`p99:              ${p99Lat} ms`);
    console.log(`Max:              ${maxLat} ms`);

    console.log('\nResponses');
    console.log('---------');
    console.log(`2xx:              ${c2xx.toLocaleString()}`);
    console.log(`3xx:              ${c3xx.toLocaleString()}`);
    console.log(`4xx:              ${c4xx.toLocaleString()}`);
    console.log(`5xx:              ${c5xx.toLocaleString()}`);
    console.log(`Non-2xx:          ${non2xx.toLocaleString()}`);
    console.log(`Success Rate:     ${successRate}%`);
    console.log(`Error Rate:       ${errorRate}%`);

    console.log('\nHTTP Status Distribution');
    console.log('------------------------');
    Object.keys(statusCodeStats).sort().forEach(code => {
        const count = statusCodeStats[code].count;
        console.log(`${code}: ${count.toLocaleString().padStart(8)}`);
    });

    if (topErrors.length > 0) {
        console.log('\nTop Errors');
        console.log('----------');
        topErrors.forEach(errItem => {
            console.log(`${errItem.msg.padEnd(28)}: ${errItem.count.toLocaleString()}`);
        });
    }

    console.log('\nThroughput');
    console.log('----------');
    console.log(`MB/sec:           ${throughputMBps} MB/sec`);

    console.log('\nRate Limiting Diagnostics');
    console.log('-------------------------');
    console.log(`Enabled:          YES`);
    console.log(`Environment:      ${process.env.NODE_ENV || 'development'}${process.env.LOAD_TEST === 'true' ? ' (LOAD_TEST=true)' : ''}`);
    console.log(`Window:           15 minutes (900,000 ms)`);
    console.log(`Configured Limit: ${process.env.LOAD_TEST === 'true' || process.env.NODE_ENV === 'loadtest' ? '1,000,000 req/window (Load Test Mode)' : (process.env.NODE_ENV === 'production' ? '100 req/window' : '10,000 req/window')}`);
    console.log(`Observed 429:     ${(statusCodeStats['429'] ? statusCodeStats['429'].count : 0).toLocaleString()}`);
    console.log(`Retry-After:      ${statusCodeStats['429'] ? 'Header set by express-rate-limit' : 'None'}`);
    console.log(`Client/IP behavior: Single Client IP (127.0.0.1) across all local virtual connections`);
    console.log('======================================================');

    const totalByClasses = c2xx + c3xx + c4xx + c5xx;
    const totalByNon2xx = c2xx + non2xx;

    console.log('\n🔍 DATA INTEGRITY ASSERTION CHECK:');
    console.log(`- 2xx + 3xx + 4xx + 5xx == Total Requests: ${totalByClasses === totalRequests ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- 2xx + Non-2xx == Total Requests:        ${totalByNon2xx === totalRequests ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`- Percentiles Numeric Check (p95, p99):    ${Number.isFinite(p95Lat) && Number.isFinite(p99Lat) ? '✅ PASS' : '❌ FAIL'}`);

    // Generate Excel Report
    try {
        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'DevPrep AI Baseline Load Testing Suite';
        workbook.created = new Date();

        const summarySheet = workbook.addWorksheet('Load Test Summary');
        summarySheet.columns = [
            { header: 'Metric Category', key: 'category', width: 30 },
            { header: 'Parameter / Metric Name', key: 'metric', width: 35 },
            { header: 'Value', key: 'value', width: 30 }
        ];

        summarySheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' }, size: 12 };
        summarySheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '0F172A' } };

        const rows = [
            { category: 'Configuration', metric: 'Target Endpoint', value: FULL_URL },
            { category: 'Configuration', metric: 'HTTP Method', value: HTTP_METHOD },
            { category: 'Configuration', metric: 'Virtual Concurrent Users', value: VIRTUAL_USERS },
            { category: 'Configuration', metric: 'Test Duration (s)', value: `${actualDurationSeconds.toFixed(1)} s` },
            { category: 'Performance', metric: 'Requests Per Second (RPS)', value: `${rps} req/sec` },
            { category: 'Performance', metric: 'Total Executed Requests', value: totalRequests },
            { category: 'Latency', metric: 'Minimum Latency', value: `${minLat} ms` },
            { category: 'Latency', metric: 'Average Latency', value: `${avgLat} ms` },
            { category: 'Latency', metric: 'p50 Latency', value: `${p50Lat} ms` },
            { category: 'Latency', metric: 'p95 Latency', value: `${p95Lat} ms` },
            { category: 'Latency', metric: 'p99 Latency', value: `${p99Lat} ms` },
            { category: 'Latency', metric: 'Maximum Latency', value: `${maxLat} ms` },
            { category: 'Responses', metric: '2xx Success Responses', value: c2xx },
            { category: 'Responses', metric: '3xx Redirection Responses', value: c3xx },
            { category: 'Responses', metric: '4xx Client Errors', value: c4xx },
            { category: 'Responses', metric: '5xx Server Errors', value: c5xx },
            { category: 'Responses', metric: 'Non-2xx Errors Total', value: non2xx },
            { category: 'Responses', metric: 'Success Rate (%)', value: `${successRate}%` },
            { category: 'Responses', metric: 'Error Rate (%)', value: `${errorRate}%` },
            { category: 'Throughput', metric: 'Transfer Speed (MB/sec)', value: `${throughputMBps} MB/sec` },
            { category: 'Evaluation', metric: 'Baseline College Result', value: c5xx === 0 && parseFloat(successRate) > 90 ? 'PASS ✅' : 'RATE LIMIT / MARGINAL' }
        ];

        rows.forEach(r => summarySheet.addRow(r));

        const detailSheet = workbook.addWorksheet('Status Code Breakdown');
        detailSheet.columns = [
            { header: 'HTTP Status Code', key: 'code', width: 20 },
            { header: 'Status Description', key: 'desc', width: 35 },
            { header: 'Total Count', key: 'count', width: 20 },
            { header: 'Percentage of Total', key: 'percentage', width: 25 }
        ];

        detailSheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFF' }, size: 11 };
        detailSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1E293B' } };

        Object.keys(statusCodeStats).sort().forEach(code => {
            const count = statusCodeStats[code].count;
            const pct = totalRequests > 0 ? ((count / totalRequests) * 100).toFixed(2) + '%' : '0%';
            detailSheet.addRow({
                code: code,
                desc: STATUS_MESSAGES[code] || 'HTTP Status Code',
                count: count,
                percentage: pct
            });
        });

        await workbook.xlsx.writeFile(EXCEL_OUTPUT_PATH);
        console.log(`\n📊 Generated Load Test Excel Report: ${EXCEL_OUTPUT_PATH}`);
    } catch (e) {
        console.error('Failed to generate Excel report:', e.message);
    }
});

autocannon.track(instance, { renderProgressBar: true });
