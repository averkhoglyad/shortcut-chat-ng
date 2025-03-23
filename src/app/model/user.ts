import { Identified } from './base';

export class User extends Identified<number> {

  name: string = ''
  email: string = ''

}
