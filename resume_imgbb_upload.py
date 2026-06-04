import os
import json
import time
import requests
from pathlib import Path

# ========== КОНФИГУРАЦИЯ ==========
IMGBB_API_KEY = "57c1f62b36d66dae17eb2842903c6b01"
IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"

LOCAL_GIFS_DIR = Path('H:/gifpleasure_archive/gifs')
METADATA_INPUT = Path('public/gifs/metadata.json')
METADATA_OUTPUT = Path('public/gifs/metadata-new.json')

# Сколько гифок обрабатывать за один запуск (каждая гифка = 3 файла)
BATCH_SIZE = 50

# Пауза между загрузками файлов (секунды)
PAUSE_BETWEEN_FILES = 2
PAUSE_ON_ERROR = 5
# ==================================

def upload_to_imgbb(file_path, retries=3):
    """Загружает файл на ImgBB, возвращает URL"""
    for attempt in range(retries):
        try:
            with open(file_path, 'rb') as f:
                files = {'image': f}
                data = {'key': IMGBB_API_KEY}
                response = requests.post(IMGBB_UPLOAD_URL, files=files, data=data, timeout=60)
                result = response.json()
                if result.get('status') == 200:
                    return result.get('data', {}).get('url')
                else:
                    print(f"    ❌ Ошибка API: {result.get('status')} - {result.get('error', {}).get('message')}")
                    return None
        except Exception as e:
            print(f"    ⚠️ Попытка {attempt + 1}/{retries} не удалась: {e}")
            if attempt < retries - 1:
                time.sleep(PAUSE_ON_ERROR)
    return None

def is_gif_fully_uploaded(gif_id, existing_metadata):
    """Проверяет, загружена ли гифка полностью (все 3 файла) в ImgBB"""
    for item in existing_metadata:
        if item.get('id') == gif_id:
            urls = item.get('urls', {})
            imgbb = urls.get('imgbb', {})
            # Проверяем наличие всех трёх файлов
            if imgbb.get('clean') and imgbb.get('wm') and imgbb.get('preview'):
                return True
    return False

def load_or_create_metadata():
    """Загружает существующий metadata-new.json или создаёт пустой"""
    if METADATA_OUTPUT.exists():
        with open(METADATA_OUTPUT, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"📄 Загружен существующий metadata-new.json с {len(data)} записями")
            return data
    else:
        print("⚠️ metadata-new.json не найден. Создаю новый.")
        return []

def save_metadata(metadata):
    """Сохраняет metadata в файл"""
    with open(METADATA_OUTPUT, 'w', encoding='utf-8') as f:
        json.dump(metadata, f, indent=2, ensure_ascii=False)

