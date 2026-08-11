---
'br-helpers': patch
---

Shrink the published package from 119.6 kB to 60.8 kB unpacked: sourcemaps are no longer shipped (they were ~70% of the dist bytes) and Cep/Phone now use compile-time private members, removing the WeakMap brand-check helpers and their call overhead from the ES2015 build. Validation behavior and performance are unchanged.
