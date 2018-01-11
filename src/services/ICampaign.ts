interface ICampaign {
    UserId?: number;
    Period?: number;
    CampType?: number;
    StartDate?: Date;
    EndDate?: Date;
    TargetCallSale?: number;
    TargetMetting?: number;
    TargetPresentation?: number;
    TargetContractSale?: number;
    CommissionRate?: number;
    CaseSize?: number;
    IncomeMonthly?: number;
    CurrentCallSale?: number;
    CurrentMetting: number;
    CurrentPresentation: number;
    CurrentContract: number;
    TargetCallReCruit: number;
    TargetSurvey: number;
    TargetPamphlet: number;
    TargetCop: number;
    TargetTest: number;
    TargetInterview: number;
    TargetMit: number;
    TargetAgentCode: number;
    Description: string;
    CurrentCallRecruit: number;
    CurrentSurvey: number;
    CurrentPamphlet: number;
    CurrentCop: number;
    CurrentTest: number;
    CurrentInterview: number;
    CurrentMit: number;
    CurentTer: number;
    AgentTer: number;
    ActiveRaito: number;
    M3AARaito: number;
    AverageCC: number;
    M3AA: number;
    FypRaito: number;
    Results: number;
    ReportTo: number;
    ReportToList: string;
}

interface ICampTotal {
    UserId: number;
    TargetCallSale: number;
    TargetMetting: number;
    TargetPresentation: number;
    TargetContractSale: number;
    // IncomeMonthly: 0,
    CurrentCallSale: number;
    CurrentMetting: number;
    CurrentPresentation: number;
    CurrentContract: number;
    StartDate: Date;
    EndDate: Date;
}
export { ICampaign, ICampTotal };