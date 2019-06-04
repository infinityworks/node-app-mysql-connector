const mysql = require('mysql2');
const { PromiseConnection } = require('mysql2/promise');
const poolOptions = require('./src/poolOptions');
const poolMonitoring = require('./src/poolMonitoring');

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

    const { query } = PromiseConnection.prototype;
    const { execute } = PromiseConnection.prototype;

    PromiseConnection.prototype.query = async function flattenedQuery(...args) {
        const [rows] = await query(...args);
        return rows;
    };

    PromiseConnection.prototype.execute = async function flattenedExecute(...args) {
        const [rows] = await execute(...args);
        return rows;
    };

    return pool.promise();
};
