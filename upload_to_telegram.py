import os
import json
import time
import requests
from pathlib import Path

# ========== КОНФИГУРАЦИЯ ==========
BOT_TOKEN = "8962920453:AAGnLRDGE8Lmr6TCJscdi828F_sczkdYGwM"
CHAT_ID = "-3985743659"

LOCAL_GIFS_DIR = Path('H:/gifpleasure_archive/gifs')
METADATA_PATH = Path('public/gifs/metadata-new.json')

# Сколько гифок обрабатывать за один запуск (каждая гифка = 3 файла)
BATCH_SIZE = 1

# Пауза между загрузками файлов (секунды)
PAUSE_BETWEEN_FILES = 2
PAUSE_ON_ERROR = 10
# ==================================

def upload_to_telegram(file_path, retries=3):
    """Загружает файл в Telegram канал, возвращает file_id"""
    url = f"https://api.telegram.org/bot{BOT_TOKEN}/sendDocument"
    
    for attempt in range(retries):
        try:
            with open(file_path, 'rb') as f:
                files = {'document': f}
                data = {'chat_id': CHAT_ID}
                response = requests.post(url, files=files, data=data, timeout=60)
                result = response.json()
                
                if result.get('ok'):
                    return result['result']['document']['file_id']
                else:
                    print(f"    ❌ Ошибка API: {result.get('description')}")
                    return None
        except Exception as e:
            print(f"    ⚠️ Попытка {attempt + 1}/{retries} не удалась: {e}")
            if attempt < retries - 1:
                time.sleep(PAUSE_ON_ERROR)
    return None

def is_gif_uploaded_to_telegram(gif, existing_metadata):
    """Проверяет, есть ли уже file_id для этой гифки в Telegram"""
    for item in existing_metadata:
        if item.get('id') == gif.get('id'):
            urls = item.get('urls', {})
            telegram = urls.get('telegram', {})
            if telegram.get('clean') and telegram.get('wm') and telegram.get('preview'):
                return True
    return False

def load_metadata():
    """Загружает metadata-new.json"""
    if not METADATA_PATH.exists():
        print(f"❌ {METADATA_PATH} не найден!")
        return None
    
    with open(METADATA_PATH, 'r', encoding='utf-8') as f:
        return json.load(f)

def save_metadata(metadata):
    """Сохраняет metadata в файл"""
    with open(METADATA_PATH, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

def main():
    print("=" * 60)
    print("🚀 Загрузка гифок в Telegram (добавление к существующему metadata)")
    print("=" * 60 + "\n")

    # Загружаем metadata
    metadata = load_metadata()
    if metadata is None:
        return
    
    print(f"📄 metadata-new.json содержит {len(metadata)} записей\n")
    
    # Определяем, какие гифки нужно загрузить
    gifs_to_upload = []
    for gif in metadata:
        if not is_gif_uploaded_to_telegram(gif, metadata):
            gifs_to_upload.append(gif)
    
    print(f"📊 Уже загружено в Telegram: {len(metadata) - len(gifs_to_upload)} гифок")
    print(f"📊 Осталось загрузить: {len(gifs_to_upload)} гифок")
    print(f"🎯 За этот запуск будет загружено: {min(BATCH_SIZE, len(gifs_to_upload))} гифок\n")
    
    if len(gifs_to_upload) == 0:
        print("✅ Все гифки уже загружены в Telegram!")
        return
    
    success = 0
    processed = 0
    
    for gif in gifs_to_upload[:BATCH_SIZE]:
        gif_id = gif['id']
        processed += 1
        print(f"[{processed}/{min(BATCH_SIZE, len(gifs_to_upload))}] Обработка: {gif_id}")
        
        # Пути к файлам
        clean_file = LOCAL_GIFS_DIR / f"{gif_id}.webp"
        wm_file = LOCAL_GIFS_DIR / f"{gif_id}_wm.webp"
        preview_file = LOCAL_GIFS_DIR / f"{gif_id}_preview.webp"
        
        if not clean_file.exists():
            print(f"    ❌ Локальный файл не найден: {clean_file}")
            continue
        
        telegram_ids = {}
        
        # Загружаем clean
        print(f"    ⬆️ Загрузка clean...")
        file_id = upload_to_telegram(clean_file)
        if file_id:
            telegram_ids['clean'] = file_id
            print(f"    ✅ clean -> {file_id[:30]}...")
        else:
            print(f"    ❌ clean не удалось")
            continue
        time.sleep(PAUSE_BETWEEN_FILES)
        
        # Загружаем wm
        if wm_file.exists():
            print(f"    ⬆️ Загрузка wm...")
            file_id = upload_to_telegram(wm_file)
            if file_id:
                telegram_ids['wm'] = file_id
                print(f"    ✅ wm -> {file_id[:30]}...")
            else:
                print(f"    ❌ wm не удалось")
        time.sleep(PAUSE_BETWEEN_FILES)
        
        # Загружаем preview
        if preview_file.exists():
            print(f"    ⬆️ Загрузка preview...")
            file_id = upload_to_telegram(preview_file)
            if file_id:
                telegram_ids['preview'] = file_id
                print(f"    ✅ preview -> {file_id[:30]}...")
            else:
                print(f"    ❌ preview не удалось")
        time.sleep(PAUSE_BETWEEN_FILES)
        
        # Обновляем metadata
        for item in metadata:
            if item['id'] == gif_id:
                if 'urls' not in item:
                    item['urls'] = {}
                item['urls']['telegram'] = telegram_ids
                break
        
        # Сохраняем после каждой гифки
        save_metadata(metadata)
        success += 1
        print(f"    💾 Сохранено ({success} успешно)\n")
    
    print("=" * 60)
    print(f"✅ Готово за этот запуск!")
    print(f"📊 Загружено гифок: {success}")
    print(f"📊 Осталось: {len(gifs_to_upload) - success}")
    print(f"📄 Файл metadata-new.json обновлён")
    print(f"\n💡 Запусти скрипт ещё раз, чтобы продолжить.")
    print("=" * 60)

if __name__ == '__main__':
    main()