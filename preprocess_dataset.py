import os
import cv2
from PIL import Image
import shutil
import xml.etree.ElementTree as ET
import random

def rename_files_in_folder(folder_path):
    files = os.listdir(folder_path)
    for index, filename in enumerate(files):
        file_extension = os.path.splitext(filename)[1]
        new_name = f"{index + 1}{file_extension}"
        os.rename(os.path.join(folder_path, filename), os.path.join(folder_path, new_name))




def preprocess_images(folder_path, output_folder, target_size=(640, 640), enhance=False):
    """
    Preprocess images by:
    1. Converting to JPG format
    2. Resizing to target size (default 640x640)
    3. Optionally enhancing image quality (brightness/contrast)
    
    Args:
        folder_path (str): Path to the folder containing images.
        output_folder (str): Path to save preprocessed images.
        target_size (tuple): Target image size (width, height).
        enhance (bool): Whether to enhance brightness and contrast.
    """

    # Ensure output folder exists
    os.makedirs(output_folder, exist_ok=True)

    # List all files in the folder
    files = os.listdir(folder_path)
    
    for filename in files:
        file_path = os.path.join(folder_path, filename)
        
        # Load the image
        try:
            img = cv2.imread(file_path)
            if img is None:
                print(f"Skipping {filename} (not an image)")
                continue
            
            # Convert to JPG format if necessary
            new_filename = os.path.splitext(filename)[0] + ".jpg"
            new_file_path = os.path.join(output_folder, new_filename)

            # Resize image
            img = cv2.resize(img, target_size, interpolation=cv2.INTER_AREA)

            # Optionally enhance image quality
            if enhance:
                img = cv2.convertScaleAbs(img, alpha=1.2, beta=30)  # Adjust contrast/brightness
            
            # Save as JPG
            cv2.imwrite(new_file_path, img)
            print(f"Processed: {filename} → {new_filename}")
        
        except Exception as e:
            print(f"Error processing {filename}: {e}")



def split_dataset(dataset_path, output_path, train_ratio=0.8, val_ratio=0.1, test_ratio=0.1):
    """
    Splits a dataset into train, val, and test sets (80-10-10 by default).
    It ensures images and their corresponding YOLO labels (.txt) are moved together.

    Args:
        dataset_path (str): Path to the folder containing images and annotations.
        output_path (str): Path to save the split dataset.
        train_ratio (float): Percentage of training data (default: 0.8).
        val_ratio (float): Percentage of validation data (default: 0.1).
        test_ratio (float): Percentage of test data (default: 0.1).
    """

    # Ensure ratios sum to 1
    assert train_ratio + val_ratio + test_ratio == 1, "Ratios must sum to 1."

    # Define folders
    images_path = os.path.join(dataset_path, "images")
    labels_path = os.path.join(dataset_path, "labels")

    train_img_dir = os.path.join(output_path, "images/train")
    val_img_dir = os.path.join(output_path, "images/val")
    test_img_dir = os.path.join(output_path, "images/test")

    train_lbl_dir = os.path.join(output_path, "labels/train")
    val_lbl_dir = os.path.join(output_path, "labels/val")
    test_lbl_dir = os.path.join(output_path, "labels/test")

    # Create directories
    for folder in [train_img_dir, val_img_dir, test_img_dir, train_lbl_dir, val_lbl_dir, test_lbl_dir]:
        os.makedirs(folder, exist_ok=True)

    # Get all image files
    image_files = [f for f in os.listdir(images_path) if f.endswith((".jpg", ".png", ".jpeg"))]
    random.shuffle(image_files)

    # Split dataset
    total = len(image_files)
    train_count = int(total * train_ratio)
    val_count = int(total * val_ratio)

    train_files = image_files[:train_count]
    val_files = image_files[train_count:train_count + val_count]
    test_files = image_files[train_count + val_count:]

    def move_files(file_list, img_dest, lbl_dest):
        for img_file in file_list:
            img_src = os.path.join(images_path, img_file)
            lbl_src = os.path.join(labels_path, os.path.splitext(img_file)[0] + ".txt")

            # Move images
            shutil.move(img_src, os.path.join(img_dest, img_file))

            # Move labels (if exists)
            if os.path.exists(lbl_src):
                shutil.move(lbl_src, os.path.join(lbl_dest, os.path.splitext(img_file)[0] + ".txt"))

    # Move files to respective folders
    move_files(train_files, train_img_dir, train_lbl_dir)
    move_files(val_files, val_img_dir, val_lbl_dir)
    move_files(test_files, test_img_dir, test_lbl_dir)

    print(f"Dataset split complete! ✅")
    print(f"Train: {len(train_files)} images")
    print(f"Validation: {len(val_files)} images")
    print(f"Test: {len(test_files)} images")





