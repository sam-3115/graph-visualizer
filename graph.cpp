#include <bits/stdc++.h>
using namespace std;

class Graph {
    int V;
    vector<vector<pair<int,int>>> adj;

public:
    Graph(int V) {
        this->V = V;
        adj.resize(V);
    }

    void addEdge(int u, int v, int w, bool undirected) {
        adj[u].push_back({v, w});
        if (undirected)
            adj[v].push_back({u, w});
    }

    // BFS
    vector<int> bfs(int start) {
        vector<int> result;
        vector<bool> visited(V, false);
        queue<int> q;

        q.push(start);
        visited[start] = true;

        while (!q.empty()) {
            int node = q.front(); q.pop();
            result.push_back(node);

            for (auto &nbr : adj[node]) {
                if (!visited[nbr.first]) {
                    visited[nbr.first] = true;
                    q.push(nbr.first);
                }
            }
        }
        return result;
    }

    // DFS
    void dfsUtil(int node, vector<bool>& visited, vector<int>& result) {
        visited[node] = true;
        result.push_back(node);

        for (auto &nbr : adj[node]) {
            if (!visited[nbr.first]) {
                dfsUtil(nbr.first, visited, result);
            }
        }
    }

    vector<int> dfs(int start) {
        vector<int> result;
        vector<bool> visited(V, false);
        dfsUtil(start, visited, result);
        return result;
    }

    // Dijkstra
    vector<int> dijkstra(int start) {
        vector<int> dist(V, INT_MAX);
        priority_queue<pair<int,int>, vector<pair<int,int>>, greater<>> pq;

        dist[start] = 0;
        pq.push({0, start});

        while (!pq.empty()) {
            auto [d, node] = pq.top(); pq.pop();

            for (auto &nbr : adj[node]) {
                int next = nbr.first;
                int weight = nbr.second;

                if (dist[node] + weight < dist[next]) {
                    dist[next] = dist[node] + weight;
                    pq.push({dist[next], next});
                }
            }
        }
        return dist;
    }
};

int main() {
    int V, E;
    cout << "Enter number of nodes and edges: ";
    cin >> V >> E;

    Graph g(V);

    cout << "Enter edges (u v weight):\n";
    for (int i = 0; i < E; i++) {
        int u, v, w;
        cin >> u >> v >> w;
        g.addEdge(u, v, w, true); // change to false if directed
    }

    int start;
    cout << "Enter starting node: ";
    cin >> start;

    // BFS
    vector<int> bfsRes = g.bfs(start);
    cout << "\nBFS Traversal: ";
    for (int x : bfsRes) cout << x << " ";
    cout << "\n";

    // DFS
    vector<int> dfsRes = g.dfs(start);
    cout << "DFS Traversal: ";
    for (int x : dfsRes) cout << x << " ";
    cout << "\n";

    // Dijkstra
    vector<int> dist = g.dijkstra(start);
    cout << "Shortest distances from node " << start << ":\n";
    for (int i = 0; i < V; i++) {
        cout << "Node " << i << " -> ";
        if (dist[i] == INT_MAX) cout << "INF";
        else cout << dist[i];
        cout << "\n";
    }

    return 0;
}
