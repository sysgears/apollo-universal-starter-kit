# Running Apollo Universal Starter Kit with Docker

Apollo Universal Starter Kit support containerization your application with Docker. Before you can run the starter kit 
project with Docker, install the latest versions of [Docker] and [Docker Compose].

### Running the Starter Kit using Docker for Development

To run the starter kit in development mode with live code reloading, run:

```bash
docker-compose up
```

**NOTE**: it may take a couple of minutes to build and run the application with Docker Compose.

When the build is ready, visit `http://localhost:3000` in your browser to view the application.

### Running the Dockerized Mobile App with Expo

If you need to launch the dockerized project in Expo, follow the steps below:

1. Run Expo Client on your mobile device, in Android Simulator, or in Xcode.

2. Tap **Explore** in the Expo Client app.

3. Tap the magnifier on the top.

4. Enter the URL `exp://localhost:19000` or `exp://000.00.0.0:19000`
 
**NOTE**: you must use your actual IP address instead of `000.00.0.0`. The starter kit will suggest the LAN IP address 
that you can use.

5. Tap the pop up to open the app. 

**NOTE**: if you want to run the app on a mobile device (either Android or iOS device), use the LAN IP address of your 
development machine instead of `localhost` in Expo. Scanning the QR codes won't work in this case.

### Running the Starter Kit using Docker for Production

To run the starter kit in production mode with Docker Compose, execute:

```bash
docker-compose -f docker-compose.prod.yml up
```

After that, open URL `http://localhost:3000` in the browser to view the application.

[docker]: https://www.docker.com/
[docker compose]: https://docs.docker.com/compose/