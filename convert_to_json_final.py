import pandas as pd
import json
import os
import numpy as np

file_path = '(3) BASE AAC RS 2025.xlsx'
output_path = 'dashboard/public/data.json'

def clean_data(df):
    df.columns = df.columns.str.strip()
    initial_len = len(df)
    
    # Critical filters
    if 'FOLIO' in df.columns:
        df = df[df['FOLIO'].notna()]
        # Filter out '0' or empty folios
        df = df[~df['FOLIO'].astype(str).str.strip().isin(['0', ''])]
    
    if 'FECHA' in df.columns:
        df['FECHA'] = pd.to_datetime(df['FECHA'], errors='coerce')
        df = df[df['FECHA'].notna()]
        df['date'] = df['FECHA'].dt.strftime('%Y-%m-%d')
    
    # Replace all NaN (numpy.nan) with empty string to avoid "NaN" in JSON
    # fillna('') is the safest for JSON
    df = df.fillna('')
    
    # Strip everything
    for col in df.columns:
        if df[col].dtype == 'object':
            df[col] = df[col].astype(str).str.strip().replace(['nan', 'NaN', 'None'], '')

    print(f"Cleaned data: Reduced from {initial_len} to {len(df)} records.")
    return df

try:
    df = pd.read_excel(file_path, sheet_name='AAC 2025')
    df = clean_data(df)
    
    schema = {
        'folio': 'FOLIO',
        'date': 'date',
        'day': 'DÍA',
        'time': 'HORA',
        'name': 'NOMBRE O USUARIO',
        'gender': 'GÉNERO',
        'line': 'LÍNEA',
        'station': 'ESTACIÓN',
        'category': 'CATEGORÍA',
        'subcategory': 'CONCEPTO',
        'unit': 'UNIDAD',
        'source': 'CANAL',
        'status': 'ESTATUS',
        'impact': 'IMPACTO'
    }
    
    final_data = pd.DataFrame()
    for key, excel_col in schema.items():
        found_col = None
        for c in df.columns:
            if excel_col.lower() in c.lower().replace('\n', ' '):
                found_col = c
                break
        
        if found_col:
            final_data[key] = df[found_col]
        else:
            final_data[key] = ''

    # Final cleanup of types for JSON
    # Ensure NO float NaNs remain
    final_data = final_data.fillna('')
    
    for col in final_data.columns:
        if any(isinstance(v, (pd.Timestamp, np.datetime64)) for v in final_data[col]):
             final_data[col] = final_data[col].astype(str)
        # Ensure 'nan' string is actually empty
        final_data[col] = final_data[col].astype(str).replace(['nan', 'NaN', 'None'], '')

    data = final_data.to_dict(orient='records')
    
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
        
    print(f"Successfully exported {len(data)} clean records.")

except Exception as e:
    import traceback
    print(f"Error: {e}")
    traceback.print_exc()
