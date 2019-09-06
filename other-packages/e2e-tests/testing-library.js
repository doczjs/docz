const test = (name, fn) => {
  console.log('>', name)
  fn()
}

const assert = (condition, description) => {
  if (condition) {
    console.log('✔️', description)
  } else {
    console.assert(condition, description)
  }
}
