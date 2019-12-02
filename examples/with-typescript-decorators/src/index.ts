@annotation
class MyClass {
  static annotated?: string
}

function annotation(target: typeof MyClass) {
  target.annotated = "yes it's annotated"
}

export default MyClass