def create_empty_txt_for_unlabeled_images(images_folder, labels_folder):
    """
    Ensures every image has a corresponding label file.
    Creates empty .txt files for images without annotations.

    Args:
        images_folder (str): Path to the images directory.
        labels_folder (str): Path to the labels directory.
    """

    # List all images
    image_files = [f for f in os.listdir(images_folder) if f.endswith((".jpg", ".png", ".jpeg"))]

    for img_file in image_files:
        txt_file = os.path.splitext(img_file)[0] + ".txt"
        txt_path = os.path.join(labels_folder, txt_file)

        # Create empty txt file if it doesn't exist
        if not os.path.exists(txt_path):
            open(txt_path, "w").close()
            print(f"Created empty: {txt_path}")


def create_empty_xml(filename, output_folder):
    """
    Creates an empty Pascal VOC XML annotation file for images with no annotations.
    """
    annotation = ET.Element("annotation")
    ET.SubElement(annotation, "folder").text = "split_dataset"
    ET.SubElement(annotation, "filename").text = filename + ".jpg"

    size = ET.SubElement(annotation, "size")
    ET.SubElement(size, "width").text = "640"  
    ET.SubElement(size, "depth").text = "3"

    tree = ET.ElementTree(annotation)
    xml_path = os.path.join(output_folder, filename + ".xml")
    tree.write(xml_path)
    print(f"Created empty XML: {xml_path}")

def split_annotations(labels_base, annotations_base):
    """
    Splits annotations into train, val, test folders based on labels folder structure.
    If an XML file is missing, creates an empty one.

    Args:
        labels_base (str): Path to the 'labels' directory containing train, val, test.
        annotations_base (str): Path to the 'annotations' directory.
    """
    splits = ["train", "val", "test"]
    for split in splits:
        label_folder = os.path.join(labels_base, split)
        ann_folder = os.path.join(annotations_base, split)

        os.makedirs(ann_folder, exist_ok=True)

        # Get list of label names (without .txt extension)
        label_files = [f.split(".")[0] for f in os.listdir(label_folder) if f.endswith(".txt")]

        # Move corresponding XML annotation files
        for label_name in label_files:
            xml_file = os.path.join(annotations_base, f"{label_name}.xml")
            if os.path.exists(xml_file):
                shutil.move(xml_file, os.path.join(ann_folder, f"{label_name}.xml"))
                print(f"Moved: {xml_file} → {ann_folder}")
            else:
                # Create empty XML for images without annotations
                create_empty_xml(label_name, ann_folder)















#rename_files_in_folder('dataset')
#preprocess_images("dataset", "preprocessed_dataset", target_size=(640, 640), enhance=False)

#split_dataset("preprocessed_dataset", "split_dataset")

#parent_folder = 'preprocessed_dataset'


#split_annotations("split_dataset/labels", "split_dataset/annotations")

# Run for each dataset split
# base_dir = "split_dataset"
# for split in ["train", "val", "test"]:
#     create_empty_txt_for_unlabeled_images(
#         os.path.join(base_dir, "images", split),
#         os.path.join(base_dir, "labels", split)
#     )

