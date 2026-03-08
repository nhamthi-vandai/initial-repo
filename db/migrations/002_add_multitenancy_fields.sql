-- Add tenant_id, role, and password columns to users table for multitenancy and authentication

-- First, add the new columns
ALTER TABLE users ADD COLUMN IF NOT EXISTS tenant_id VARCHAR(255);
ALTER TABLE users ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'user';
ALTER TABLE users ADD COLUMN IF NOT EXISTS password VARCHAR(255);

-- Add index on tenant_id for better query performance
CREATE INDEX IF NOT EXISTS idx_users_tenant_id ON users(tenant_id);

-- Add composite index for tenant-based queries
CREATE INDEX IF NOT EXISTS idx_users_tenant_email ON users(tenant_id, email);

-- Update existing users to have a default tenant_id (for existing data)
UPDATE users SET tenant_id = 'default' WHERE tenant_id IS NULL;

-- Make tenant_id NOT NULL after setting defaults
ALTER TABLE users ALTER COLUMN tenant_id SET NOT NULL;

-- Add unique constraint on email per tenant
DROP INDEX IF EXISTS users_email_key;
CREATE UNIQUE INDEX users_email_tenant_key ON users(email, tenant_id);
