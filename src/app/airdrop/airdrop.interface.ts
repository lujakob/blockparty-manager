export interface IAirdropUser {
  id: string;
  username: string;
}

export interface IAirdropItem {
  createdAt?: Date;
  updatedAt?: Date;
  title: string;
  projectLink: string;
  creator: IAirdropUser;
  holder?: IAirdropUser;
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

