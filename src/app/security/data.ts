
export class Principal {

  constructor(public readonly accountId: number,
              public readonly displayName: string,
              public readonly authorities: string[] = []){
  }

}
