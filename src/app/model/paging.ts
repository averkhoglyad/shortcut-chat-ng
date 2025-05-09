export class Page<E> {
  constructor(readonly data: Array<E>,
              readonly total: number) {
  }
}

export class Slice<E> {
  constructor(readonly data: Array<E>,
              readonly nextToken: string) {
  }
}
