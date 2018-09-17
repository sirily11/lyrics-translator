from requests_html import HTMLSession
import requests
from pprint import pprint


def getLyrics(artist: str, title: str):
    artist = artist.replace(" ", "-")
    title = title.replace(" ", "-")

    session = HTMLSession()
    url = "https://www.musixmatch.com/lyrics/{}/{}".format(artist, title)
    r = session.get(url)
    lyrics = r.html.find(".mxm-lyrics__content")
    list_lyrics = []
    for l in lyrics:
        lines = l.full_text.split("\n")
        for line in lines:
            list_lyrics.append(line)
    return list_lyrics


def get_artist_info(artist: str, title: str):
    url = "https://musixmatchcom-musixmatch.p.mashape.com/wsr/1.1/matcher.lyrics.get"
    headers = {
        "X-Mashape-Key": "6xnj9w5pglmshQyTjEYWsRUjM7srp1Kv2QqjsnDq2edZGtG3VY",
        "X-Mashape-Host": "musixmatchcom-musixmatch.p.mashape.com"
    }
    parm = {
        "q_artist": artist,
        "q_track": title
    }
    try:
        lyrics_url = requests.get(url, headers=headers, params=parm).json()["backlink_url"].split("?")[0]
        info = lyrics_url.split("lyrics/")[1]
        a = info.split("/")[0]
        t = info.split("/")[1]
        return [a, t]
    except Exception as e:
        return False


if __name__ == '__main__':

    return_val = get_artist_info(artist="taylor swift", title="look what you made me do")
    if return_val:
        a = return_val[0]
        t = return_val[1]
        r = getLyrics(a, t)
        print(r)
