import pandas as pd
import json

with open('dashboard/public/data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

df = pd.DataFrame(data)
print("--- Valores en la columna 'station' (Estación) ---")
print(df['station'].value_counts().head(10))

print("\n--- Valores en la columna 'line' (Línea) ---")
print(df['line'].value_counts().head(10))
