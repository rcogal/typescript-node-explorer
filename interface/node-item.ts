export interface NodeItem {
  id: number;
  seqId: number;
  parent: number;
  name: string;
  depth?: number;
  children?: NodeItem[];
}
