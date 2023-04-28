import os
import requests

def lambda_handler(event, context):
    x = requests.get(os.environ['WATCH_URL'])
    print(x.status_code)
    return "Success"