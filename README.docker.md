# Docker: Metro dev server

This project includes a Docker configuration to run the Metro bundler inside a container.

Quick start (macOS / Docker Desktop):

```bash
# Build and start metro in container
yarn start:docker
# or
docker-compose up --build
```

Then in your Android device/emulator:

- For an emulator: Metro will be reachable at `10.0.2.2:8081` (Android emulator default) or via `adb reverse`.
- For a physical device on macOS/Windows using USB:
  1. Run `adb reverse tcp:8081 tcp:8081` (maps device port to host).
  2. If `adb reverse` is unreliable, open the RN dev menu -> Dev Settings -> Debug server host & port for device and set `<YOUR_HOST_IP>:8081`.

Notes:
- `REACT_NATIVE_PACKAGER_HOSTNAME` is set to `host.docker.internal` inside the container.
- On Linux you may need to enable `network_mode: "host"` in `docker-compose.yml` and set `REACT_NATIVE_PACKAGER_HOSTNAME` to your host IP.

If you want me to also run the container now and verify connectivity to your attached device, say so and I'll start it and run `adb reverse` for you.
