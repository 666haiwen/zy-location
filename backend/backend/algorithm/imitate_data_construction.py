import os
import json
import time
from .cluster import  cluster
from .kalman import demo_kalman_xy
from .. import settings

def simulation():
    module_dir = os.path.dirname(__file__) + '/../'
    path = os.path.dirname(__file__) + '/'
    data = []
    with open(path + 'trace.txt', encoding='utf-8') as fp:
        for line in fp:
            if not line[0] == ' ':
                continue
            index = line[4:8]
            line = line[9:-2]
            location = line.split(',')
            pos = {
                'x': float(location[0]),
                'y': float(location[1]),
                'z': float(location[2])
            }
            data.append(pos)
    while True:
        while settings.START == 0:
            pass
        settings.THREAD_LOCK.acquire()
        settings.TRACE_DATA = {
            'orignal': {},
            'cluster': {},
            'kalman': {}
        }
        settings.THREAD_LOCK.release()
        res = []
        labels = []
        x = []
        y = []
        orignal = {'pos':[]}
        for line in data:
            x.append(line['x'])
            y.append(line['y'])
            orignal['pos'].append({
                'x': line['x'],
                'y': line['y']
            })
            # simulate accept a new data every interval
            time.sleep(settings.TIME_INTERVAL)
            # cluster
            cluster_x, cluster_y, _cluster = cluster(x, y, module_dir)
            # kaerman filter
            kalman_x, kalman_y, _kalman = demo_kalman_xy(cluster_x, cluster_y, module_dir)
            settings.THREAD_LOCK.acquire()
            settings.TRACE_DATA = {
                'orignal': orignal,
                'cluster': _cluster,
                'kalman': _kalman
            }
            settings.THREAD_LOCK.release()
        settings.THREAD_LOCK.acquire()
        settings.START = 0
        settings.THREAD_LOCK.release()
