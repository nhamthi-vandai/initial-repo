import { FastifyRequest, FastifyReply } from 'fastify';
import { TenantRequest } from '../types/tenant.types';
import { ResponseUtil } from '../utils/response.util';
import { t } from '../i18n';

export async function tenantMiddleware(
  request: FastifyRequest,
  reply: FastifyReply,
): Promise<void> {
  const tenantRequest = request as TenantRequest;

  // Extract tenant ID from header, subdomain, or query parameter
  const tenantId =
    (request.headers['x-tenant-id'] as string) ||
    ((request.query as any)?.tenantId as string) ||
    extractTenantFromSubdomain(request.hostname);

  if (!tenantId) {
    return ResponseUtil.badRequest(reply, t('tenant.required'));
  }

  // Set tenant context
  tenantRequest.tenant = {
    tenantId,
  };
}

function extractTenantFromSubdomain(hostname: string): string | undefined {
  // Extract tenant from subdomain (e.g., tenant1.example.com -> tenant1)
  const parts = hostname.split('.');
  if (parts.length > 2) {
    return parts[0];
  }
  return undefined;
}

export async function optionalTenantMiddleware(
  request: FastifyRequest,
  _reply: FastifyReply,
): Promise<void> {
  const tenantRequest = request as TenantRequest;

  const tenantId =
    (request.headers['x-tenant-id'] as string) ||
    ((request.query as any)?.tenantId as string) ||
    extractTenantFromSubdomain(request.hostname);

  if (tenantId) {
    tenantRequest.tenant = {
      tenantId,
    };
  }
}
