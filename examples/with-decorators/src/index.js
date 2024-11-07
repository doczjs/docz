class MyClass {}
annotation(MyClass)

function annotation(target) {
  target.annotated = "yes it's annotated"
}

export default MyClass
