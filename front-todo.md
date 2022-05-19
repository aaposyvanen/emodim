# Tarvittavat parannukset:

~~Neuroverkkoarviot viestitasolla palautevaiheessa (tällä hetkellä palautteessa näkyy vain sanojen väritys)~~ (palautteen sijoitus korjattava)

Keskustelun tallentaminen (napista?) tallentaa keskustelun sen hetkisen tilan samaan .json muotoon

~~Erikoismerkkien toiminta viesteissä (pätkäisee kysymysmerkkien ja joidenkin muiden merkkien kohdalta viestin ja tiputtaa loppupään pois)~~

Lopulliset käyttöliittymän ulkonäköparannukset

# QOL parannukset:

merkkimäärärajatut viestit? esim twitter 140 merkkiä / 280 merkkiä? (helpottaisi lausetason analyysiä, pitkät lauseet ja usean lauseen viestit menevät useimmin väärin)

Viestin lähetys enterillä? (ei rivinvaihtoa, rivinvaihto shift+enter)


# Testauksen kautta designparannukset:

Parempi lausetason analyysi (nyt laskee vain negatiivisten ja positiivisten lauseiden suhteesta) {esim. vaan jos confidence >80 %? miten ratkaistaan todella monen lauseen viestit?}

lausetason analyysin visualisointi vain, jos viestistä löytyy >80 % confidence arvioita?

viestitason analyysin palautteen muotoilu?

highlightien värin muutos? paremmat hymiöt?

Näkymän muodon muutokset, leveyttä lisää

Sanatason analyysiin pienempi "scope", eli väritykset harvemmalle sanalle (isommat valencearvot, esim. yli 0.5?)


# Huomiota herättäneet seikat / pohdittava, halutaanko

mahdollisesti vastauksien vastauksen lähettäminen ja niiden + mahdollisien valmiiden vastauksien vastauksien arviointi

JOS MAHDOLLISTA korjatun palautteen reaaliaikainen, ainakin sanatasoinen analyysi? hyvä? huono?

Alkukommenttia ennen "uutinen" mitä on kommentoitu

Käyttöliittymä on "valmis", toisen henkilön tekemä kokonaisuus johon on perehdyttävä jonkin aikaa

Teksti tunnesisällöstä vain jos se on positiivinen tai negatiivinen (ei "Viestin tunnesisältö on neutraali")

Hymiö lähetettävän viestin analyysiin

Keskusteluiden selaamiseen nuoli-painikkeet

# Jatkokehitysideoita

Viestiketjun kokonaisuuden / siinä olevien sisäisten jännitteiden visualisointi / havainnointi jollakin tavalla?

Käyttöliittymä myös englanniksi