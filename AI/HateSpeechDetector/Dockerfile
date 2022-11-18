FROM python:3.8

WORKDIR /usr/src/AI

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 8081

CMD ["python3", "Smilegate_Hate_Speech_Detector.py", "--noreload"]
