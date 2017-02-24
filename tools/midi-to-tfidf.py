import sys
from math import log
from random import random
from pymongo import MongoClient
from pandas import DataFrame, Series
from analytics import TermFreqInverseDocFreq

client = MongoClient('localhost', 27017)
db = client.meter

i = 0
tfidf_data = {}
sample_rate = 1.0
count = db.midi_files.count()
cursor = db.midi_files.find()
for f in cursor:
    n = random()
    if n < sample_rate:
        i += 1
        tfidf_data[f['filename']] = f
        print('\r', 'Processing {} of {} files'.format(i, count), end='')

df = DataFrame.from_dict(tfidf_data, orient='index')
tfidf = TermFreqInverseDocFreq()
tfidf.create(df, 'raw_text', False)
tfidf.save('midi-tfidf')

# This part should live on the server
#def get_expanded(x):
    #return log(1.1 * len(x.name)) * x

#for k, v in tfidf_data.items():
    #print(k)
    #print(tfidf_data[k]['filename'])
    #terms = tfidf.get_sorted_terms_for_document(k)
    #print(terms)
    #terms_df = terms.to_frame()
    #terms_df['expanded'] = terms_df.apply(get_expanded, axis=1)
    #print(terms_df)