#!/bin/bash
echo "Fixing permissions and restarting bot..."
sudo rm -rf /home/ubuntu/.auth_new_v3
pm2 delete whatsapp-bot || true
pm2 start index.js --name whatsapp-bot --time
echo "Waiting for QR code..."
sleep 5
pm2 logs whatsapp-bot --lines 100 --nostream
