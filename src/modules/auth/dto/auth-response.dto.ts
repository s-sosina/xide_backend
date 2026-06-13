class UserResponseDto {
  id: string;
  email: string;
  role: string;
}

class EmployerResponseDto {
  id: string;
  organizationName: string;
  verificationStatus: string;
}

export class AuthResponseDto {
  accessToken: string;
  user: UserResponseDto;
  employer: EmployerResponseDto;
}
