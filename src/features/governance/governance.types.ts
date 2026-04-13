export interface GovernanceStage {
  id: string;
  stageNumber: number;
  userId: string;
  userName: string;
  userRole: string;
}

export interface RegionGovernance {
  regionId: string;
  regionName: string;
  stages: GovernanceStage[];
}

export interface GovernanceUser {
  id: string;
  name: string;
  role: string;
}
