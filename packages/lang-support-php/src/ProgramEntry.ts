import { Program, Node } from "php-parser";

export type NodeWithParent<N extends Node | null> = N extends null
  ? null
  : {
      [P in keyof N]: N[P] extends Node | null
        ? NodeWithParent<N[P]>
        : N[P] extends Node[]
        ? NodeWithParent<Node>[]
        : N[P];
    } & { parent: NodeWithParent<Node> | null; pathName: string | null };

export interface ProgramEntry {
  version: number;
  program: NodeWithParent<Program>;
}
