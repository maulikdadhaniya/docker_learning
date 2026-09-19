// v1: data lives in this file (no database yet).
// v2: replace these functions with database queries (MongoDB, Postgres, etc.).

const items = [
  {
    id: 1,
    title: "What is Docker?",
    body: "Docker packages an app and its dependencies into an image so it runs the same on your laptop and on a server.",
  },
  {
    id: 2,
    title: "Image vs container",
    body: "An image is the recipe. A container is a running instance of that recipe.",
  },
  {
    id: 3,
    title: "Why listen on 0.0.0.0?",
    body: "Inside a container, localhost is only the container itself. Bind to 0.0.0.0 so Docker can forward traffic from outside.",
  },
];

function getAllItems() {
  return items;
}

function getItemById(id) {
  return items.find((item) => item.id === id) || null;
}

module.exports = {
  getAllItems,
  getItemById,
};
