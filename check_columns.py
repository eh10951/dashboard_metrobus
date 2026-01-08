import pandas as pd
import json

file_path = '(3) BASE AAC RS 2025.xlsx'
df = pd.read_excel(file_path, sheet_name='AAC 2025', header=None)
print("First row values:", df.iloc[0].tolist())
