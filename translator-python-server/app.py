from chalice import Chalice
import urllib
import json
import boto3
import uuid

app = Chalice(app_name='translator-python-server')
app.debug = True

dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table('UserData')
songs_table = dynamodb.Table('Songs')


class Lyrics:
    def __init__(self, text):
        self.origin_text = self.__process_origin_text__(text)
        self.words = self.__generate_words__(text)


    def __generate_words__(self, text=""):
        words = []
        print("Text:" + text)
        for t in text.split("*newline*"):
            print(t)
            words.append(Line(t))
        return words

    def __process_origin_text__(self,text):
        t = ""
        for i in text.split("*newline*"):
            t += i +"\n "
        return t
            

    def to_json(self):
        words = []
        for w in self.words:
            words.append(w.to_json())
        return {
            "origin": self.origin_text,
            "lines": words
        }


class Line:
    def __init__(self, text):
        self.line_contents = text
        self.splited_version = self.__split_word__(text)

    def __split_word__(self, word: str):
        words = self.line_contents.split(" ")
        wordsObj = []
        for w in words:
            wordsObj.append(Word(w))
        return wordsObj

    def to_json(self):
        splited_version = []
        for s in self.splited_version:
            splited_version.append(s.to_json())
        return {
            "line-content": self.line_contents,
            "splited-version": splited_version
        }


class Word:
    def __init__(self, word):
        self.origin = word
        self.translated = None
        self.rhyme = False

    def to_json(self):
        return {
            "origin": self.origin,
            "translated-text": self.translated,
            "rhyme": self.rhyme
        }
    

def output_json(lyrics):
    output = []
    for lyric in lyrics:
        output.append(lyric.to_json())
    return output


def upload_lyrics(title, artist, lyrics, id_for_user):
    song_id = str(uuid.uuid1())
    with songs_table.batch_writer() as batch:
        batch.put_item(Item={
            "Title": title,
            "Artist": artist,
            "ID": song_id,
            "Lyrics": lyrics
        })

    song_list = login_as_user(id_for_user)
    song_list.append(song_id)
    user_table.update_item(
        Key={
            "account id": id_for_user
        },
        UpdateExpression='SET songs_list = :val1',
        ExpressionAttributeValues={
            ':val1': song_list
        }
    )


def get_lyrics(songs_id):
    response = songs_table.get_item(
        Key={
            "ID": songs_id
        }
    )
    item = response['Item']
    return item


def get_songs_info(songs_id):
    response = songs_table.get_item(
        Key={
            "ID": songs_id
        }
    )
    item = response['Item']
    return item


def create_user(username, emailAddress, account_id):
    user_table.put_item(Item={
        "username": username,
        "account id": account_id,
        "email_address": emailAddress,
        "songs_list": []
    })


def login_as_user(account_id):
    response = user_table.get_item(
        Key={
            "account id": account_id
        }
    )
    item = response['Item']
    #print(type(item['songs_list']))
    return item['songs_list']


@app.route('/start-project/{user_id}/{title}/{artist}/{lyrics}')
def index(user_id,title,artist,lyrics):
    lyrics = urllib.parse.unquote(lyrics)
    lyrics = lyrics.splitlines()
    lyrics_obj = []
    for l in lyrics:
        lyrics_obj.append(Lyrics(l))
    lyrics_json = output_json(lyrics_obj)
    # upload_lyrics(title=title, artist=artist,
    #               id_for_user=user_id, lyrics=lyrics_json)

    return lyrics_json


@app.route('/load-project/{user_id}')
def get_project(user_id):
    return get_lyrics(int(user_id))['Lyrics']


@app.route('/sign_up/{user_id}/{email}/{user_name}')
def sign_up(user_id, email, user_name):
    create_user(account_id=user_id, emailAddress=email, username=user_name)
    return "OK"


@app.route('/login/{user_id}')
def login(user_id):
    song_list = login_as_user(user_id)
    l = []
    for s in song_list:
        l.append({"Title": get_songs_info(s)['Title'],
                  "Artist": get_songs_info(s)['Artist']
                  })
    return l

@app.route('/test',cors=True)
def test():
    with open('test.json','rb') as f:
        lyric = f.read()
        return lyric

@app.route('/t/{lyrics}')
def test(lyrics):
    lyrics = urllib.parse.unquote(lyrics)
    return lyrics.split("%2%")