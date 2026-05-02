import os
import ssl
import boto3
import urllib3
from botocore.client import Config

# Отключаем предупреждение о небезопасном HTTPS-запросе
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# ===== НАСТРОЙКИ (ЗАПОЛНИ СВОИМИ ДАННЫМИ) =====
ACCESS_KEY = "9d4278b9affd4e7e99e69d76c73efecf"
SECRET_KEY = "54ca48f8bb6240aab20304cd96b84d3b"
ENDPOINT = "https://s3.ru-3.storage.selcloud.ru"
BUCKET_NAME = "gifpleasure-storage"
LOCAL_FOLDER = "H:/Frontend/gifpleasure/public/gifs"
# ===============================================

# Отключаем проверку SSL (только для загрузки!)
ssl._create_default_https_context = ssl._create_unverified_context

# Инициализация клиента с отключенной проверкой SSL
session = boto3.session.Session()
s3 = session.client(
    "s3",
    endpoint_url=ENDPOINT,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="ru-3",
    config=Config(signature_version="s3v4"),
    verify=False,  # ← verify передаётся здесь, а не в Config
)

# Обходим все файлы в папке
for root, dirs, files in os.walk(LOCAL_FOLDER):
    for file in files:
        # Пропускаем metadata.json
        if file == "metadata.json":
            print(f"Skipping: {file}")
            continue

        local_path = os.path.join(root, file)
        relative_path = os.path.relpath(local_path, LOCAL_FOLDER)
        object_key = relative_path.replace("\\", "/")

        print(f"Uploading: {object_key}")

        try:
            s3.upload_file(
                local_path,
                BUCKET_NAME,
                object_key,
                ExtraArgs={"ACL": "public-read", "ContentType": "image/webp"},
            )
            public_url = f"{ENDPOINT}/{BUCKET_NAME}/{object_key}"
            print(f"  -> {public_url}")
        except Exception as e:
            print(f"  -> Ошибка: {e}")

print("\n✅ Все файлы загружены!")