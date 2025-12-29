package me.vasujain.shelfwise.services.impl;

import me.vasujain.shelfwise.services.DashboardService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DashboardStatsSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(DashboardStatsSeeder.class);

    private final DashboardService dashboardService;

    public DashboardStatsSeeder(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @Override
    public void run(String... args) throws Exception {
        log.info("Updating dashboard stats on application startup...");
        dashboardService.updateDashboardStats();
        log.info("Dashboard stats updated successfully on startup.");
    }
}
