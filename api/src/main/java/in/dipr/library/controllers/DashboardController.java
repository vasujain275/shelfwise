package in.dipr.library.controllers;

import in.dipr.library.dtos.AdminDashboardDTO;
import in.dipr.library.dtos.MemberDashboardDTO;
import in.dipr.library.models.User;
import in.dipr.library.response.CustomApiResponse;
import in.dipr.library.response.ResponseUtil;
import in.dipr.library.services.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
@Tag(name = "Dashboard", description = "Endpoints for dashboard statistics.")
@SecurityRequirement(name = "bearerAuth")
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/admin")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(
            summary = "Get Admin Dashboard Statistics",
            description = "Returns dashboard statistics for Admin and Super Admin users, including system-wide metrics.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Admin dashboard data retrieved successfully.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = AdminDashboardDTO.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    public ResponseEntity<CustomApiResponse<AdminDashboardDTO>> getAdminDashboard() {
        AdminDashboardDTO adminDashboard = dashboardService.getAdminDashboard();
        return ResponseUtil.ok(adminDashboard, "Admin dashboard data retrieved successfully.");
    }

    @GetMapping("/member")
    @PreAuthorize("hasRole('MEMBER')")
    @Operation(
            summary = "Get Member Dashboard Statistics",
            description = "Returns dashboard statistics for a Member user, including personal borrowing history and status.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Member dashboard data retrieved successfully.",
                            content = @Content(
                                    mediaType = "application/json",
                                    schema = @Schema(implementation = MemberDashboardDTO.class)
                            )
                    ),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    public ResponseEntity<CustomApiResponse<MemberDashboardDTO>> getMemberDashboard(@AuthenticationPrincipal User user) {
        MemberDashboardDTO memberDashboard = dashboardService.getMemberDashboard(user);
        return ResponseUtil.ok(memberDashboard, "Member dashboard data retrieved successfully.");
    }

    @GetMapping("/refresh")
    @PreAuthorize("hasAnyRole('ADMIN', 'SUPER_ADMIN')")
    @Operation(
            summary = "Refresh Dashboard Statistics",
            description = "Manually triggers an update of the dashboard statistics. Accessible only by Admin and Super Admin users.",
            responses = {
                    @ApiResponse(
                            responseCode = "200",
                            description = "Dashboard statistics refreshed successfully.",
                            content = @Content(mediaType = "application/json", schema = @Schema(implementation = CustomApiResponse.class))
                    ),
                    @ApiResponse(responseCode = "401", description = "Unauthorized"),
                    @ApiResponse(responseCode = "403", description = "Forbidden")
            }
    )
    public ResponseEntity<CustomApiResponse<Void>> refreshDashboardStats() {
        dashboardService.updateDashboardStats();
        return ResponseUtil.ok(null, "Dashboard statistics refreshed successfully.");
    }
}