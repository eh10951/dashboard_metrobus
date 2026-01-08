import pandas as pd

file_path = '(3) BASE AAC RS 2025.xlsx'
try:
    xl = pd.ExcelFile(file_path)
    print("SHEETS:", xl.sheet_names)
    
    # Read AAC 2025 with header=None
    print("\n--- SHEET: AAC 2025 (header=None) ---")
    df = xl.parse('AAC 2025', header=None)
    print(df.head(10))
    print("Shape:", df.shape)

    # Read AACOM 2025
    if 'AACOM 2025' in xl.sheet_names:
        print("\n--- SHEET: AACOM 2025 ---")
        df2 = xl.parse('AACOM 2025')
        print(df2.head())
        print("Shape:", df2.shape)

    # Read DATOS
    if 'DATOS' in xl.sheet_names:
        print("\n--- SHEET: DATOS ---")
        df3 = xl.parse('DATOS')
        print(df3.head())
        print("Shape:", df3.shape)

except Exception as e:
    print(f"Error: {e}")
