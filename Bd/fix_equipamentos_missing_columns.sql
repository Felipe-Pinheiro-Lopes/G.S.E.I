-- Script manual para corrigir o schema do banco remoto (GESI)
-- Execute isso diretamente no PostgreSQL remoto (via pgAdmin, DBeaver, psql, etc.)

ALTER TABLE "Equipamentos"
    ADD COLUMN IF NOT EXISTS "AprovadoPor" text NULL;

ALTER TABLE "Equipamentos"
    ADD COLUMN IF NOT EXISTS "LaudoDescarte" text NULL;

-- Confirmação (opcional)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'Equipamentos'
  AND column_name IN ('AprovadoPor', 'LaudoDescarte');
