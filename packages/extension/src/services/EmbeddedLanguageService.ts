import { Range, TextEditorEdit } from "vscode";
import {
  BinaryExpressionUpdatedNode,
  BinaryOperator,
  ConditionRefNode,
  ConditionUpdatedNode,
  DocumentContext,
  EmbeddedLanguageProvider,
  InvertConditionProvider,
  isBinaryExpressionNode,
  isConditionNode,
  isLogicalExpressionNode,
  isUnaryExpressionNode,
  LogicalExpressionSyntaxNode,
  LogicalOperator,
  RefSyntaxNode,
  SyntaxNodeType,
  UnaryExpressionRefNode,
  UnaryExpressionUpdatedNode,
  UnaryOperator,
  UpdatedSyntaxNode,
} from "vscode-invert-if";
import ConfigurationService from "./ConfigurationService";

export default class EmbeddedLanguageService {
  public constructor(private configurationService: ConfigurationService) {}

  public async getPrimaryEmbeddedSection(context: DocumentContext, provider: EmbeddedLanguageProvider, range?: Range) {
    const sections = await provider.provideEmbeddedSections(context, range);
    return sections?.find((section) => (range ? section.range.contains(range) : true));
  }

  public async getEmbeddedSections(context: DocumentContext, provider: EmbeddedLanguageProvider, range?: Range) {
    return await provider.provideEmbeddedSections(context, range);
  }
}
