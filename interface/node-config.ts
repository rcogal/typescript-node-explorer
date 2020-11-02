import { NodeOutputType } from "../enums/node-output";

export interface NodeConfig {
  output: NodeOutputType;
  maxDepth: number;
}
