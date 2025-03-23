export class Page<E> {
  constructor(readonly items: Array<E>,
              readonly total: number) {
  }
}

export class Slice<E> {
  constructor(readonly items: Array<E>,
              readonly nextToken: string) {
  }
}
