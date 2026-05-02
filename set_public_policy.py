import boto3
import json
from botocore.client import Config

# ===== НАСТРОЙКИ (ЗАПОЛНИ СВОИМИ ДАННЫМИ) =====
ACCESS_KEY = "9d4278b9affd4e7e99e69d76c73efecf"
SECRET_KEY = "54ca48f8bb6240aab20304cd96b84d3b"
ENDPOINT = "https://s3.ru-3.storage.selcloud.ru"
BUCKET_NAME = "gifpleasure-storage"
# ===============================================

# Инициализация клиента
session = boto3.session.Session()
s3 = session.client(
    "s3",
    endpoint_url=ENDPOINT,
    aws_access_key_id=ACCESS_KEY,
    aws_secret_access_key=SECRET_KEY,
    region_name="ru-3",
    config=Config(signature_version="s3v4"),
    verify=False,
)

# Политика публичного доступа (чтение для всех)
bucket_policy = {
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": "*",
            "Action": "s3:GetObject",
            "Resource": f"arn:aws:s3:::{BUCKET_NAME}/*"
        }
    ]
}

print("Применяем политику публичного доступа к бакету...")

try:
    s3.put_bucket_policy(Bucket=BUCKET_NAME, Policy=json.dumps(bucket_policy))
    print("✅ Публичный доступ к бакету успешно включён!")
    print("Теперь проверь ссылку на любую гифку в браузере — она должна открываться.")
except Exception as e:
    print(f"⚠️ Ошибка: {e}")
    print("Проверь, что у твоего ключа (Access Key) есть права на s3:PutBucketPolicy")