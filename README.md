# Messenger with Redis

This project is a real-time messaging application built using React, Node.js, Redis, and Socket.IO. It allows users to communicate instantly, leveraging Redis for efficient data storage and Socket.IO for real-time bidirectional event-based communication.

## Features

- Real-time Messaging: Facilitates instant communication between users.
- Redis Integration: Utilizes Redis for fast and reliable data storage.
- Socket.IO: Implements real-time, bidirectional communication between clients and servers.

## Prerequisites

Before running the application, ensure you have the following installed:

- Node.js (version 18 or higher)
- Redis

## Installation

1. Clone the repository and install dependencies

```
git clone https://github.com/TheOpti/messenger-with-redis.git
```

```
cd messenger-with-redis/
```

```
npm install
```

2. Install Redis

Ensure that your Redis server is running locally on the default port (6379). If your Redis configuration differs, update the connection settings in the project's configuration files accordingly.

3. Install PostgreSQL

Additionally, install PostgreSQL and create a database for the application.

You can do this using the following commands:

```
sudo -u postgres psql
CREATE DATABASE messenger;
```

Once the database is created, configure Prisma by running:

```
npx prisma migrate dev --name init
```

## Running the application

Once everything is setup, run the app using following command:

```
npm run dev
```
