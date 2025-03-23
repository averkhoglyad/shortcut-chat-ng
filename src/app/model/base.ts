export abstract class Identified<I> {

  id: I | undefined;

  constructor(id?: I) {
    this.id = id || undefined;
  }
}

export class Ref<I, T extends Identified<I>> {
  readonly id: I;

  constructor(entity: I | T | Ref<I, T>) {
    if (entity instanceof Ref) {
      this.id = (entity as Ref<I, T>).id;
    } else if (entity instanceof Identified) {
      let entityId = (entity as Identified<I>).id;
      if (!entityId) {
        throw "Identified entity ID must be defined"
      }
      this.id = entityId;
    } else {
      this.id = entity as I;
    }
  }
}
