from chalice import Chalice
import urllib
import json
import boto3
import uuid
import time
import datetime

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
        for t in text.split("*newline*"):
            words.append(Line(t))
        return words

    def __process_origin_text__(self, text):
        t = ""
        for i in text.split("*newline*"):
            t += i + "\n "
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
        self.length = 0
        self.spliter()

    def spliter(self):
        vowel = ['a', 'e', 'i', 'o', 'u']
        for i, w in enumerate(self.origin):
            try:
                if w.lower() in vowel and self.origin[i+1].lower() not in vowel:
                    self.length += 1
            except Exception as e:
                if w.lower() in vowel:
                    self.length += 1

    def to_json(self):
        return {
            "origin": self.origin,
            "translated-text": self.translated,
            "rhyme": self.rhyme,
            "length": self.length,
            "symbol": []
        }


def output_json(lyrics):
    output = []
    for lyric in lyrics:
        output.append(lyric.to_json())
    return output


def upload_lyrics(title, artist, lyrics, id_for_user):
    s3 = boto3.resource('s3')
    BUCKET_NAME = "lyrics-from-user"
    FILE_NAME = "{}-{}-{}.json".format(artist,title,id_for_user)
    try:
        s3.Object(BUCKET_NAME,FILE_NAME).put(Body=json.dumps(lyrics,ensure_ascii=False))
        print("成功上传文件：{}\n 内容是".format(FILE_NAME,json.dumps(lyrics)))
        return True
    except Exception as e:
        return False

def get_lyrics(songs_id):
    pass


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
    # print(type(item['songs_list']))
    return item['songs_list']


def translate_the_lyrics(changes):
    json_to_write = ""
    with open('test.json', 'rb') as f:
        jsonData = json.loads(f.read(), encoding='utf-8')
        for change in changes:
            which_lyric = change['id']
            i = int(which_lyric[10])
            j = int(which_lyric[12])
            translation = change['value']
            print(which_lyric, translation)
            jsonData[0]['lines'][i]["splited-version"][j]["translated-text"] = translation
        json_to_write = jsonData
    with open('test.json', 'wb') as f:
        data = json.dumps(jsonData, ensure_ascii=False)
        f.write(data.encode('utf-8'))


@app.route('/start-project/{user_id}/{title}/{artist}/{lyrics}',cors=True)
def start_project(user_id, title, artist, lyrics):
    lyrics = urllib.parse.unquote(lyrics)
    lyrics_obj = Lyrics(lyrics)
    upload_lyrics(title=title, artist=artist,
                  id_for_user=user_id, lyrics=lyrics_obj.to_json())
    return {"successful" : True}

@app.route('/load-project/{user_id}/{title}/{artist}',cors=True)
def get_project(user_id,title,artist):
    BUCKET_NAME = "lyrics-from-user"
    FILE_NAME = "{}-{}-{}.json".format(artist,title,user_id)
    s3 = boto3.resource('s3')
    obj = s3.Object(BUCKET_NAME, FILE_NAME)
    jsonFile = obj.get()['Body'].read().decode('utf-8')  
    return jsonFile


@app.route('/sign_up/{user_id}/{email}/{user_name}')
def sign_up(user_id, email, user_name):
    create_user(account_id=user_id, emailAddress=email, username=user_name)
    return "OK"


@app.route('/login/{user_id}',cors=True)
def login(user_id):
    # song_list = login_as_user(user_id)
    # l = []
    # for s in song_list:
    #     l.append({"Title": get_songs_info(s)['Title'],
    #               "Artist": get_songs_info(s)['Artist']
    #               })
    # return l
    return True


@app.route('/saving/{userid}/{song_name}/{data}', cors=True)
def saving(userid, song_name, data):
    # Because the clinet's http request is using utf-8
    # So we need to use urllib to decode it
    changes = json.loads(urllib.parse.unquote(data), encoding='utf-8')
    # time.sleep(1)
    translate_the_lyrics(changes)
    return {"successful": True}


@app.route('/test', cors=True)
def test():
    with open('test.json', 'rb') as f:
        lyric = f.read()
        return lyric
