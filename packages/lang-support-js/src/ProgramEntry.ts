import { FileKind, ProgramKind } from "ast-types/gen/kinds";
import { NodePath } from "ast-types/lib/node-path";

export interface ProgramEntry {
  version: number;
  programNode: FileKind;
  root: NodePath<ProgramKind>;
}
