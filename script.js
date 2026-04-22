// Nodes & Edges
let nodes = new vis.DataSet([
  { id: 0, label: "0" },
  { id: 1, label: "1" },
  { id: 2, label: "2" },
  { id: 3, label: "3" },
  { id: 4, label: "4" }
]);

let edges = new vis.DataSet([
  { from: 0, to: 1 },
  { from: 0, to: 2 },
  { from: 1, to: 3 },
  { from: 2, to: 4 }
]);

let container = document.getElementById("network");
let data = { nodes: nodes, edges: edges };

let options = {
  nodes: {
    shape: "dot",
    size: 20,
    font: { color: "white" }
  },
  edges: {
    color: "#94a3b8"
  },
  physics: {
    enabled: true
  }
};

let network = new vis.Network(container, data, options);

// Graph structure
let graph = {
  0: [1, 2],
  1: [3],
  2: [4],
  3: [],
  4: []
};

// Utility
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
  resetGraph();
  let visited = new Set();
  let queue = [0];

  while (queue.length > 0) {
    let node = queue.shift();

    if (visited.has(node)) continue;
    visited.add(node);

    highlightNode(node, "orange");
    await sleep(800);

    for (let nbr of graph[node]) {
      if (!visited.has(nbr)) {
        queue.push(nbr);
      }
    }

    highlightNode(node, "green");
  }
}

// DFS
async function runDFS() {
  resetGraph();
  let visited = new Set();

  async function dfs(node) {
    visited.add(node);
    highlightNode(node, "orange");
    await sleep(800);

    for (let nbr of graph[node]) {
      if (!visited.has(nbr)) {
        await dfs(nbr);
      }
    }

    highlightNode(node, "green");
  }

  await dfs(0);
}
