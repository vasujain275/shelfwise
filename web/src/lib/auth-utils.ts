
export const getDashboardPath = (userRole: string): string => {
  switch (userRole) {
    case "SUPER_ADMIN":
      return "/dashboard/super-admin";
    case "ADMIN":
      return "/dashboard/admin";
    case "MEMBER":
      return "/dashboard/member";
    default:
      return "/dashboard/member";
  }
};
