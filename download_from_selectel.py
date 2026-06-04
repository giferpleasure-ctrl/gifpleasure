import os
import json
import ssl
import urllib3
import boto3
from botocore.client import Config
from dotenv import load_dotenv
from pathlib import Path

# Отключаем предупреждения о небезопасном соединении
urllib3.disable_warnings(urllib3.exceptions.InsecureRequestWarning)

# Загружаем переменные из .env.local
load_dotenv('.env.local')

# Конфигурация Selectel с отключённой проверкой SSL
s3 = boto3.client(
    's3',
    endpoint_url=os.getenv('SELECTEL_ENDPOINT', 'https://s3.ru-3.storage.selcloud.ru'),
    aws_access_key_id=os.getenv('SELECTEL_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('SELECTEL_SECRET_ACCESS_KEY'),
    region_name='ru-3',
    verify=False  # ← ОТКЛЮЧАЕМ ПРОВЕРКУ SSL (только для локального использования)
)

BUCKET = os.getenv('SELECTEL_BUCKET', 'gifpleasure-storage')

# Пути
METADATA_PATH = Path('public/gifs/metadata.json')
OUTPUT_DIR = Path('H:/gifpleasure_archive/gifs')

# Создаём папку назначения, если её нет
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)

def download_file(key, output_path):
    """Скачивает файл из Selectel"""
    try:
        s3.download_file(BUCKET, key, str(output_path))
        print(f'✅ {key} -> {output_path.name}')
        return True
    except Exception as e:
        print(f'❌ Ошибка {key}: {e}')
        return False

def main():
    print('🚀 Начинаем скачивание файлов с Selectel...\n')

    # Проверяем, существует ли metadata.json
    if not METADATA_PATH.exists():
        print(f'❌ metadata.json не найден по пути: {METADATA_PATH}')
        return

    # Читаем metadata.json
    with open(METADATA_PATH, 'r', encoding='utf-8') as f:
        metadata = json.load(f)

    print(f'📄 Найдено {len(metadata)} гифок\n')

    success_count = 0
    fail_count = 0

    for i, gif in enumerate(metadata, 1):
        gif_id = gif['id']
        print(f'[{i}/{len(metadata)}] Обработка: {gif_id}')

        files = [
            (f'webp/{gif_id}.webp', OUTPUT_DIR / f'{gif_id}.webp'),
            (f'webp/{gif_id}_wm.webp', OUTPUT_DIR / f'{gif_id}_wm.webp'),
            (f'preview/{gif_id}_preview.webp', OUTPUT_DIR / f'{gif_id}_preview.webp'),
        ]

        for key, output_path in files:
            if download_file(key, output_path):
                success_count += 1
            else:
                fail_count += 1

        print()  # пустая строка для разделения

    print('✅ Готово!')
    print(f'📊 Успешно скачано: {success_count} файлов')
    print(f'❌ Ошибок: {fail_count} файлов')

if __name__ == '__main__':
    main()