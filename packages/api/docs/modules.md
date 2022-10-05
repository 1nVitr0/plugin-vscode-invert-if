[vscode-invert-if](README.md) / Exports

# vscode-invert-if

## Table of contents

### Enumerations

- [BinaryOperator](enums/BinaryOperator.md)
- [GuardClauseContext](enums/GuardClauseContext.md)
- [GuardClausePosition](enums/GuardClausePosition.md)
- [GuardClauseType](enums/GuardClauseType.md)
- [LogicalOperator](enums/LogicalOperator.md)
- [SyntaxNodeType](enums/SyntaxNodeType.md)
- [UnaryOperator](enums/UnaryOperator.md)

### Interfaces

- [BinaryExpressionRefNode](interfaces/BinaryExpressionRefNode.md)
- [BinaryExpressionSyntaxNode](interfaces/BinaryExpressionSyntaxNode.md)
- [BinaryExpressionUpdatedNode](interfaces/BinaryExpressionUpdatedNode.md)
- [DoWhileStatementNode](interfaces/DoWhileStatementNode.md)
- [DoWhileStatementRefNode](interfaces/DoWhileStatementRefNode.md)
- [DoWhileStatementUpdatedNode](interfaces/DoWhileStatementUpdatedNode.md)
- [EmptyNode](interfaces/EmptyNode.md)
- [EmptyRefNode](interfaces/EmptyRefNode.md)
- [EmptyUpdatedNode](interfaces/EmptyUpdatedNode.md)
- [ExpressionContext](interfaces/ExpressionContext.md)
- [ForStatementNode](interfaces/ForStatementNode.md)
- [ForStatementRefNode](interfaces/ForStatementRefNode.md)
- [ForStatementUpdatedNode](interfaces/ForStatementUpdatedNode.md)
- [FunctionDeclarationNode](interfaces/FunctionDeclarationNode.md)
- [FunctionDeclarationRefNode](interfaces/FunctionDeclarationRefNode.md)
- [FunctionDeclarationUpdatedNode](interfaces/FunctionDeclarationUpdatedNode.md)
- [GeneralStatementRefNode](interfaces/GeneralStatementRefNode.md)
- [GeneralStatementSyntaxNode](interfaces/GeneralStatementSyntaxNode.md)
- [GeneralStatementUpdatedNode](interfaces/GeneralStatementUpdatedNode.md)
- [GenericNode](interfaces/GenericNode.md)
- [GenericRefNode](interfaces/GenericRefNode.md)
- [GenericUpdatedNode](interfaces/GenericUpdatedNode.md)
- [GuardClauseProvider](interfaces/GuardClauseProvider.md)
- [IfStatementRefNode](interfaces/IfStatementRefNode.md)
- [IfStatementSyntaxNode](interfaces/IfStatementSyntaxNode.md)
- [IfStatementUpdatedNode](interfaces/IfStatementUpdatedNode.md)
- [InvertConditionProvider](interfaces/InvertConditionProvider.md)
- [InvertIfBaseProvider](interfaces/InvertIfBaseProvider.md)
- [InvertIfElseProvider](interfaces/InvertIfElseProvider.md)
- [LogicalExpressionRefNode](interfaces/LogicalExpressionRefNode.md)
- [LogicalExpressionSyntaxNode](interfaces/LogicalExpressionSyntaxNode.md)
- [LogicalExpressionUpdatedNode](interfaces/LogicalExpressionUpdatedNode.md)
- [Plugin](interfaces/Plugin.md)
- [RefSyntaxNode](interfaces/RefSyntaxNode.md)
- [SyntaxNode](interfaces/SyntaxNode.md)
- [UnaryExpressionRefNode](interfaces/UnaryExpressionRefNode.md)
- [UnaryExpressionSyntaxNode](interfaces/UnaryExpressionSyntaxNode.md)
- [UnaryExpressionUpdatedNode](interfaces/UnaryExpressionUpdatedNode.md)
- [UpdatedSyntaxNode](interfaces/UpdatedSyntaxNode.md)
- [WhileStatementNode](interfaces/WhileStatementNode.md)
- [WhileStatementRefNode](interfaces/WhileStatementRefNode.md)
- [WhileStatementUpdatedNode](interfaces/WhileStatementUpdatedNode.md)

