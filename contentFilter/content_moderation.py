import os
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)
app.config['JSON_AS_ASCII'] = False
enum = {'adult': '노골적인 선정성 묘사로 불쾌감을 줄 수 있는 이미지로 업로드에 실패했습니다.', 'medical': '의학적으로 과하게 상세하여 불쾌감을 줄 수 있는 이미지로 업로드에 실패했습니다.', 'violence': '노골적인 폭력 묘사로 불쾌감을 줄 수 있는 이미지로 업로드에 실패했습니다.', 'clean': False}


os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'winter-alliance-368105-8cf0b5f21e09.json'

def detect_safe_search(path):
    """Detects unsafe features in the file."""
    from google.cloud import vision
    import io
    client = vision.ImageAnnotatorClient()

    # with open(path, 'rb') as image_file:
    #     content = image_file.read()
    content = path.read()
  

    image = vision.Image(content=content)

    response = client.safe_search_detection(image=image)
    safe = response.safe_search_annotation

    # Names of likelihood from google.cloud.vision.enums
    likelihood_name = ('UNKNOWN', 'VERY_UNLIKELY', 'UNLIKELY', 'POSSIBLE',
                       'LIKELY', 'VERY_LIKELY')
    
    filters = ['adult', 'medical', 'violence']

    # print(likelihood_name[safe.adult])
    # print(likelihood_name[safe.racy])
    # print(likelihood_name[safe.medical])
    # print(likelihood_name[safe.violence])

    if (likelihood_name[safe.adult] == 'POSSIBLE' and likelihood_name[safe.racy] == 'VERY_LIKELY') or likelihood_name[safe.adult] == 'LIKELY' or likelihood_name[safe.adult] == 'VERY_LIKELY':
        return filters[0]
    
    if likelihood_name[safe.medical] == 'VERY_LIKELY':
        return filters[1]

    if likelihood_name[safe.violence] == 'VERY_LIKELY':
        return filters[2]
    
    return 'clean'
  




@app.route('/image/filter', methods=['POST'])
def imagefilter():
    if request.method == 'POST':
        
        file = request.files['file']
        result = detect_safe_search(file)
       
        return  {'result': enum[result]}
        # return {'id': student_id}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8083, debug=True)
