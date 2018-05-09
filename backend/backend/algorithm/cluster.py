import os
import json
import pylab as plt

def cluster(x, y, module_dir):
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
    # plt.plot(afterX, afterY)
    # plt.show()
    res = {'pos': []}
    for i in range(len(afterX)):
        res['pos'].append({
            'x':afterX[i],
            'y':afterY[i]
        })
    # with open(module_dir + 'cluster.json', 'w') as fp:
    #         json.dump(res, fp)
    return afterX, afterY, res
