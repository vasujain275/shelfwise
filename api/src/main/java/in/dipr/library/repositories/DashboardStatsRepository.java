package in.dipr.library.repositories;

import in.dipr.library.models.DashboardStats;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * Repository for {@link DashboardStats} entity.
 */
@Repository
public interface DashboardStatsRepository extends JpaRepository<DashboardStats, String> {
}
