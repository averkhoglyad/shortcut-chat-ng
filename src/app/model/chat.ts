import { Identified, Ref } from './base';

export class Chat extends Identified<string> {

  name: string = '';
  participants: Array<Participant> = [];

}

export class Participant extends Identified<number> {

  name: string = '';
  email: string = '';

}

export class Message extends Identified<number> {

  chat!: Ref<string, Chat>;
  author!: Ref<number, Participant>;
  text: string = '';
  // createdAt: Date;

}
