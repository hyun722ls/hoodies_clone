FROM python:3.8

WORKDIR /usr/src/content_moderation

COPY . .

RUN pip3 install -r requirements.txt

EXPOSE 8083

CMD ["python3", "content_moderation.py", "--noreload"]
