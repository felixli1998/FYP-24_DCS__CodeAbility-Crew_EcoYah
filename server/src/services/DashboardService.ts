import { DashboardRepository } from "../repositories/DashboardRepository";

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor(dashboardRepository: DashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async getPopularEventToDate() {
    return this.dashboardRepository.getPopularEventToDate();
  }

  async getPopularItemToDate() {
    return this.dashboardRepository.getPopularItemToDate();
  }

  async getEventsByMonth(month: string) {
    return this.dashboardRepository.getEventsByMonth(month);
  }

  async getPreferredDropOff() {
    return this.dashboardRepository.getPreferredDropOff();
  }
}
