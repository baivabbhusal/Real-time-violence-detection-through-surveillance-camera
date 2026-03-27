import os
import pandas as pd

# CONFIG: Where your data lives
BASE_DIR = "aiEngine/dataset/raw"
SAVE_PATH = "aiEngine/metadata.csv"

def create_manifest():
    video_records = []
    
    # Check if the base directory exists
    if not os.path.exists(BASE_DIR):
        print(f"Error: {BASE_DIR} not found!")
        return

    # Loop through the folders inside 'raw' (Violence and NonViolence)
    # folder_name will be 'Violence' or 'NonViolence'
    for folder_name in os.listdir(BASE_DIR):
        folder_path = os.path.join(BASE_DIR, folder_name)

        # Make sure we are looking at a folder, not a random file
        if os.path.isdir(folder_path):
            
            # Assign label based on folder name
            # 1 for Violence, 0 for NonViolence
            if "violence" in folder_name.lower() and "non" not in folder_name.lower():
                current_label = 1
                category = "Violence"
            else:
                current_label = 0
                category = "NonViolence"

            print(f"Checking folder: {folder_name} (Label: {current_label})")

            # Now loop through all videos inside this specific folder
            for filename in os.listdir(folder_path):
                if filename.lower().endswith(('.mp4', '.avi', '.mov', '.mkv')):
                    full_path = os.path.join(folder_path, filename)
                    
                    video_records.append({
                        "video_path": full_path,
                        "label": current_label,
                        "category": category
                    })

    # Create the CSV
    df = pd.DataFrame(video_records)
    if not df.empty:
        # We shuffle the list so the AI doesn't see all Violence then all NonViolence
        df = df.sample(frac=1).reset_index(drop=True) 
        
        df.to_csv(SAVE_PATH, index=False)
        print(f"\nSuccess! Created {SAVE_PATH} with {len(df)} total videos.")
    else:
        print("No videos found! Check your folder paths.")

if __name__ == "__main__":
    create_manifest()