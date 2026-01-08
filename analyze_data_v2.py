import pandas as pd
import os

file_path = '(3) BASE AAC RS 2025.xlsx'
try:
    xl = pd.ExcelFile(file_path)
    print("SHEET NAMES:", xl.sheet_names)
    for sheet in xl.sheet_names:
        print(f"\n--- SHEET: {sheet} ---")
        df = xl.parse(sheet)
        print("Columns:", df.columns.tolist())
        print(df.head())
        print("Shape:", df.shape)
except Exception as e:
    print(f"Error reading excel: {e}")
