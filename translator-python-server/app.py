from chalice import Chalice
import urllib 
import json

app = Chalice(app_name='translator-python-server')
app.debug = True

class Lyrics:
    def __init__(self,text):
        self.origin_text = text
        self.words = self.__generate_words__(text)


    def __generate_words__(self,text=""):
        words = []
        for t in text.split():
            words.append(Word(t))
        return words
    
    def to_json(self):
        words = []
        for w in self.words:
            words.append(w.to_json())
        return {
            "origin" : self.origin_text,
            "words" : words
        }


class Word:
    def __init__(self,text):
        self.word_content = text
        self.splited_version = self.__split_word__(text)

    def __split_word__(self,word:str):
        return [Splited_word(word)]

    def to_json(self):
        splited_version = []
        for s in self.splited_version:
            splited_version.append(s.to_json())
        return {
            "word-content" : self.word_content,
            "splited-version" : splited_version
        }

class Splited_word:
    def __init__(self,word):
        self.origin = word
        self.translated = ""
        self.rhyme = False

    def to_json(self):
        return {
                "origin" : self.origin,
                "translated-text" : self.translated,
                "rhyme" : self.rhyme
                }

def output_json(lyrics):
    output = []
    for lyric in lyrics:
        output.append(lyric.to_json())
    return output

@app.route('/start-project/{lyrics}')
def index(lyrics):
    lyrics = urllib.parse.unquote(lyrics)
    lyrics = lyrics.splitlines()
    lyrics_obj = []
    for l in lyrics:
        lyrics_obj.append(Lyrics(l))
    return output_json(lyrics_obj)

