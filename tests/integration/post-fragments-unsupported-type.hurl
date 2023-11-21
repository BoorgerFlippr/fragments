POST http://localhost:8080/v1/fragments
Content-Type: text/msword
# Include HTTP Basic Auth credentials
[BasicAuth]
user1@email.com:password1
`This is a fragment!`

HTTP/1.1 415
