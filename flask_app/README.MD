
### Install Dependencies
pip install -r requirements.txt

### Run app
pyhton app.py





# Deactivate and remove the old environment (if exists)
deactivate
rm -rf venv

# Create a new virtual environment
python -m venv venv

# Activate the virtual environment
venv\Scripts\activate  # On Windows

# Install your requirements again
pip install -r requirements.txt
