/* eslint-disable no-plusplus */
/* eslint-disable @typescript-eslint/no-explicit-any */
export const pReduce = (iterable: any, reducer: any, initialValue: any): any =>
  new Promise((resolve, reject) => {
    const iterator = iterable[Symbol.iterator]();
    let index = 0;

    const next = async (total: any) => {
      const element = iterator.next();

      if (element.done) {
        resolve(total);
        return;
      }

      try {
        const value = await Promise.all([total, element.value]);
        next(reducer(value[0], value[1], index++));
      } catch (error) {
        reject(error);
      }
    };

    next(initialValue);
  });
