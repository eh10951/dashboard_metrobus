import pandas as pd
import os

file_path = '(3) BASE AAC RS 2025.xlsx'
try:
    df = pd.read_excel(file_path)
    print("COLUMNS:")
    print(df.columns.tolist())
    print("\nINFO:")
    print(df.info())
    print("\nHEAD:")
    print(df.head())
    print("\nDESCRIPTION:")
    print(df.describe(include='all'))
except Exception as e:
    print(f"Error reading excel: {e}")
