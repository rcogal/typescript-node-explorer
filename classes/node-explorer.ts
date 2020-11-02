import { NodeOutputType } from "../enums/node-output";
import { NodeConfig } from "../interface/node-config";
import { NodeItem } from "../interface/node-item";

export class NodeExplorer {
  private _config = {
    // Determine the output file NODE or FLAT array
    output: NodeOutputType.List,
    // Create a constrain for the maximum number of depth to. Set to -1 if it's unlimited
    maxDepth: 10
  };

  private _OrginalNodeitems: NodeItem[] = [];

  constructor(config: NodeConfig = null) {
    if (config !== null) {
      this._config = Object.assign(this._config, config);
    }
  }

  /**
   * Transform the input file into to a nested children
   */
  createNodeTree(nodes: NodeItem[]) {
    // Clone the node to avoid updating the original object
    const root = [];
    const cacheNode = {};

    nodes.forEach(node => {
      // Root node
      if (!node.parent) {
        node.depth = 0;
        return root.push(node);
      }

      let parentIndex = cacheNode[node.parent];

      // Cache found parent to prevent expensive lookup
      if (typeof parentIndex !== "number") {
        parentIndex = nodes.findIndex(el => el.id === node.parent);
        cacheNode[node.parent] = parentIndex;
      }

      node.depth = nodes[parentIndex].depth
        ? nodes[parentIndex].depth + 1
        : this.getDepthNode(node);

      if (!nodes[parentIndex].children) {
        return (nodes[parentIndex].children = [node]);
      }

      nodes[parentIndex].children.push(node);
    });

    return root;
  }

  /**
   * Transform node tree into flat array list
   */
  createNodeList(nodes: NodeItem[]) {
    const nodeTree = this.createNodeTree(nodes) as NodeItem[];

    return this.getRecursiveNode(nodeTree);
  }

  /**
   * Traverse each node 
   */
  private getRecursiveNode(nodes: NodeItem[]) {
    return nodes.reduce((accumulator, current) => {
      if (current.children) {
        const children = this.getRecursiveNode(current.children);

        delete current.children;

        accumulator.push(current);
        accumulator.push(...children);
      } else {
        accumulator.push(current);
      }
      return accumulator;
    }, []);
  }

  transformItems(nodes: NodeItem[]) {
    if (!nodes) {
      console.error("Nodes are empty.");
      return [];
    }

    // create a copy of node items
    this._OrginalNodeitems = nodes;

    // clone the node to avoid modifying the source object
    const _nodes = [...nodes];

    if (this._config.output === NodeOutputType.List) {
      return this.createNodeList(_nodes);
    } else if (this._config.output === NodeOutputType.Tree) {
      return this.createNodeTree(_nodes);
    }
  }

  private getDepthNode(node: NodeItem) {
    const foundNode = this._OrginalNodeitems.find(
      current => current.id === node.parent
    );

    if (foundNode && foundNode.parent) {
      return this.getDepthNode(foundNode) + 1;
    }

    return 1;
  }
}
