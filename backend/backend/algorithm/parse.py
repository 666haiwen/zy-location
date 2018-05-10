import os
import json
import pylab as plt

res = []
labels = []
module_dir = os.path.dirname(__file__) + '/'
x = []
y = []
with open(module_dir + 'trace_02.txt', encoding='utf-8') as fp:
    data = []
    for line in fp:
        # for trace_01.txt
        # if not line[0] == ' ':
        #     continue
        # index = line[4:8]
        # line = line[9:-2]        vis
        # for trace_02/03                                                                                                                                                                                                                                                                                                           .txt
        if len(line) < 16:
            continue
        index = line[11:15]
        line = line[16:-2]
        location = line.split(',')
        pos = {
            'x': float(location[0]),
            'y': float(location[1]),
            'z': float(location[2])
        }
        data.append(pos)
        if index not in labels:
            labels.append(index)
            res.append({
                'label': index,
                'pos': [pos]
            })
        else:
            label_index = labels.index(index)
            res[label_index]['pos'].append(pos)

with open(module_dir + 'trace_02.json', 'w') as fp:
        json.dump(data, fp)