### Type Aliases

- [ConditionRefNode](modules.md#conditionrefnode)
- [ConditionSyntaxNode](modules.md#conditionsyntaxnode)
- [ConditionUpdatedNode](modules.md#conditionupdatednode)
- [LoopNode](modules.md#loopnode)
- [LoopRefNode](modules.md#looprefnode)
- [LoopUpdatedNode](modules.md#loopupdatednode)

### Functions

- [isBinaryExpressionNode](modules.md#isbinaryexpressionnode)
- [isConditionNode](modules.md#isconditionnode)
- [isDoWhileNode](modules.md#isdowhilenode)
- [isEmptyNode](modules.md#isemptynode)
- [isForNode](modules.md#isfornode)
- [isFunctionDeclarationNode](modules.md#isfunctiondeclarationnode)
- [isGeneralStatementNode](modules.md#isgeneralstatementnode)
- [isGenericNode](modules.md#isgenericnode)
- [isIfStatementNode](modules.md#isifstatementnode)
- [isLogicalExpressionNode](modules.md#islogicalexpressionnode)
- [isLoopNode](modules.md#isloopnode)
- [isRefNode](modules.md#isrefnode)
- [isUnaryExpressionNode](modules.md#isunaryexpressionnode)
- [isWhileNode](modules.md#iswhilenode)

## Type Aliases

### ConditionRefNode

Ƭ **ConditionRefNode**<`T`\>: [`UnaryExpressionRefNode`](interfaces/UnaryExpressionRefNode.md)<`T`\> \| [`BinaryExpressionRefNode`](interfaces/BinaryExpressionRefNode.md)<`T`\> \| [`LogicalExpressionRefNode`](interfaces/LogicalExpressionRefNode.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[nodes/ConditionNode.ts:128](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L128)

___

### ConditionSyntaxNode

Ƭ **ConditionSyntaxNode**<`T`\>: [`UnaryExpressionSyntaxNode`](interfaces/UnaryExpressionSyntaxNode.md)<`T`\> \| [`BinaryExpressionSyntaxNode`](interfaces/BinaryExpressionSyntaxNode.md)<`T`\> \| [`LogicalExpressionSyntaxNode`](interfaces/LogicalExpressionSyntaxNode.md)<`T`\>

Syntax node representing a conditional expression.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[nodes/ConditionNode.ts:123](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L123)

___

### ConditionUpdatedNode

Ƭ **ConditionUpdatedNode**<`T`\>: [`UnaryExpressionUpdatedNode`](interfaces/UnaryExpressionUpdatedNode.md)<`T`\> \| [`BinaryExpressionUpdatedNode`](interfaces/BinaryExpressionUpdatedNode.md)<`T`\> \| [`LogicalExpressionUpdatedNode`](interfaces/LogicalExpressionUpdatedNode.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[nodes/ConditionNode.ts:130](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L130)

___

### LoopNode

Ƭ **LoopNode**<`T`\>: [`ForStatementNode`](interfaces/ForStatementNode.md)<`T`\> \| [`WhileStatementNode`](interfaces/WhileStatementNode.md)<`T`\> \| [`DoWhileStatementNode`](interfaces/DoWhileStatementNode.md)<`T`\>

Syntax node representing a generic loop statement.

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[nodes/LoopNode.ts:67](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L67)

___

### LoopRefNode

Ƭ **LoopRefNode**<`T`\>: [`ForStatementRefNode`](interfaces/ForStatementRefNode.md)<`T`\> \| [`WhileStatementRefNode`](interfaces/WhileStatementRefNode.md)<`T`\> \| [`DoWhileStatementRefNode`](interfaces/DoWhileStatementRefNode.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[nodes/LoopNode.ts:69](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L69)

___

### LoopUpdatedNode

Ƭ **LoopUpdatedNode**<`T`\>: [`ForStatementUpdatedNode`](interfaces/ForStatementUpdatedNode.md)<`T`\> \| [`WhileStatementUpdatedNode`](interfaces/WhileStatementUpdatedNode.md)<`T`\> \| [`DoWhileStatementUpdatedNode`](interfaces/DoWhileStatementUpdatedNode.md)<`T`\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Defined in

[nodes/LoopNode.ts:71](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L71)

## Functions

### isBinaryExpressionNode

▸ **isBinaryExpressionNode**<`T`\>(`node`): node is BinaryExpressionSyntaxNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is BinaryExpressionSyntaxNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/ConditionNode.ts:147](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L147)

___

### isConditionNode

▸ **isConditionNode**<`T`\>(`node`): node is ConditionSyntaxNode<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is ConditionSyntaxNode<T\>

#### Defined in

[nodes/ConditionNode.ts:135](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L135)

___

### isDoWhileNode

▸ **isDoWhileNode**<`T`\>(`node`): node is DoWhileStatementNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is DoWhileStatementNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/LoopNode.ts:88](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L88)

___

### isEmptyNode

▸ **isEmptyNode**<`T`\>(`node`): node is EmptyNode<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is EmptyNode<T\>

#### Defined in

[nodes/EmptyNode.ts:18](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/EmptyNode.ts#L18)

___

### isForNode

▸ **isForNode**<`T`\>(`node`): node is ForStatementNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is ForStatementNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/LoopNode.ts:92](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L92)

___

### isFunctionDeclarationNode

▸ **isFunctionDeclarationNode**<`T`\>(`node`): node is FunctionDeclarationNode<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is FunctionDeclarationNode<T\>

#### Defined in

[nodes/FunctionDeclarationNode.ts:18](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/FunctionDeclarationNode.ts#L18)

___

### isGeneralStatementNode

▸ **isGeneralStatementNode**<`T`\>(`node`): node is GeneralStatementSyntaxNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is GeneralStatementSyntaxNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/GeneralStatementNode.ts:21](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GeneralStatementNode.ts#L21)

___

### isGenericNode

▸ **isGenericNode**<`T`\>(`node`): node is GenericNode<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is GenericNode<T\>

#### Defined in

[nodes/GenericNode.ts:18](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/GenericNode.ts#L18)

___

### isIfStatementNode

▸ **isIfStatementNode**<`T`\>(`node`): node is IfStatementSyntaxNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is IfStatementSyntaxNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/IfStatementNode.ts:32](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/IfStatementNode.ts#L32)

___

### isLogicalExpressionNode

▸ **isLogicalExpressionNode**<`T`\>(`node`): node is LogicalExpressionSyntaxNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is LogicalExpressionSyntaxNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/ConditionNode.ts:151](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L151)

___

### isLoopNode

▸ **isLoopNode**<`T`\>(`node`): node is LoopNode<T\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is LoopNode<T\>

#### Defined in

[nodes/LoopNode.ts:76](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L76)

___

### isRefNode

▸ **isRefNode**(`node`): node is RefSyntaxNode<any\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`any`\> |

#### Returns

node is RefSyntaxNode<any\>

#### Defined in

[nodes/SyntaxNode.ts:78](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/SyntaxNode.ts#L78)

___

### isUnaryExpressionNode

▸ **isUnaryExpressionNode**<`T`\>(`node`): node is UnaryExpressionSyntaxNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is UnaryExpressionSyntaxNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/ConditionNode.ts:143](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/ConditionNode.ts#L143)

___

### isWhileNode

▸ **isWhileNode**<`T`\>(`node`): node is WhileStatementNode<T, SyntaxNode<T\>\>

#### Type parameters

| Name |
| :------ |
| `T` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `node` | [`SyntaxNode`](interfaces/SyntaxNode.md)<`T`\> |

#### Returns

node is WhileStatementNode<T, SyntaxNode<T\>\>

#### Defined in

[nodes/LoopNode.ts:84](https://github.com/1nVitr0/plugin-vscode-invert-if/blob/d1df971/packages/api/src/nodes/LoopNode.ts#L84)
