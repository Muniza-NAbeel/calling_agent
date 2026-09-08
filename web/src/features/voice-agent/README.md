# Voice interaction boundary

This feature owns browser interaction only:

- microphone permission
- ElevenLabs session lifecycle
- provider events and activity state
- generic agent event state
- audio levels used by the visualizer
- duration, retry, error, and end-call controls

It must not contain Hopenix services, pricing, policy text, internal prompts, transfer destinations, customer guidance, or private knowledge. It may record generic provider events for UI state, but it must not interpret their business meaning. The ElevenLabs agent is the source of truth for those concerns. Any future backend context must cross a secure, typed API boundary and remain outside this feature's client bundle.
