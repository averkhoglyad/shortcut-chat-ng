
export class Principal {

  constructor(public readonly accountId: string,
              public readonly displayName: string,
              public readonly authorities: string[] = []){
  }

}
