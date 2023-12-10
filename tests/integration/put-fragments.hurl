# =============================================================================================================================
# POST a new fragment

POST http://localhost:8080/v1/fragments
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello from POST`

HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 15
[Captures]
url: header "Location"

# =============================================================================================================================
# GET the fragment

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello from POST"

# =============================================================================================================================
# EDIT the fragment

PUT {{url}}
Content-Type: text/plain
[BasicAuth]
user1@email.com:password1
`Hello from PUT`

HTTP/1.1 201
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/plain"
jsonpath "$.fragment.size" == 14

# =============================================================================================================================
# GET the edited fragment

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
Content-Type: text/plain
[Asserts]
body == "Hello from PUT"

# =============================================================================================================================
# DELETE the fragment

DELETE {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# =============================================================================================================================
# Try to GET the fragment again

GET {{url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# =============================================================================================================================
