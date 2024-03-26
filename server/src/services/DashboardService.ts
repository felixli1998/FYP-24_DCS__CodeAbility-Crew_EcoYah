import { DashboardRepository } from "../repositories/DashboardRepository";

export class DashboardService {
  private dashboardRepository: DashboardRepository;

  constructor(dashboardRepository: DashboardRepository) {
    this.dashboardRepository = dashboardRepository;
  }

  async getPopularEvent() {
    return this.dashboardRepository.getPopularEvent();
  }

  async getPopularItem() {
    return this.dashboardRepository.getPopularItem();
  }

  async getDonationRequests() {
    return this.dashboardRepository.getDonationRequests();
  }

  async getEventsByMonth(month: string) {
    return this.dashboardRepository.getEventsByMonth(month);
  }

  async getItemsByMonth(month: string) {
    return this.dashboardRepository.getItemsByMonth(month);
  }

  async getPreferredDropOff() {
    return this.dashboardRepository.getPreferredDropOff();
  }

  async getCashbackStatus() {
    return this.dashboardRepository.getCashbackStatus();
  }

  async getRedeemedCashback(startDate: Date, endDate: Date) {
    return this.dashboardRepository.getRedeemedCashback(startDate, endDate);
  }
}
