// These flags are expected to be reasonably stable for any service
// but are mainly performance-driven, so as to prevent connections from backing up
// and services becoming silently overwhelmed and unresponsive.
// Further documentation on these flags can be found at https://github.com/mysqljs/mysql#pool-options
//
// Connection pool size, i.e. number of connections that can be ready in the pool
// They're lazily loaded
const CONNECTION_LIMIT = 200;

// If set to `true`, the driver will queue up any newly requested connections if the amount
// exceeds the current connection limit.
// If `false`, the driver will immediately error out when it runs out of connections. This is to
// prevent a backlog of connection requests from silently backing up.
const WAIT_FOR_CONNECTIONS = false;

// Only applicable if `waitForConnections` is true
// Maximum amount of requests to push into the queue awaiting a connection from the pool
const QUEUE_LIMIT = 100;

module.exports = (host, port, user, password, database, connectionOptions) => Object.assign({
    host,
    port,
    user,
    password,
    database,
    connectionLimit: CONNECTION_LIMIT,
    queueLimit: QUEUE_LIMIT,
    waitForConnections: WAIT_FOR_CONNECTIONS,
}, connectionOptions);