def main():
    print("=" * 60)
    print("🚀 Дозагрузка гифок на ImgBB с сохранением прогресса")
    print("=" * 60 + "\n")

    # Загружаем существующий metadata-new.json
    existing_metadata = load_or_create_metadata()

    # Загружаем оригинальный metadata.json
    if not METADATA_INPUT.exists():
        print(f"❌ metadata.json не найден: {METADATA_INPUT}")
        return

    with open(METADATA_INPUT, 'r', encoding='utf-8') as f:
        original_metadata = json.load(f)
    print(f"📄 Оригинальный metadata.json содержит {len(original_metadata)} гифок\n")

    # Определяем, какие гифки нужно обработать
    gifs_to_process = []
    for gif in original_metadata:
        gif_id = gif['id']
        if not is_gif_fully_uploaded(gif_id, existing_metadata):
            gifs_to_process.append(gif)

    print(f"📊 Уже полностью загружено: {len(original_metadata) - len(gifs_to_process)} гифок")
    print(f"📊 Осталось загрузить: {len(gifs_to_process)} гифок")
    print(f"🎯 За этот запуск будет загружено: {min(BATCH_SIZE, len(gifs_to_process))} гифок\n")

    if len(gifs_to_process) == 0:
        print("✅ Все гифки уже загружены! Завершаю.")
        return

    # Обрабатываем только BATCH_SIZE гифок
    processed = 0
    success = 0
    failed = []

    for gif in gifs_to_process[:BATCH_SIZE]:
        gif_id = gif['id']
        processed += 1
        print(f"[{processed}/{min(BATCH_SIZE, len(gifs_to_process))}] Обработка: {gif_id}")

        # Пути к файлам
        clean_file = LOCAL_GIFS_DIR / f"{gif_id}.webp"
        wm_file = LOCAL_GIFS_DIR / f"{gif_id}_wm.webp"
        preview_file = LOCAL_GIFS_DIR / f"{gif_id}_preview.webp"

        if not clean_file.exists():
            print(f"    ❌ Локальный файл не найден: {clean_file}")
            failed.append(gif_id)
            continue

        # Структура для хранения ссылок
        imgbb_urls = {}

        # Загружаем чистую гифку
        print(f"    ⬆️ Загрузка clean...")
        imgbb_clean = upload_to_imgbb(clean_file)
        if imgbb_clean:
            imgbb_urls['clean'] = imgbb_clean
            print(f"    ✅ clean -> {imgbb_clean[:60]}...")
        else:
            print(f"    ❌ clean не удалось")
            failed.append(gif_id)
            continue
        time.sleep(PAUSE_BETWEEN_FILES)

        # Загружаем WM (с водяным знаком)
        if wm_file.exists():
            print(f"    ⬆️ Загрузка wm...")
            imgbb_wm = upload_to_imgbb(wm_file)
            if imgbb_wm:
                imgbb_urls['wm'] = imgbb_wm
                print(f"    ✅ wm -> {imgbb_wm[:60]}...")
            else:
                print(f"    ❌ wm не удалось")
        time.sleep(PAUSE_BETWEEN_FILES)

        # Загружаем PREVIEW
        if preview_file.exists():
            print(f"    ⬆️ Загрузка preview...")
            imgbb_preview = upload_to_imgbb(preview_file)
            if imgbb_preview:
                imgbb_urls['preview'] = imgbb_preview
                print(f"    ✅ preview -> {imgbb_preview[:60]}...")
            else:
                print(f"    ❌ preview не удалось")
        time.sleep(PAUSE_BETWEEN_FILES)

        # Формируем запись для metadata
        new_entry = gif.copy()
        if 'urls' not in new_entry:
            new_entry['urls'] = {}
        new_entry['urls']['imgbb'] = imgbb_urls
        new_entry['urls']['selectel'] = {
            'clean': f"https://gifpleasure-storage.selstorage.ru/webp/{gif_id}.webp",
            'wm': f"https://gifpleasure-storage.selstorage.ru/webp/{gif_id}_wm.webp",
            'preview': f"https://gifpleasure-storage.selstorage.ru/preview/{gif_id}_preview.webp"
        }

        # Обновляем existing_metadata (заменяем старую запись или добавляем новую)
        found = False
        for i, item in enumerate(existing_metadata):
            if item.get('id') == gif_id:
                existing_metadata[i] = new_entry
                found = True
                break
        if not found:
            existing_metadata.append(new_entry)

        success += 1
        print(f"    💾 Сохраняю прогресс...")

        # СОХРАНЯЕМ ПОСЛЕ КАЖДОЙ ГИФКИ (это самое важное!)
        save_metadata(existing_metadata)
        print()

    # Финальная статистика
    print("=" * 60)
    print("✅ Готово за этот запуск!")
    print(f"📊 Загружено гифок: {success}")
    print(f"❌ Не загружено: {len(failed)}")
    if failed:
        print(f"   Список: {failed[:10]}{'...' if len(failed) > 10 else ''}")
    print(f"📄 Файл metadata-new.json сохранён: {METADATA_OUTPUT}")
    print(f"\n💡 Осталось загрузить: {len(gifs_to_process) - success} гифок")
    print(f"💡 Запусти скрипт ещё раз, чтобы продолжить.")
    print("=" * 60)

if __name__ == '__main__':
    main()