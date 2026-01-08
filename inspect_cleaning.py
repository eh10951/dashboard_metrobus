import pandas as pd

file_path = '(3) BASE AAC RS 2025.xlsx'
try:
    df = pd.read_excel(file_path, sheet_name='AAC 2025')
    print("Columns:", df.columns.tolist())
    print("\nHead of data:")
    print(df.head(20))
    print("\nTail of data:")
    print(df.tail(20))
    print("\nValue counts for 'LÍNEA':")
    print(df['LÍNEA'].value_counts(dropna=False))
except Exception as e:
    print(f"Error: {e}")
