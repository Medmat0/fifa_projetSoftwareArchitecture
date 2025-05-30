import { describe, it, expect, vi, afterEach } from 'vitest';
import * as authService from './auth.service.js';

vi.mock('@prisma/client', () => {
    const mPrisma = {
        user: {
            findUnique: vi.fn(),
        }
    };
    return { PrismaClient: vi.fn(() => mPrisma) };
});
vi.mock('../../core/hashPassword.js', () => ({
    comparePassword: vi.fn()
}));
vi.mock('../../core/tokenJWT.js', () => ({
    createAccessToken: vi.fn(),
    createRefreshToken: vi.fn(),
    verifyAccessToken: vi.fn()
}));

const { PrismaClient } = await import('@prisma/client');
const prisma = new PrismaClient();
const { comparePassword } = await import('../../core/hashPassword.js');
const { createAccessToken, createRefreshToken, verifyAccessToken } = await import('../../core/tokenJWT.js');

describe('auth.service', () => {
    afterEach(() => {
        vi.clearAllMocks();
    });

    describe('loginUserService', () => {
        it('retourne 400 si utilisateur non trouvé', async () => {
            prisma.user.findUnique.mockResolvedValue(null);
            const res = { cookie: vi.fn() };
            const result = await authService.loginUserService('a@mail.com', 'pass', res);
            expect(result.status).toBe(400);
        });

        it('retourne 400 si mot de passe invalide', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@mail.com', password: 'hash' });
            comparePassword.mockResolvedValue(false);
            const res = { cookie: vi.fn() };
            const result = await authService.loginUserService('a@mail.com', 'wrong', res);
            expect(result.status).toBe(400);
        });

        it('retourne 200 et set cookies si login ok', async () => {
            prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@mail.com', password: 'hash', role: 'EMPLOYEE' });
            comparePassword.mockResolvedValue(true);
            createAccessToken.mockResolvedValue('access');
            createRefreshToken.mockResolvedValue('refresh');
            const res = { cookie: vi.fn() };
            const result = await authService.loginUserService('a@mail.com', 'pass', res);
            expect(result.status).toBe(200);
            expect(res.cookie).toHaveBeenCalledTimes(2);
            expect(result.data.user).toMatchObject({ id: 1, email: 'a@mail.com', role: 'EMPLOYEE' });
        });
    });

    describe('logoutUserService', () => {
        it('clear les cookies et retourne 200', async () => {
            const res = { clearCookie: vi.fn() };
            const req = {};
            const result = await authService.logoutUserService(req, res);
            expect(res.clearCookie).toHaveBeenCalledWith('refreshToken');
            expect(res.clearCookie).toHaveBeenCalledWith('accessToken');
            expect(result.status).toBe(200);
        });
    });

    describe('checkAuthStatusService', () => {
        it('retourne non authentifié si pas de tokens', async () => {
            const result = await authService.checkAuthStatusService(null, null);
            expect(result.data.authenticated).toBe(false);
        });

        it('retourne authentifié si token valide et user trouvé', async () => {
            verifyAccessToken.mockResolvedValue({ id: 1 });
            prisma.user.findUnique.mockResolvedValue({ id: 1, email: 'a@mail.com' });
            const result = await authService.checkAuthStatusService('access', 'refresh');
            expect(result.data.authenticated).toBe(true);
            expect(result.data.utilisateur).toMatchObject({ id: 1 });
        });

        it('retourne non authentifié si token invalide', async () => {
            verifyAccessToken.mockRejectedValue(new Error('invalid'));
            const result = await authService.checkAuthStatusService('bad', 'refresh');
            expect(result.data.authenticated).toBe(false);
        });

        it('retourne non authentifié si user non trouvé', async () => {
            verifyAccessToken.mockResolvedValue({ id: 2 });
            prisma.user.findUnique.mockResolvedValue(null);
            const result = await authService.checkAuthStatusService('access', 'refresh');
            expect(result.data.authenticated).toBe(false);
        });
    });

    describe('checkRoleService', () => {
        it('retourne non authentifié si pas de tokens', async () => {
            const result = await authService.checkRoleService(null, null);
            expect(result.data.authenticated).toBe(false);
        });

        it('retourne le rôle si token valide et user trouvé', async () => {
            verifyAccessToken.mockResolvedValue({ id: 1 });
            prisma.user.findUnique.mockResolvedValue({ id: 1, role: 'MANAGER' });
            const result = await authService.checkRoleService('access', 'refresh');
            expect(result.data.authenticated).toBe(true);
            expect(result.data.role).toBe('MANAGER');
        });

        it('retourne non authentifié si user non trouvé', async () => {
            verifyAccessToken.mockResolvedValue({ id: 2 });
            prisma.user.findUnique.mockResolvedValue(null);
            const result = await authService.checkRoleService('access', 'refresh');
            expect(result.data.authenticated).toBe(false);
        });

        it('retourne non authentifié si token invalide', async () => {
            verifyAccessToken.mockRejectedValue(new Error('invalid'));
            const result = await authService.checkRoleService('bad', 'refresh');
            expect(result.data.authenticated).toBe(false);
        });
    });
});