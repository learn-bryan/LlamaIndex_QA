import os
from pathlib import Path

def process_document(filepath):
    """
    Process a document file and extract its text content.
    Returns the document text and metadata.
    
    This is a simple implementation that just reads text files.
    You can extend this to handle more document types.
    """
    filepath = Path(filepath)
    extension = filepath.suffix.lower()
    
    # Process based on file extension
    if extension in ['.txt', '.md', '.csv']:
        with open(filepath, 'r', encoding='utf-8') as f:
            text = f.read()
        
        metadata = {
            "filename": filepath.name,
            "extension": extension,
            "size_bytes": os.path.getsize(filepath)
        }
        
        return text, metadata
    
    elif extension in ['.pdf', '.docx', '.pptx']:
        # Placeholder for PDF, DOCX, PPTX processing
        # You would need to add libraries like PyPDF2, python-docx, etc.
        return f"This is a placeholder for {extension} document processing", {
            "filename": filepath.name,
            "extension": extension,
            "size_bytes": os.path.getsize(filepath)
        }
    
    else:
        # Default case for unsupported file types
        return f"Unsupported file type: {extension}", {
            "filename": filepath.name,
            "extension": extension,
            "size_bytes": os.path.getsize(filepath)
        }