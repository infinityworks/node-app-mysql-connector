/* eslint no-underscore-dangle: 0 */

module.exports = (logger, metrics, enableConnectionLogging, pool) => {
    function exportAcquiredConnectionsMetric(value) {
        metrics.gauge({
            name: 'connector_db_acquired_conns',
            help: 'Number of connections currently acquired from the pool',
            value,
        });
    }

    pool.on('acquire', () => {
        const acquiredConnections = pool._allConnections.length - pool._freeConnections.length;
        exportAcquiredConnectionsMetric(acquiredConnections);

        if (enableConnectionLogging) {
            logger.info('connector.DBConnection.acquire', { acquiredConnections });
        }
    });

    pool.on('release', () => {
        const acquiredConnections = pool._allConnections.length - pool._freeConnections.length;
        exportAcquiredConnectionsMetric(acquiredConnections);

        if (enableConnectionLogging) {
            logger.info('connector.DBConnection.release', { acquiredConnections });
        }
    });

    pool.on('connection', () => {
        const poolSize = pool._allConnections.length;
        metrics.gauge({
            name: 'connector_db_pool_size',
            help: 'Current size of the DB connection pool',
            value: poolSize,
        });

        if (enableConnectionLogging) {
            logger.info('connector.DBConnection.connection', { poolSize });
        }
    });

    pool.on('enqueue', () => {
        if (enableConnectionLogging) {
            logger.info('connector.DBConnection.enqueue');
        }
    });
};
