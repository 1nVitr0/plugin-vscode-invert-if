declare module "php-unparser" {
  import { Node } from "php-parser";

  function unparse(
    ast: Node,
    options?: {
      indent?: boolean;
      dontUseWhitespaces?: boolean;
      shortArray?: boolean;
      bracketsNewLine?: boolean;
      forceNamespaceBrackets?: boolean;
      collapseEmptyLines?: boolean;
    }
  ): string;
  export = unparse;
}
