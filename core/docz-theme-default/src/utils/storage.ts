export class Storage {
  public name: string
  constructor(name: string) {
    this.name = name
  }

  public get(): any {
    if (window && typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(this.name)
        return typeof item === 'string' ? JSON.parse(item) : null
      } catch (err) {
        return {}
      }
    }
  }

  public set(value: any): void {
    if (window && typeof window !== 'undefined') {
      window.localStorage.setItem(this.name, JSON.stringify(value))
    }
  }

  public delete(): void {
    if (window && typeof window !== 'undefined') {
      window.localStorage.removeItem(this.name)
    }
  }
}
