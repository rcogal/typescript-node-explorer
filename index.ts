import { NodeExplorer } from "./classes/node-explorer";

// Input array
const items = [
  { id: 2, seqId: 4, parent: 5, name: "index.tsx" },
  { id: 3, seqId: 3, parent: 1, name: "Sidebar" },
  { id: 4, seqId: 5, parent: 1, name: "Table" },
  { id: 7, seqId: 5, parent: 5, name: "SelectableDropdown.tsx" },
  { id: 5, seqId: 2, parent: 1, name: "AssignmentTable" },
  { id: 1, seqId: 1, parent: null, name: "components" },
  { id: 6, seqId: 2, parent: null, name: "controllers" }
];

// Sort the seqId outside of the node explorer so it won't be tightly coupled to the class
items.sort((a, b) => {
  return a.seqId - b.seqId;
});

// A helper class that formats the results either in tree or list of nodes
const node = new NodeExplorer();

// transforms the items depending on the output format
const output = node.transformItems(items);

// Write TypeScript code!
const appDiv: HTMLElement = document.getElementById("app");
appDiv.innerHTML = `<pre>${JSON.stringify(output, null, 4)}</pre>`;
