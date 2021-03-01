# scripts/restart_server
echo '======================'
echo 'Running restart_server'
echo '======================'

cd /home/ec2-user/app/dist/CowCat_Node/
source /home/ec2-user/.bash_profile
npx pm2 reload ecosystem.config.cjs --env production &
