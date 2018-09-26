# Running Apollo Universal Starter Kit with Docker


## Running Apollo Universal Starter Kit with Docker

Get the latest versions of [Docker] and [Docker Compose] before running Apollo Universal Starter Kit with Docker.

### Running the Starter Kit using Docker for Development

To run the starter kit in development mode with live code reloading, run:

```bash
docker-compose up
```

**NOTE**: It may take a couple of minutes to run the application with Docker Compose for the first time.

When the build is ready, visit `http://localhost:3000` in your browser to view the application.

If you need to launch the project in Expo in a simulator (Android Studio or Xcode), follow the steps below:

1. Open the Expo app.
2. Tap **Explore**.
3. Tap the magnifier on the top.
4. Enter the URL `exp://localhost:19000` or `exp://000.00.0.0:19000` (use your actual IP address instead of `000.00.0.0`. The starter kit will suggest the LAN IP address that you need to use to open the mobile app in a simulator.)
5. Tap the pop up to open the app. 

**NOTE**: If you want to open the app on a cell phone, use the LAN IP address of your development machine instead of 
`localhost` in Expo. Scanning the QR codes won't work in this case.

### Running the Starter Kit using Docker for Production

To run the starter kit in production mode with Docker Compose, execute:

```bash
docker-compose -f docker-compose.prod.yml up
```

After that, open URL `http://localhost:3000` in the browser to view the application.

[docker]: https://www.docker.com/
[docker compose]: https://docs.docker.com/compose/