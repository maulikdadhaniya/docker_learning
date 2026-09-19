# Docker Learning — Node.js API v1

A small static Node.js API so you can learn Docker step by step, then deploy the same container on a Contabo VPS.

**v1 (this folder):** API + in-memory / file data. No database.  
**v2 (later):** same API, data stored in a database.

---

## What you will learn

1. Image vs container
2. How a `Dockerfile` builds an image
3. Run a container with `docker run`
4. Run the same app with `docker compose`
5. Deploy that Compose file on Contabo

---

## Project layout

```text
src/server.js          API (Express)
src/data/items.js      Static data for v1
Dockerfile             Recipe to build the image
.dockerignore          Files that must stay out of the image
docker-compose.yml     How to run the container (local + Contabo)
```

Useful URLs after the API is running:

| URL | What it does |
| --- | --- |
| `GET /` | App info |
| `GET /health` | Health check |
| `GET /api/items` | List items |
| `GET /api/items/1` | One item |

---

## Step 1 — Words Docker uses

| Word | Everyday meaning |
| --- | --- |
| **Image** | A snapshot / recipe. It does not run by itself. |
| **Container** | A running copy of an image. |
| **Dockerfile** | Text file that tells Docker how to build the image. |
| **Compose** | YAML file that says “build this, map this port, restart if it dies”. |

One image can start many containers. You rebuild the image when code changes.

---

## Step 2 — Run without Docker (optional)

Only if Node.js is installed on your laptop. This is useful so you can compare “Node on my machine” vs “Node inside Docker”.

```bash
npm install
npm start
```

Open http://localhost:3000/health

Stop the process with `Ctrl+C` before you start Docker, so port 3000 is free.

---

## Step 3 — Build the image

From this project folder:

```bash
docker build -t docker-learning-api .
```

- `-t docker-learning-api` gives the image a name
- `.` means “use the Dockerfile in this folder”

Check that the image exists:

```bash
docker images
```

---

## Step 4 — Run a container

```bash
docker run --name docker-learning-api -p 3000:3000 docker-learning-api
```

- `--name` names the running container
- `-p 3000:3000` maps **your machine port 3000** to **container port 3000**

Open:

- http://localhost:3000
- http://localhost:3000/api/items

Useful commands:

```bash
docker ps                  # running containers
docker logs docker-learning-api
docker stop docker-learning-api
docker start docker-learning-api
docker rm docker-learning-api    # delete a stopped container
```

If the name is already in use:

```bash
docker rm -f docker-learning-api
```

The API listens on `0.0.0.0` inside the container. That is required. If it listened only on `127.0.0.1`, Docker could not forward traffic from outside.

---

## Step 5 — Use Docker Compose (preferred)

Compose is the file you will also use on Contabo.

Start in the background:

```bash
docker compose up --build -d
```

- `--build` rebuilds the image if the Dockerfile or code changed
- `-d` means detached (runs in the background)

Then:

```bash
docker compose ps
docker compose logs -f
```

Stop:

```bash
docker compose down
```

After a code change, run `docker compose up --build -d` again.

---

## Step 6 — Deploy on Contabo

Contabo is a VPS (a Linux server you SSH into). Docker on Contabo is the same Docker you used locally. The usual OS is **Ubuntu**.

### 6.1 SSH into the server

```bash
ssh root@YOUR_SERVER_IP
```

Use the IP and password (or SSH key) from the Contabo panel.

### 6.2 Install Docker (Ubuntu)

Skip this if you ordered the Contabo Docker add-on.

```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo ${UBUNTU_CODENAME:-$VERSION_CODENAME}) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
sudo docker run hello-world
```

If `hello-world` prints a success message, Docker works.

### 6.3 Copy this project to the server

On **your laptop** (not on the server):

```bash
scp -r . root@YOUR_SERVER_IP:/root/docker-learning-api
```

Or put the project on GitHub and on the server run `git clone ...`.

### 6.4 Start the API

On the server:

```bash
cd /root/docker-learning-api
docker compose up --build -d
```

Open in a browser:

```text
http://YOUR_SERVER_IP:3000/health
http://YOUR_SERVER_IP:3000/api/items
```

If that fails, open **TCP port 3000** in the Contabo firewall / security group.

`restart: unless-stopped` in `docker-compose.yml` starts the container again after a reboot.

### 6.5 Later: domain + HTTPS

When you add a domain, put **Nginx** (or Caddy) on ports 80/443 and proxy to the API on port 3000. You do not need that for v1.

---

## Version 2 (later)

Keep this Docker setup. You will:

1. Add a database service in `docker-compose.yml` (Postgres is a common choice)
2. Change `src/data/items.js` to read/write the database
3. Add an env file for the database URL
4. Rebuild with `docker compose up --build -d`

v1 is intentionally small so you can learn images, ports, and Compose first.

---

## Troubleshooting

| Problem | What to try |
| --- | --- |
| Port already in use | Stop the other process, or change the left side of `"3000:3000"` |
| Browser cannot reach the API | Confirm the app listens on `0.0.0.0`, and that `-p` / Compose `ports` is set |
| Old code still running | `docker compose up --build -d` |
| `docker: command not found` | Install Docker Desktop (laptop) or Docker Engine (Contabo) |
| Contabo IP works in SSH but not in browser | Open port 3000 in the firewall |
