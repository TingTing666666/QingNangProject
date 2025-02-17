# backend/model/__init__.py
import torch
from torchvision import transforms
from PIL import Image
import numpy as np
import os

class WoundModel:
    def __init__(self, model_path):
        self.device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
        self.model = torch.load(model_path, map_location=self.device)
        self.model.eval()
        self.transform = transforms.Compose([
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                 std=[0.229, 0.224, 0.225])
        ])

    def predict(self, image_path):
        image = Image.open(image_path).convert('RGB')
        input_tensor = self.transform(image).unsqueeze(0).to(self.device)

        with torch.no_grad():
            output = self.model(input_tensor)
            predicted_mask = torch.sigmoid(output).squeeze().cpu().numpy()
            predicted_image_path = self.generate_predicted_image(image, predicted_mask, image_path)
            wound_area = self.calculate_wound_area(predicted_mask)

        return predicted_image_path, wound_area

    def generate_predicted_image(self, original_image, mask, original_image_path):
        binary_mask = (mask > 0.5).astype(np.uint8) * 255
        mask_image = Image.fromarray(binary_mask).resize(original_image.size)
        mask_image = mask_image.convert('RGBA')
        original_image = original_image.convert('RGBA')
        combined = Image.alpha_composite(original_image, mask_image)
        base_filename = os.path.basename(original_image_path)
        predicted_image_path = os.path.join('predicted', f'predicted_{base_filename}')
        combined.save(predicted_image_path)
        return predicted_image_path

    def calculate_wound_area(self, mask):
        wound_pixels = (mask > 0.5).sum()
        wound_area = wound_pixels * 0.1  # 根据实际情况调整
        return round(wound_area, 2)
