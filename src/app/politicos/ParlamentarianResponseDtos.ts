export interface ParliamentarianLawVote {
  id: number;
  law?: any;
  lawStatus?: any;
  parliamentarianId: number;
  parliamentarian?: any;
  lawId: number;
  lawStatusId: number;
}

export interface Law {
  id: number;
  author?: any;
  reviser?: any;
  number: string;
  score: number;
  dateVoting: Date;
  source: string;
  description: string;
  commissionOrigin?: any;
  commissionShort?: any;
  position?: any;
  url?: any;
  category?: any;
  year: number;
  code: number;
  nickname?: any;
  scoreBoard: boolean;
  house: string;
  video?: any;
  authorId?: any;
  reviserId?: any;
  statusId: number;
  counselorLawStatusId: number;
  myRankingTitle?: any;
  myRankingShortDescription?: any;
  myRankingAvailable: boolean;
  status?: any;
  type?: any;
  counselorLawStatus?: any;
  partyLawVotes: any[];
  parliamentarianLawVotes: ParliamentarianLawVote[];
  lawResumes: any[];
}

export interface LawVote {
  id: number;
  law: Law;
  lawStatus?: any;
  parliamentarianId: number;
  lawId: number;
  lawStatusId: number;
}

export interface Ranking {
  id: number;
  parliamentarian?: any;
  parliamentarianId: number;
  year: number;
  scorePresence: number;
  scoreSaveQuota: number;
  scoreProcess: number;
  scoreInternal: number;
  scorePrivileges: number;
  scoreWastage: number;
  scoreTotal: number;
  scoreRanking: number;
  scoreRankingByPosition: number;
  scoreRankingByParty: number;
  scoreRankingByState: number;
  scorePresenceFormula: string;
  scoreProcessFormula: string;
  scorePrivilegesFormula: string;
  scoreSaveQuotaFormula: string;
  scoreWastageFormula: string;
  scoreTotalFormula: string;
  parliamentarianCount: number;
  parliamentarianStateCount: number;
  parliamentarianStaffMaxYear: number;
  parliamentarianQuotaMaxYear: number;
}

export class Parliamentarian {
  id: number;
  status?: number;
  statusId: number;
  state?: any;
  organ?: any;
  party?: any;
  parliamentarianType?: string;
  name: string;
  nickname: string;
  cpf: string;
  photo: string;
  email: string;
  position: string;
  partyElect?: any;
  previousPosition?: any;
  partyAffiliation: string;
  relevantPositions?: any;
  otherInformations: string;
  profession?: any;
  academic?: any;
  dateBirth: Date;
  pollType?: any;
  quantityVote?: any;
  reelected: boolean;
  candidateType?: any;
  candidateNumber?: any;
  code: number;
  enrolment?: any;
  register?: any;
  startExercise?: any;
  endExercise?: any;
  phone: string;
  instagram: string;
  twitter: string;
  facebook: string;
  youtube: string;
  cutAidShift: boolean;
  isPresident: boolean;
  cutHousingAllowance: boolean;
  cutRetirement: boolean;
  requestedFamilyPassport: boolean;
  totalPassportFamilyMembers: number;
  quotaAmountSum: number;
  page?: any;
  stateId: number;
  organId: number;
  partyId: number;
  typeId?: any;
  pollTypeId?: any;
  candidateTypeId?: any;
  lawVotes: LawVote[];
  lawAuthor: any[];
  lawReviser: any[];
  quotas: any[];
  internalScores: any[];
  processes: any[];
  ratings: any[];
  comments: any[];
  commissions: any[];
  assiduityCommissions: any[];
  assiduityPlenaries: any[];
  legislativeMatters: any[];
  newsPapers: any[];
  privileges: any[];
  ranking: Ranking[];
  rankingWinners: any[];
  staffs: any[];
  ballinBallouts: any[];
  // custom
  latestMessage: string;
  latestMessageTime: Date;
  messages: any[];
  latestMessageRead: boolean;
  latestLawStatusId: number;
}

export interface ParliamentarianRanking {
  id: number;
  parliamentarianId: number;
  parliamentarian: Parliamentarian;
  year: number;
  scorePresence: number;
  scoreSaveQuota: number;
  scoreSaveQuotaPercentage: number;
  scoreProcess: number;
  scoreInternal: number;
  scorePrivileges: number;
  scoreWastage: number;
  scoreTotal: number;
  scoreRanking: number;
  scoreRankingByPosition: number;
  scoreRankingByParty: number;
  scoreRankingByState: number;
  scorePresenceFormula: string;
  scoreProcessFormula: string;
  scorePrivilegesFormula: string;
  scoreSaveQuotaFormula: string;
  scoreWastageFormula: string;
  scoreTotalFormula: string;
  parliamentarianCount: number;
  parliamentarianStateCount: number;
  parliamentarianStaffMaxYear: number;
  parliamentarianStaffAmountUsed: number;
  parliamentarianQuotaMaxYear: number;
  parliamentarianQuotaTotal: number;
  active: boolean;
}

export interface StateQuota {
  id: number;
  amount: number;
  year: number;
  stateId: number;
  state?: any;
  organId: number;
  organ?: any;
}

export interface StaffQuota {
  id: number;
  amount: number;
  year: number;
  organId: number;
  organ?: any;
}

export class ParliamentarianDataResponse {
  id: number;
  parliamentarianId: number;
  parliamentarian: Parliamentarian;
  year: number;
  scorePresence: number;
  scoreSaveQuota: number;
  scoreSaveQuotaPercentage: number;
  scoreProcess: number;
  scoreInternal: number;
  scorePrivileges: number;
  scoreWastage: number;
  scoreTotal: number;
  scoreRanking: number;
  scoreRankingByPosition: number;
  scoreRankingByParty: number;
  scoreRankingByState: number;
  scorePresenceFormula: number;
  scoreProcessFormula: number;
  scorePrivilegesFormula: number;
  scoreSaveQuotaFormula: number;
  scoreWastageFormula: number;
  scoreTotalFormula: number;
  parliamentarianCount: number;
  parliamentarianStateCount: number;
  parliamentarianStaffMaxYear: number;
  parliamentarianStaffAmountUsed: number;
  parliamentarianQuotaMaxYear: number;
  parliamentarianQuotaTotal: number;
  active: true;
  parliamentarianRanking: ParliamentarianRanking;
  stateQuota: StateQuota;
  staffQuota: StaffQuota;
}

export class ParliamentarianListResponse {
  success: boolean;
  data: ParliamentarianDataResponse[];
  errors: any[];
  request: Date;
}

export interface ParliamentarianSingleResponse {
  success: boolean;
  data: ParliamentarianDataResponse;
  errors: any[];
}
