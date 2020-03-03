import { UserRole } from '../model/user-role.enum';

export interface JwtPayload {
  username: string;
  role: UserRole;
}
