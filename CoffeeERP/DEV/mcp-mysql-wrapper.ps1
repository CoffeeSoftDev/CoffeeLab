$env:MYSQL_HOST = "localhost"
$env:MYSQL_PORT = "3306"
$env:MYSQL_USER = "somx"
$env:MYSQL_PASSWORD = "1234"
$env:MYSQL_DATABASE = "rfwsmqex_erp"

& uvx mcp-server-mysql
