let nodes, edges, network, graph = {};

function buildGraph() {
  let n = parseInt(document.getElementById("nodes").value);
  let edgeInput = document.getElementById("edges").value.trim().split("\n");

  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  graph = {};

  for (let i = 0; i < n; i++) {
    nodes.add({ id: i, label: i.toString() });
    graph[i] = [];
  }

  edgeInput.forEach(line => {
    let [u, v, w] = line.split(" ").map(Number);

    edges.add({
      from: u,
      to: v,
      label: w.toString()
    });

    graph[u].push([v, w]);
    graph[v].push([u, w]); // undirected
  });

  let container = document.getElementById("network");
  network = new vis.Network(container, { nodes, edges }, {});
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function highlightNode(id, color) {
  nodes.update({ id: id, color: { background: color } });
}

function resetGraph() {
  nodes.forEach(node => {
    nodes.update({ id: node.id, color: { background: "#1e293b" } });
  });
}

// BFS
async function runBFS() {
  let visited = new Set();
  let q = [0];

  while (q.length > 0) {
    let node = q.shift();
    if (visited.has(node)) continue;

    visited.add(node);
    highlightNode(node, "orange");
    await sleep(700);

    for (let nbr of graph[node]) {
      if (!visited.has(nbr)) q.push(nbr);
    }

    highlightNode(node, "green");
  }
}

// DFS
async function runDFS() {
  let visited = new Set();

  async function dfs(node) {
    visited.add(node);
    highlightNode(node, "orange");
    await sleep(700);

    for (let nbr of graph[node]) {
      if (!visited.has(nbr)) {
        await dfs(nbr);
      }
    }

    highlightNode(node, "green");
  }

  await dfs(0);
}
async function runDijkstra() {
  resetGraph();

  let start = parseInt(document.getElementById("startNode").value);

  let dist = {};
  let visited = new Set();

  for (let node in graph) dist[node] = Infinity;
  dist[start] = 0;

  while (true) {
    let u = -1;

    // find min distance node
    for (let node in dist) {
      if (!visited.has(node) && (u === -1 || dist[node] < dist[u])) {
        u = node;
      }
    }

    if (u === -1 || dist[u] === Infinity) break;

    visited.add(u);

    highlightNode(parseInt(u), "orange");
    await sleep(800);

    for (let [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }

    highlightNode(parseInt(u), "green");
  }

  console.log("Final distances:", dist);
}
