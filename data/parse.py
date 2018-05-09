import os
import json
import pylab as plt
import math

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

plt.plot(x, y)
Threshold = 0.08**2
N = len(x)
afterX = []
afterY = []
i = 0
while N > 0:
    indexDelete = []
    rX = 0
    rY = 0
    for j in range(N):
        distance = (x[i] - x[j])**2 + (y[i] - y[j])**2
        if distance < Threshold:
            indexDelete.append(j)
            rX += x[j]
            rY += y[j]
    rX /= len(indexDelete)
    rY /= len(indexDelete)
    afterX.append(rX)
    afterY.append(rY)
    tmpX = []
    tmpY = []
    for j in range(N):
        if j not in indexDelete:
            tmpX.append(x[j])
            tmpY.append(y[j])
    x = tmpX
    y = tmpY
    N = len(x)
# with open(module_dir + 'trace.json', 'w') as fp:
#         json.dump(res, fp)
plt.plot(afterX, afterY)
plt.show()
res = [{'pos': []}]
for i in range(len(afterX)):
    res[0]['pos'].append({
        'x':afterX[i],
        'y':afterY[i]
    })
with open(module_dir + 'after_trace.json', 'w') as fp:
        json.dump(res, fp)
