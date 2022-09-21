import parser from '@babel/parser';
import traverse from '@babel/traverse';

type Condition = (path: any) => boolean;
type Predicate<Value> = (path: any) => Value;

export const valueFromTraverse =
  (condition: Condition, predicate: Predicate<any> = (p) => p) =>
  (code: string): any | '' => {
    let value: any | '' = '';
    const ast = parser.parse(code, { plugins: ['jsx'] });

    traverse(ast, {
      enter(path: any): void {
        if (condition(path)) {
          value = predicate(path);
          path.stop();
        }
      },
    });

    return value;
  };

export const codeFromNode = (condition: Condition) => (code: string) =>
  valueFromTraverse(condition, (p) => code.slice(p.node.start, p.node.end))(
    code
  );
