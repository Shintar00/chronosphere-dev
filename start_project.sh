#!/bin/bash
echo "クロノスフィアプロジェクトを起動します..."

echo "Python仮想環境をセットアップしています..."
python3 -m venv venv
source venv/bin/activate

echo "依存関係をインストールしています..."
pip install --no-cache-dir -r requirements.txt

echo "バックエンドを起動中..."
gnome-terminal -- bash -c "cd '$(dirname "$0")' && source venv/bin/activate && python app.py; exec bash"

echo "フロントエンドを起動中..."
gnome-terminal -- bash -c "cd '$(dirname "$0")' && npm install && npm run dev; exec bash"

echo "ブラウザを開いています..."
sleep 5
xdg-open http://localhost:5173

echo "クロノスフィアの準備が整いました！"