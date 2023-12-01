# =============================================================================================================================
# POST Authorized JSON

POST http://localhost:8080/v1/fragments
Content-Type: application/json
[BasicAuth]
user1@email.com:password1
{ "service" : "DynamoDB" }


HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"
[Captures]
fragmentP1_url: header "Location"
fragmentP1_id: jsonpath "$.fragment.id"

# =============================================================================================================================
# GET the fragment info

GET {{fragmentP1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "application/json"

# =============================================================================================================================
# POST Authorized Markdown

POST http://localhost:8080/v1/fragments
Content-Type: text/markdown
[BasicAuth]
user1@email.com:password1
```DynamoDB is **great**```


HTTP/1.1 201
[Asserts]
header "Location" matches "^http:\/\/localhost:8080\/v1\/fragments\/[A-Za-z0-9_-]+$"
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"
[Captures]
fragmentP2_url: header "Location"
fragmentP2_id: jsonpath "$.fragment.id"

# =============================================================================================================================
# GET the fragment info

GET {{fragmentP2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200
[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragment.id" matches "^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
jsonpath "$.fragment.ownerId" matches "^[0-9a-fA-F]+$"
jsonpath "$.fragment.created" isString
jsonpath "$.fragment.updated" isString
jsonpath "$.fragment.type" == "text/markdown"

# =============================================================================================================================
# GET all of the fragments

GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments[1]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments[1]" == {{fragmentP1_id}}
jsonpath "$.fragments[2]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments[2]" == {{fragmentP2_id}}

# =============================================================================================================================
# Delete the first fragment

DELETE {{fragmentP1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# =============================================================================================================================
# GET First fragment again

GET {{fragmentP1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# =============================================================================================================================
# Get list of all the fragments

GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.status" == "ok"
jsonpath "$.fragments[1]" matches "^[A-Za-z0-9_-]+$"
jsonpath "$.fragments[1]" != {{fragmentP1_id}}
jsonpath "$.fragments[1]" == {{fragmentP2_id}}
