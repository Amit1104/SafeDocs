from cryptography.fernet import Fernet

# encryption_key = Fernet.generate_key()
# print(encryption_key)
# cipher_suite = Fernet(encryption_key)

static_key = b'hakQhiT7Krh_2VMXh9y-nBd3CErskZZkWL8U68ZocXY='
cipher_suite = Fernet(static_key)


def encrypt_file(file_data):
    return cipher_suite.encrypt(file_data)


def decrypt_file(encrypted_data):
    return cipher_suite.decrypt(encrypted_data)


def decrypt_file_path(file_path):
    with open(file_path, 'rb') as file:
        encrypted_data = file.read()
    decrypted_data = cipher_suite.decrypt(encrypted_data)
    return decrypted_data
