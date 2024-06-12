import { User } from '../user';

export interface Chat {
    id: number;
    type: ChatType;
    messages: Message[];
    members: User[];
    groupChat?: GroupChat | null;
}

export interface Message {
    id: number;
    content: string;
    timestamp: Date;
    senderId: number;
    sender: User;
    chatId: number;
    chat: Chat;
}

export interface GroupChat {
    id: number;
    name: string;
    chatId: number;
    chat: Chat;
    members: GroupMember[];
}

export interface GroupMember {
    id: number;
    userId: number;
    user: User;
    groupId: number;
    group: GroupChat;
}

export enum ChatType {
    ONE_TO_ONE = 'ONE_TO_ONE',
    GROUP = 'GROUP'
}
