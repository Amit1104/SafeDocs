# utils/encryption.py
from cryptography.fernet import Fernet

# Generate a key for encryption (you might want to save this key securely)
encryption_key = Fernet.generate_key()
cipher_suite = Fernet(encryption_key)

def encrypt_file(file_data):
    """Encrypts file data using Fernet symmetric encryption."""
    return cipher_suite.encrypt(file_data)


def decrypt_file(encrypted_data):
    """Decrypts file data using Fernet symmetric encryption."""
    return cipher_suite.decrypt(encrypted_data)


def decrypt_file_path(file_path):
    """Decrypts the contents of an encrypted file."""
    with open(file_path, 'rb') as file:
        encrypted_data = file.read()
    decrypted_data = cipher_suite.decrypt(encrypted_data)
    return decrypted_data
