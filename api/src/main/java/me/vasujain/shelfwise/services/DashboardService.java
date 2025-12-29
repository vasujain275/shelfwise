package me.vasujain.shelfwise.services;

import me.vasujain.shelfwise.dtos.AdminDashboardDTO;
import me.vasujain.shelfwise.dtos.MemberDashboardDTO;
import me.vasujain.shelfwise.models.User;

public interface DashboardService {

    /**
     * Get dashboard data for an admin user.
     *
     * @return AdminDashboardDTO containing system-wide statistics.
     */
    AdminDashboardDTO getAdminDashboard();

    /**
     * Get dashboard data for a member user.
     *
     * @param user The user for whom to get the dashboard data.
     * @return MemberDashboardDTO containing user-specific statistics.
     */
    MemberDashboardDTO getMemberDashboard(User user);

    /**
     * Scheduled job to update the dashboard statistics.
     */
    void updateDashboardStats();
}
