import pandas as pd

df = pd.read_excel("..\\data\\SaifMohammad_NRC_Valence_Arousal_Dominance_Lexicon.xlsx", skiprows=5)
words = df["Finnish-fi"]
dfn = pd.concat(g for _, g in df.groupby("Finnish-fi") if len(g) > 1)
dfn.to_excel("..\\data\\duplicates.xlsx", index=False, encoding='utf-8')
