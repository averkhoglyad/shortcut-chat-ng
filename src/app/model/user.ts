import { Identified } from './base';

export class User extends Identified<string> {

  name: string = ''
  email: string = ''

}
