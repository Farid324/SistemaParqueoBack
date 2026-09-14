export interface StoredRefreshToken {
  id: string;
  tokenHash: string;
  userId: string;
  expiresAt: Date;
  revokedAt: Date | null;
}

export interface IRefreshTokenRepository {
  create(data: { userId: string; tokenHash: string; expiresAt: Date }): Promise<void>;
  findByTokenHash(tokenHash: string): Promise<StoredRefreshToken | null>;
  revoke(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}

export const IRefreshTokenRepository = Symbol('IRefreshTokenRepository');
