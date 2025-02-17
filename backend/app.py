'''
Date: 2024-11-01 04:24:48
LastEditors: TingTing 110824020+TingTing666666@users.noreply.github.com
LastEditTime: 2024-11-01 04:36:43
FilePath: \sakai-vue-master\sakai-vue-master\backend\app.py
'''
# backend/app.py
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename
import os
from model import WoundModel

app = Flask(__name__)
CORS(app)  # 根据需要配置

UPLOAD_FOLDER = 'uploads/'
PREDICTED_FOLDER = 'predicted/'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

# 确保上传文件夹存在
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PREDICTED_FOLDER, exist_ok=True)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['PREDICTED_FOLDER'] = PREDICTED_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 最大上传大小为16MB

# 加载预训练模型
MODEL_PATH = os.path.join('model', 'model.pth')
wound_model = WoundModel(MODEL_PATH)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)

        # 使用模型进行预测
        try:
            predicted_image_path, wound_area = wound_model.predict(filepath)
        except Exception as e:
            return jsonify({'error': f'Prediction failed: {str(e)}'}), 500

        # 重命名预测后的图像
        predicted_filename = f'predicted_{filename}'
        final_predicted_path = os.path.join(app.config['PREDICTED_FOLDER'], predicted_filename)
        os.rename(predicted_image_path, final_predicted_path)

        # 构建预测图像的 URL
        predicted_image_url = f'/predicted/{predicted_filename}'

        return jsonify({
            'predictedImageUrl': predicted_image_url,
            'woundArea': wound_area
        })
    else:
        return jsonify({'error': 'Invalid file type'}), 400

# 服务预测后的图像
@app.route('/predicted/<filename>')
def serve_predicted_file(filename):
    return send_from_directory(app.config['PREDICTED_FOLDER'], filename)

if __name__ == '__main__':
    app.run(debug=True)
