import { Rol } from '@prisma/client';

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: Rol;
  organizationId: string | null;
}
