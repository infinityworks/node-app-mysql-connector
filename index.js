const mysql = require('mysql2');
const { PromiseConnection, PromisePool } = require('mysql2/promise');
const poolOptions = require('./src/poolOptions');
const poolMonitoring = require('./src/poolMonitoring');

[PromiseConnection, PromisePool].forEach((clazz) => {
    ['query', 'execute'].forEach((method) => {
        const original = clazz.prototype[method];

        /* eslint no-param-reassign: 0 */
        clazz.prototype[method] = async function flattenedExecute(...args) {
            const [rows] = await original.bind(this)(...args);
            return rows;
        };
    });
});

module.exports = (
    logger,
    metrics,
    host,
    port,
    user,
    password,
    database,
    connectionOptions = {},
    enableConnectionLogging = false,
) => {
    const poolOpts = poolOptions(host, port, user, password, database, connectionOptions);
    const pool = mysql.createPool(poolOpts);

    logger.info('connector.mysql.init', {
        message: 'new db pool created',
        host,
        port,
        connectionLimit: poolOpts.connectionLimit,
        queueLimit: poolOpts.queueLimit,
        acquireTimeout: poolOpts.acquireTimeout,
        waitForConnections: poolOpts.waitForConnections,
    });

    poolMonitoring(logger, metrics, enableConnectionLogging, pool);

    return pool.promise();
};
