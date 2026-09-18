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
  /**
   * Revoca el token solo si sigue activo (revocadoEn === null) de forma atómica,
   * para que dos rotaciones concurrentes con el mismo token no puedan ambas ganar la carrera.
   * Devuelve el token si esta llamada fue la que lo revocó, o null si ya estaba revocado/no existe.
   */
  revokeIfActive(tokenHash: string): Promise<StoredRefreshToken | null>;
  revoke(id: string): Promise<void>;
  revokeAllForUser(userId: string): Promise<void>;
}

export const IRefreshTokenRepository = Symbol('IRefreshTokenRepository');
