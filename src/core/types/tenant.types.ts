import { FastifyRequest } from 'fastify';

export interface TenantContext {
  tenantId: string;
  tenantName?: string;
  plan?: string;
}

export interface UserContext {
  id: string;
  email: string;
  role: string;
  tenantId: string;
}

export interface TenantRequest extends FastifyRequest {
  tenant?: TenantContext;
  userContext?: UserContext;
}
