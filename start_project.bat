@echo off
echo クロノスフィアプロジェクトを起動します...

echo Python仮想環境をセットアップしています...
python -m venv venv
call venv\Scripts\activate

echo 依存関係をインストールしています...
pip install --no-cache-dir -r requirements.txt

echo バックエンドを起動中...
start cmd /k "cd /d %~dp0 && call venv\Scripts\activate && python app.py"

echo フロントエンドを起動中...
start cmd /k "cd /d %~dp0 && npm install && npm run dev"

echo クロノスフィアの準備が整いました！
echo ブラウザで http://localhost:5173 にアクセスしてください。
pause