export interface StatCard {
  label: string;
  value: number;
  trend: number;
  trendUnit: string;
  sub: string;
  iconClass: string;
  iconPaths: string[];
  /** false면 trend/sub 영역 자체를 숨김 (활성 유저 카드 등 비교 불필요 카드) */
  showTrend: boolean;
}
