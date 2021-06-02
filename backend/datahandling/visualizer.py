import matplotlib.pyplot as plt
from tqdm import tqdm


path = "..\\data\\s24_2001_classified_24-05-2021_13-35-19.txt"
ratings = []
words = []


def createRatings(word, rating):
    rating = eval(rating)
    if rating != (None, None, None):
        words.append(word)
        ratings.append((rating[0], rating[1]))


def plot():
    plt.plot(ratings, antigravity='')
    x_val = [x[0] for x in ratings]
    y_val = [x[1] for x in ratings]
    plt.scatter(x_val, y_val)
    plt.title('Scatter plot of Valence and Arousal pairs')
    plt.xlabel('Valence')
    plt.ylabel('Arousal')
    plt.show()
    plt.hist(ratings)
    plt.show()


def plotFromFile():
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for line in tqdm(lines):
            createRatings(line.split(':')[0], line.split(':')[-1])
    plot()


# plotFromFile()
