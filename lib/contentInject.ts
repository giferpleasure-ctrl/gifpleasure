export interface InjectItem<T> {
  type: "content";
  data: T;
}

export interface InjectPlaceholder {
  type: "placeholder";
  id: string;
}

export type InjectedItem<T> = InjectItem<T> | InjectPlaceholder;

export function insertEmptyItems<T>(
  items: T[],
  firstPosition: number = 8,
  interval: number = 9,
): InjectedItem<T>[] {
  const result: InjectedItem<T>[] = [];

  for (let i = 0; i < items.length; i++) {
    result.push({ type: "content", data: items[i] });

    const currentLength = result.length;
    // Проверяем: если текущая длина совпадает с позицией для вставки
    // и это не последний элемент
    if (currentLength === firstPosition && i + 1 < items.length) {
      result.push({ type: "placeholder", id: `empty-${currentLength}` });
    } else if (currentLength > firstPosition) {
      // Проверяем, не наступила ли следующая позиция
      const diff = currentLength - firstPosition;
      if (diff % interval === 0 && i + 1 < items.length) {
        result.push({ type: "placeholder", id: `empty-${currentLength}` });
      }
    }
  }

  return result;
}
