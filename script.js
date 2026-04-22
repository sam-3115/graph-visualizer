let nodes, edges, network, graph = {};

function buildGraph() {
  let n = parseInt(document.getElementById("nodes").value);
  let edgeLines = document.getElementById("edges").value.trim().split("\n");

  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  graph = {};

  // Create nodes
  for (let i = 0; i < n; i++) {
    nodes.add({ id: i, label: i.toString(), color: "#1e293b" });
    graph[i] = [];
  }

  // Create edges
  edgeLines.forEach(line => {
    let parts = line.trim().split(" ").map(Number);

    if (parts.length < 2) return;

    let u = parts[0];
    let v = parts[1];
    let w = parts[2] || 1; // default weight

    edges.add({
      from: u,
      to: v,
      label: w.toString()
    });

    graph[u].push([v, w]);
    graph[v].push([u, w]);
  });

  let container = document.getElementById("network");
  let options = {
  layout: {
    improvedLayout: true
  },
  physics: {
    enabled: true,
    stabilization: {
      iterations: 200
    }
  },
  nodes: {
    shape: "dot",
    size: 20,
    font: { color: "white" }
  },
  edges: {
    color: "#94a3b8",
    smooth: true
  }
};

network = new vis.Network(container, { nodes, edges }, options);
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
  if (!graph[0]) {
    alert("Build graph first!");
    return;
  }

  resetGraph();

  let visited = new Set();
  // let queue = [0];
  let start = parseInt(document.getElementById("startNode").value);
  let queue = [start];

  while (queue.length > 0) {
    let node = queue.shift();

    if (visited.has(node)) continue;
    visited.add(node);

    highlightNode(node, "orange");
    await sleep(600);

    for (let [nbr, w] of graph[node]) {
      if (!visited.has(nbr)) {
        queue.push(nbr);
      }
    }

    highlightNode(node, "green");
  }
}

// DFS
async function runDFS() {
  if (!graph[0]) {
    alert("Build graph first!");
    return;
  }

  resetGraph();

  let visited = new Set();

  async function dfs(node) {
    visited.add(node);

    highlightNode(node, "orange");
    await sleep(600);

    for (let [nbr, w] of graph[node]) {
      if (!visited.has(nbr)) {
        await dfs(nbr);
      }
    }

    highlightNode(node, "green");
  }
  let start = parseInt(document.getElementById("startNode").value);
  await dfs(start);
  // await dfs(0);
}

// Dijkstra
async function runDijkstra() {
  if (!graph[0]) {
    alert("Build graph first!");
    return;
  }

  resetGraph();

  // let start = 0;
  let start = parseInt(document.getElementById("startNode").value);
  let dist = {};
  let visited = new Set();

  for (let node in graph) dist[node] = Infinity;
  dist[start] = 0;

  while (true) {
    let u = -1;

    for (let node in dist) {
      if (!visited.has(node) && (u === -1 || dist[node] < dist[u])) {
        u = node;
      }
    }

    if (u === -1 || dist[u] === Infinity) break;

    visited.add(u);

    highlightNode(parseInt(u), "orange");
    await sleep(700);

    for (let [v, w] of graph[u]) {
      if (dist[u] + w < dist[v]) {
        dist[v] = dist[u] + w;
      }
    }

    highlightNode(parseInt(u), "green");
  }

  console.log("Distances:", dist);
}
