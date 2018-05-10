import os
import json
import time
from .cluster import  cluster
from .kalman import demo_kalman_xy
from .. import settings

def simulation():
    path = os.path.dirname(__file__) + '/'
    data = []
    while True:
        while settings.START == 0:
            pass
        settings.THREAD_LOCK.acquire()
        settings.TRACE_DATA = {
            'orignal': {},
            'cluster': {},
            'kalman': {}
        }
        with open(path + 'trace_0' + settings.SAMPLE_ID + '.json', encoding='utf-8') as fp:
            data = json.load(fp)
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
            cluster_x, cluster_y, _cluster = cluster(x, y)
            # kaerman filter
            kalman_x, kalman_y, _kalman = demo_kalman_xy(cluster_x, cluster_y)
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
