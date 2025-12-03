export type API<
  Description extends string,
  RouterPath extends string,
  Path extends string,
  T,
  Query = never,
> = RouterPath & {
  __description__: Description;
  __data__: T;
  __apiPath__: Path;
  __routerPath__: RouterPath;
  __query__: Query;
};
