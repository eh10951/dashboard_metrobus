import pandas as pd
import json

with open('dashboard/public/data.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

df = pd.DataFrame(data)
print("--- Status counts ---")
print(df['status'].value_counts())
print("\n--- Source counts ---")
print(df['source'].value_counts())
