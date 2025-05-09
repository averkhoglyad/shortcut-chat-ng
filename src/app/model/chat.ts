import { Identified, Ref } from './base';

export class Chat extends Identified<string> {

  name: string = '';
  participants: Array<Participant> = [];

}

export class Participant extends Identified<string> {

  name: string = '';
  email: string = '';

}

export class Message extends Identified<string> {

  chat!: Ref<string, Chat>;
  author!: Ref<string, Participant>;
  text: string = '';
  createdAt!: Date;

}
