import { ConditionalKeys, ConditionalPick, Entry, Merge, SetRequired, Simplify } from 'type-fest';
import { Node } from 'unist';

export type PropList<T extends object, K extends keyof T, V extends string> = [
  (keyof Extract<T, { [key in K]: V }>)[]?,
  (keyof Extract<T, { [key in K]: V }>)?
];
export type PropMap<T extends object, K extends keyof T> = T[K] extends string
  ? { [key in T[K]]: PropList<T, K, key> }
  : never;
export type PickUnistProps<T extends object> = Omit<Pick<T, keyof T & keyof Node>, 'data' | 'children'>;
export type UnistData<T extends Object> = Omit<T, keyof Node>;
export type UnistLike<T extends object> = Simplify<
  PickUnistProps<T> & { data: UnistData<T>; children?: UnistLike<T>[] }
>;

export abstract class ASTTransformer<
  T extends object = any,
  K extends ConditionalKeys<T, string> = ConditionalKeys<T, string>,
  U extends object = UnistData<T>
> {
  protected static allowedUnistParams: (keyof Node)[] = ['position', 'type'];

  public abstract language: string;
  protected abstract typeKey: ConditionalKeys<T, string>;
  protected childLikeProps: { key: T[K]; childProps: PropList<T, K, T[K]> }[] = [];

  public constructor(childLikeProps: PropMap<T, ConditionalKeys<T, string>>) {
    for (const key of Object.keys(childLikeProps) as T[K][]) {
      const props: PropList<T, ConditionalKeys<T, string>, T[K]> = childLikeProps[key];
      if (props.length) this.childLikeProps.push({ key, childProps: childLikeProps[key] });
    }
  }

  public abstract transform(ast: T): UnistLike<T>;

  public abstract revert(ast: UnistLike<T>): T;

  protected extend<N extends T>(node: N, inPlace = false): Node<U> {
    let result: any = this.extendWithChildren(node, inPlace);
    result = this.extendWithData(result, inPlace);

    return result as Node<U>;
  }

  protected splat<N extends T>(node: UnistLike<N>, inPlace = false): N {
    let result = this.splatData(node, inPlace);
    result = this.splatChildren(result, inPlace);

    return result as N;
  }

  protected extendWithData<N extends T>(node: N & Partial<UnistLike<N>>, inPlace = false): UnistLike<N> {
    const data: Partial<UnistData<N>> = {};
    for (const key in Object.keys(node) as (keyof N)[]) {
      if (ASTTransformer.allowedUnistParams.includes(key as keyof Node)) continue;
      data[key as keyof UnistData<N>] = node[key as keyof UnistData<N>];
      if (inPlace) delete node[key as keyof N];
    }

    if (inPlace) return this.extendWithDataInPlace(node, data as UnistData<N>);
    else return this.extendWithDataClone(node, data as UnistData<N>);
  }

  protected extendWithChildren<N extends T>(node: N & Partial<UnistLike<N>>, inPlace = false): UnistLike<N> {
    const children: any[] = [];

    for (const childProp of this.findChildProps(node[this.typeKey] as any)) {
      const child = node[childProp as keyof typeof node];
      if (child instanceof Array) {
        for (const element of child) if (element) children.push(this.extendWithChildren(element, inPlace) as T);
      } else if (child) {
        children.push(this.extendWithChildren(child as any, inPlace) as T);
      }
      if (inPlace) delete node[childProp as keyof typeof node];
    }

    if (!inPlace) {
      const _node = node as UnistLike<N>;
      _node.children = children as any;
      return _node;
    }

    return { ...node, children } as UnistLike<N>;
  }

  protected splatData<N extends T>(node: Partial<UnistLike<N>>, inPlace = false): N & Partial<UnistLike<N>> {
    if (inPlace) {
      const _node = node as Partial<UnistLike<N>>;

      if (_node.data) {
        for (const key of Object.keys(_node.data))
          _node[key as keyof typeof node] = _node.data[key as keyof UnistData<N>] as any;
      }
      if (_node.children) for (const child of _node.children as Partial<UnistLike<N>>[]) this.splatData(child, true);

      delete _node.data;
      delete _node.children;
      return _node as N;
    } else {
      const _node: Partial<UnistLike<N>> = { ...node, ...node.data };
      _node.children?.map((child) => this.splatData(child, false));
      delete _node.data;
      return _node as N;
    }
  }

  protected splatChildren<N extends T>(node: Partial<UnistLike<N>>, inPlace = false): N & Partial<UnistLike<N>> {
    const children = this.findChildProps((node as any).type);

    if (inPlace) {
      const _node = node as Partial<UnistLike<N>>;
      if (!_node.data) return _node as N;
      for (const key of Object.keys(_node.data))
        _node[key as keyof typeof node] = _node.data[key as keyof UnistData<N>] as any;
      delete _node.data;
      return _node as N;
    } else {
      const _node: Partial<UnistLike<N>> = { ...node, ...node.data };
      delete _node.data;
      return _node as N;
    }
  }

  /*{
        const [prop = [], rest] = childProps;
        for (const element of rest ? [...prop, rest] : prop) if (nodeKeys.has(element as string)) return true;
        return false;
      }*/
  protected findChildProps(type: T[K]): (K & keyof T)[] {
    const childProp = this.childLikeProps.find(({ key }) => key === type);
    const [prop = [], rest] = childProp?.childProps || [];
    return (rest ? [...prop, rest] : prop) as unknown as (K & keyof T)[];
  }

  private extendWithDataInPlace<N extends T>(node: N & Partial<UnistLike<N>>, data: UnistData<N>): UnistLike<N> {
    node.data = data as UnistData<N> as any;

    if (node.children)
      for (const child of node.children as (T & Partial<UnistLike<T>>)[]) this.extendWithData(child, true);

    return node as UnistLike<N>;
  }

  private extendWithDataClone<N extends T>(node: N & Partial<UnistLike<N>>, data: UnistData<N>): UnistLike<N> {
    const _node = { data: data as UnistData<N> } as N & Partial<UnistLike<N>>;
    for (const include of ASTTransformer.allowedUnistParams) {
      if (node[include as keyof typeof node])
        _node[include as keyof typeof node] = node[include as Exclude<keyof N, keyof Node>] as any;
    }

    if (node.children) {
      node.children = node.children.map((child) =>
        this.extendWithData(child as T & Partial<UnistLike<T>>, false)
      ) as any;
    }

    return _node as UnistLike<N>;
  }
}
