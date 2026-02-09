```mermaid
sequenceDiagram
    participant browser
    participant server

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa {content: "Lorem ipsum", date: "2026-02-09T06:37:55.983Z"}
    activate server
    server-->>browser: JSON {"message":"note created"}
    deactivate server
```
