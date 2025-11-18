package in.dipr.library.dtos;

import in.dipr.library.enums.UserStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserStatusUpdateDTO {

    @NotNull(message = "User status is required")
    private UserStatus userStatus;

    private String reason;
}
