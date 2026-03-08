import { FastifyRequest, FastifyReply } from 'fastify';
import { TenantRequest } from '../types/tenant.types';
import { ResponseUtil } from '../utils/response.util';
import { t } from '../i18n';

export async function authMiddleware(request: FastifyRequest, reply: FastifyReply): Promise<void> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    await (request as any).jwtVerify();

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded = (request as any).user;
    const tenantRequest = request as TenantRequest;

    tenantRequest.userContext = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      tenantId: decoded.tenantId,
    };

    // Ensure tenant context matches user's tenant
    if (tenantRequest.tenant && tenantRequest.tenant.tenantId !== decoded.tenantId) {
      return ResponseUtil.forbidden(reply, t('common.forbidden'));
    }

    // Set tenant from user if not already set
    if (!tenantRequest.tenant) {
      tenantRequest.tenant = {
        tenantId: decoded.tenantId,
      };
    }
  } catch {
    return ResponseUtil.unauthorized(reply, t('auth.tokenInvalid'));
  }
}
