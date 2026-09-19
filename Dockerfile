# v1 Dockerfile: one Node.js API, no database yet.
# Read this file top to bottom. Each line becomes a layer in the image.

# Base image = Node 22 on Alpine Linux (small, good for learning and servers).
FROM node:22-alpine

# Folder inside the container where the app lives.
WORKDIR /app

# Copy only package files first. Docker caches this layer, so `npm install`
# is skipped on later builds unless package.json changed.
COPY package.json package-lock.json* ./

# Install production dependencies only.
RUN npm install --omit=dev

# Copy the rest of the source code.
COPY src ./src

# Document the port the app listens on. This does not publish the port by
# itself; `docker run -p` or Compose `ports:` does that.
EXPOSE 3000

# Run as the non-root `node` user that already exists in the official image.
USER node

# Command that starts when the container starts.
CMD ["node", "src/server.js"]
