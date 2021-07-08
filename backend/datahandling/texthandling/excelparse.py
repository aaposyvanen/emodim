import pandas as pd


df = pd.read_excel("..\\..\\data\\bigList_normalized_06-07-2021_09-42-35.xlsx")
dfn = df.groupby("Finnish-fi").mean().round(3).reset_index()
dfn['Finnish-fi'] = dfn['Finnish-fi'].str.lower()
dfn = dfn.sort_values('Finnish-fi')
print(dfn.shape, df.shape)
print(dfn.head(5), '\n', dfn.tail(5))
dfn.to_excel("..\\..\\data\\out.xlsx", index=False, encoding='utf-8')
