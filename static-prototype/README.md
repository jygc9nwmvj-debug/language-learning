# No-build technical prototype

This folder is a dependency-free browser smoke test for Lesson 1.

Serve it over localhost/HTTPS (microphone APIs do not work reliably from `file://`):

```bash
cd static-prototype
python3 -m http.server 8080
```

Open `http://localhost:8080`.

It demonstrates:
- local progress (localStorage in this smoke test)
- microphone permission + local pitch contour
- static audio playback
- tone lab
- pen/finger canvas
- paper/print mode
- Traditional/Simplified display
- changed replay sequence
- service-worker caching

The main project remains the typed/data-driven architecture under `src/`.
