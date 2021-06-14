import json

with open('../../assets/tiles/pacman.json') as f:
    d = json.load(f)
    data = []
    final_data = []
    for i, value in enumerate(d['layers'][0]['data']):
        data.append(value)
        if len(data) == 51:
            final_data.append(data)
            data = []
            
from contextlib import redirect_stdout

with open('out.txt', 'w') as f:
    with redirect_stdout(f):
        for i in final_data:
            print(i)