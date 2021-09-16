declare type PathTree<T> = {
  [P in keyof T]-?: T[P] extends object ? [P] | [P, ...Path<T[P]>] : [P];
};

declare type Path<T> = PathTree<T>[keyof PathTree<T>];
