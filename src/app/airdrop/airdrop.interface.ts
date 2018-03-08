export interface IAirdropUser {
  id: string;
  username: string;
}

export interface IAirdropHolder {
  id: string;
  username: string;
  created?: Date;
}

export interface IAirdropItem {
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  projectLink: string;
  creator: IAirdropUser;
  holder?: IAirdropHolder;
  currentReferral: string;
  referrals?: string;
  state: number;
}


export interface IReferral {
  createdAt?: Date;
  updatedAt?: Date;
  user: IAirdropUser;
  link: string;
  state: number;
}
