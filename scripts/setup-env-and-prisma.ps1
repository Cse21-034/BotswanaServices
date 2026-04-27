# PowerShell script to create .env and run Prisma db push
$envPath = "./.env"
$envContent = @'
DATABASE_URL="postgresql://postgres.olxfihpifzfziukutcaq:Solodcare@96@aws-1-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.olxfihpifzfziukutcaq:Solodcare@96@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
'@
Set-Content -Path $envPath -Value $envContent -Encoding UTF8

Write-Host ".env file created."

# Run Prisma db push
npx prisma db push --schema=prisma/schema.prisma

# Optionally, run Prisma generate
npx prisma generate --schema=prisma/schema.prisma
