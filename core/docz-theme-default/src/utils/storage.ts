export class Storage {
  public name: string
  constructor(name: string) {
    this.name = name
  }

  public get(): any {
    if (window && typeof window !== 'undefined') {
      const item = localStorage.getItem(this.name)
      return typeof item === 'string' ? JSON.parse(item) : null
    }
  }

  public set(value: any): void {
    if (window && typeof window !== 'undefined') {
      localStorage.setItem(this.name, JSON.stringify(value))
    }
  }

  public delete(): void {
    if (window && typeof window !== 'undefined') {
      localStorage.removeItem(this.name)
    }
  }
}
