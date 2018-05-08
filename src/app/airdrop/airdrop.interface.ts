import {User} from '../user/user';

export interface IAirdropUser {
  id: string;
  username: string;
}

export interface IAirdropHolder {
  id: string;
  username: string;
  created?: Date;
}

interface Participants {
  [key: string]: boolean;
}

export interface IAirdrop {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  description?: string;
  projectLink: string;
  creator: IAirdropUser;
  holder?: IAirdropHolder;
  currentReferral: string;
  referrals?: string;
  state: number;
  active: boolean;
  participants: Participants;
}


export interface IReferral {
  createdAt?: Date;
  updatedAt?: Date;
  user: IAirdropUser;
  link: string;
  state: number;
}

export interface IAirdropDialogData {
  airdrop: IAirdrop;
  user: User;
  id: string;
}
export interface IAirdropEditDialogData {
  airdrop: IAirdrop;
  id: string;
}
