let nodes, edges, network, graph = {};

function buildGraph() {
  let n = parseInt(document.getElementById("nodes").value);
  let edgeInput = document.getElementById("edges").value.trim().split("\n");

  nodes = new vis.DataSet();
  edges = new vis.DataSet();
  graph = {};

  // Create nodes
  for (let i = 0; i < n; i++) {
    nodes.add({ id: i, label: i.toString() });
    graph[i] = [];
  }

  // Create edges
  edgeInput.forEach(line => {
    let [u, v] = line.split(" ").map(Number);
    edges.add({ from: u, to: v });
    graph[u].push(v);
    graph[v].push(u); // undirected
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
