import os
import pandas as pd

def generate_metadata(data_root, output_csv):
    # --- STEP 1: FORCE DIRECTORY CREATION ---
    output_dir = os.path.dirname(output_csv)
    if not os.path.exists(output_dir):
        print(f"Creating missing directory: {output_dir}")
        os.makedirs(output_dir, exist_ok=True)

    data = []
    if not os.path.exists(data_root):
        print(f"Error: {data_root} not found!")
        return

    # --- STEP 2: SCAN FOLDERS ---
    classes = [d for d in os.listdir(data_root) if os.path.isdir(os.path.join(data_root, d))]
    
    for label_name in classes:
        clean_name = label_name.strip().lower()
        label_id = 1 if "violence" in clean_name and "non" not in clean_name else 0
        
        print(f"Scanning: {label_name} (Label: {label_id})")
        
        class_path = os.path.join(data_root, label_name)
        for clip_folder in os.listdir(class_path):
            clip_path = os.path.join(class_path, clip_folder)
            if os.path.isdir(clip_path):
                frames = [f for f in os.listdir(clip_path) if f.lower().endswith(('.jpg', '.png'))]
                data.append({
                    "clip_name": clip_folder,
                    "relative_path": os.path.join(label_name, clip_folder),
                    "label": label_id,
                    "frame_count": len(frames)
                })

    # --- STEP 3: SAVE ---
    df = pd.DataFrame(data)
    df.to_csv(output_csv, index=False)
    print(f"\n SUCCESS: Master metadata saved to: {output_csv}")
    print(df['label'].value_counts())

if __name__ == "__main__":
    # Get the folder where THIS script is located
    SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
    
    # Go up one level to 'aimodel' then into 'dataset'
    # This ensures it ALWAYS lands in aimodel/dataset regardless of terminal location
    PROJECT_ROOT = os.path.abspath(os.path.join(SCRIPT_DIR, ".."))
    DATA_IN = os.path.join(PROJECT_ROOT, "dataset", "processed")
    CSV_OUT = os.path.join(PROJECT_ROOT, "dataset", "metadata.csv")
    
    generate_metadata(DATA_IN, CSV_OUT)