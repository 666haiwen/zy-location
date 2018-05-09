import os
import json
import pylab as plt

res = []
labels = []
module_dir = os.path.dirname(__file__) + '/'
x = []
y = []
with open(module_dir + 'trace.txt', encoding='utf-8') as fp:
    for line in fp:
        if not line[0] == ' ':
            continue
        index = line[4:8]
        line = line[9:-2]
        location = line.split(',')
        pos = {
            'x': location[0],
            'y': location[1],
            'z': location[2]
        }
        x.append(float(location[0]))
        y.append(float(location[1]))
        if index not in labels:
            labels.append(index)
            res.append({
                'label': index,
                'pos': [pos]
            })
        else:
            label_index = labels.index(index)
            res[label_index]['pos'].append(pos)

with open(module_dir + 'trace.json', 'w') as fp:
        json.dump({
            'x': x,
            'y': y
            }, fp)
