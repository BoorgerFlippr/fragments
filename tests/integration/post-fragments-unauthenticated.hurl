POST http://localhost:8080/v1/fragments
Content-Type: text/plain
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password13
`This is a fragment!`

HTTP/1.1 401
