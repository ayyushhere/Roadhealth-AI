from flask import Flask, request, jsonify
from ultralytics import YOLO
import os

app = Flask(__name__)

# LOAD REAL ROAD DAMAGE MODEL
model = YOLO("models/best.pt")

TEMP_FOLDER = "temp"

os.makedirs(
    TEMP_FOLDER,
    exist_ok=True
)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "online"})

@app.route('/predict', methods=['POST'])
def predict():

    if 'image' not in request.files:

        return jsonify({
            "error":"No image uploaded"
        }),400

    file = request.files['image']

    filepath = os.path.join(
        TEMP_FOLDER,
        file.filename
    )

    file.save(filepath)

    results = model(filepath)

    detections = []

    for result in results:

        boxes = result.boxes

        if boxes is None:
            continue

        for box in boxes:
            cls_id = int(box.cls[0])
            label = model.names[cls_id]
            confidence = float(box.conf[0]) * 100
            
            # Extract normalized coordinates [xmin, ymin, xmax, ymax]
            coords = box.xyxyn[0].tolist() if hasattr(box, 'xyxyn') else None

            detections.append({
                "damage": label,
                "confidence": round(confidence, 2),
                "box": coords
            })

    os.remove(filepath)

    if len(detections)==0:
        return jsonify({
            "damage": "No Damage",
            "severity": "Low",
            "confidence": 0,
            "box": None
        })

    top = max(
        detections,
        key=lambda x:x['confidence']
    )

    severity = "Low"

    if top['confidence'] > 85:
        severity = "High"

    elif top['confidence'] > 60:
        severity = "Medium"

    all_boxes = [{"damage": d["damage"], "confidence": d["confidence"], "coords": d["box"]} for d in detections if d.get("box")]

    return jsonify({
        "damage": top['damage'],
        "severity": severity,
        "confidence": top['confidence'],
        "box": all_boxes
    })

if __name__ == '__main__':
    app.run(port=5000)