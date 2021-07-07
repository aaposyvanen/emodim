import pandas as pd
"""
from PyDictionary import PyDictionary
from google_trans_new import google_translator
import googletrans
from tqdm import tqdm

keep = []
delete = []
translator = google_translator()
dictionary = PyDictionary()
"""
df = pd.read_excel("..\\data\\bigList_normalized_06-07-2021_09-42-35.xlsx")
# dfd = pd.concat(g for _, g in df.groupby(["Finnish-fi"]) if len(g) > 1)
# test = df.groupby("Finnish-fi")['Valence', 'Arousal', 'Dominance'].mean().reset_index().sort_values('Finnish-fi')
dfn = df.groupby("Finnish-fi").mean().round(3).reset_index()
dfn['Finnish-fi'] = dfn['Finnish-fi'].str.lower()
dfn = dfn.sort_values('Finnish-fi')
print(dfn.shape, df.shape)
# print(df.head(5), '\n', df.tail(5))
print(dfn.head(5), '\n', dfn.tail(5))
"""
for i, row in tqdm(dfn.iterrows()):
    synonyms = dictionary.synonym(row['English'])
    if synonyms:
        for syn in synonyms:
            if syn in df['English'].values:
                synonymfound = df.loc[df['English'] == syn]
                # a finnish word for a synonym exists that is not the original word
                if synonymfound['Finnish-fi'].values in df['Finnish-fi'].values and i != synonymfound.index:
                    #input(f"{synonymfound}\n{i}\n{row}")
                    keep.append(synonymfound)
                    delete.append(row)
                else:
                    print(row)
                break
    else:
        print(row['English'])
        dupes = pd.concat(g for _, g in dfn.groupby("Finnish-fi") if g == row['Finnish-fi'].values)
        delete.append(row)
for i, j in enumerate(keep):
    input(f"{keep[i]['Finnish-fi'].values}{delete[i]['Finnish-fi'].values}")
"""
dfn.to_excel("..\\data\\out.xlsx", index=False, encoding='utf-8')
