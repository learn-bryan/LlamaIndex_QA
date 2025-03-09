FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Create directory for temporary document storage
RUN mkdir -p /app/temp_documents

EXPOSE 5601

CMD ["python", "app.py"]