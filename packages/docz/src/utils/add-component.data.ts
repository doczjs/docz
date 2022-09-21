/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/naming-convention */
export function __docz_add_component_data__(target: any, props: any) {
  if (typeof target !== 'undefined') {
    return new Proxy(target, {
      get(_target, prop) {
        if (prop === '__filemeta') {
          return props;
        }
        // @ts-ignore
        return Reflect.get(...arguments);
      },
    });
  }
  return target;
}
