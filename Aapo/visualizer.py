import matplotlib.pyplot as plt

ratings = []
words = []


def createRatings(word, rating):
    words.append(word)
    ratings.append(rating)


def plot():
    plt.plot(ratings)
    plt.show()


def plotFromFile():
    path = "test_classified_19-05-2021_11-52-22.txt"
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        for l in lines:
            print(l.split(':')[0], l.split(':')[1])
    return
