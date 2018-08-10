from chalice import Chalice
import urllib
import json
import boto3
import uuid
import time
import datetime
from boto3.dynamodb.conditions import Key, Attr

app = Chalice(app_name='translator-python-server')
app.debug = True

dynamodb = boto3.resource('dynamodb')
user_table = dynamodb.Table('userTable')
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
        if self.length == 0:
            self.length = 1
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

def add_new_project(title,artist,user_id,name="",email_address=""):
    now = datetime.datetime.now()
    user_table.put_item(
        Item={
            "id" : user_id,
            "time" : "{}-{}-{}-{}:{}:{}:{}".format(now.year,now.month,now.day,now.hour,now.minute,now.second,now.microsecond),
            "name" : name,
            "title" : title,
            "artist" : artist
        }
    )
    return True

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


def translate_the_lyrics(changes,user_id,artist,title):
    BUCKET_NAME = "lyrics-from-user"
    FILE_NAME = "{}-{}-{}.json".format(artist,title,user_id)
    s3 = boto3.resource('s3')
    obj = s3.Object(BUCKET_NAME, FILE_NAME)
    jsonData = json.loads(obj.get()['Body'].read().decode('utf-8'))
    
    for change in changes:
        which_lyric = change['id'].split("-")
        print("Content：{}".format(which_lyric))
        i = int(which_lyric[1])
        j = int(which_lyric[2])
        translation = change['value']
        print("Translated: {}".format(translation))
        jsonData['lines'][i]["splited-version"][j]["translated-text"] = translation
    
    s3.Object(BUCKET_NAME,FILE_NAME).put(Body=json.dumps(jsonData))


@app.route('/start-project/{user_id}/{user_name}/{email_address}/{title}/{artist}/{lyrics}',cors=True)
def start_project(user_id,user_name,email_address, title, artist, lyrics):
    lyrics = urllib.parse.unquote(lyrics)
    lyrics_obj = Lyrics(lyrics)
    upload_lyrics(title=title, artist=artist,
                  id_for_user=user_id, lyrics=lyrics_obj.to_json())

    add_new_project(title=title,artist=artist,user_id=user_id,name=user_name,email_address=email_address)
    return {"successful" : True}

@app.route('/load-project/{user_id}/{title}/{artist}',cors=True)
def get_project(user_id,title,artist):
    BUCKET_NAME = "lyrics-from-user"
    FILE_NAME = "{}-{}-{}.json".format(artist,title,user_id)
    s3 = boto3.resource('s3')
    obj = s3.Object(BUCKET_NAME, FILE_NAME)
    jsonFile = obj.get()['Body'].read().decode('utf-8')  
    return jsonFile

@app.route('/get_all_projects_list/{user_id}',cors=True)
def get_all_projects_list(user_id):
    response = user_table.query( 
        KeyConditionExpression=Key('id').eq(user_id)
    )
    return response['Items']


@app.route('/auto_save/{userid}/{title}/{artist}/{data}', cors=True)
def auto_save(userid, title,artist, data):
    # Because the clinet's http request is using utf-8
    # So we need to use urllib to decode it
    changes = json.loads(urllib.parse.unquote(data), encoding='utf-8')
    translate_the_lyrics(changes=changes,user_id=userid,artist=artist,title=title)
    return {"successful": True}

@app.route("/translate/{word}",cors=True)
def translate(word):
    translate = boto3.client(service_name='translate',use_ssl=True)
    result = translate.translate_text(Text=word, 
            SourceLanguageCode="en", TargetLanguageCode="zh")
    print(result.get('TranslatedText'))
    return {"translation" : result.get('TranslatedText')},
    # return [{"translation" : "Test"}]



@app.route('/test', cors=True)
def test():
    with open('test.json', 'rb') as f:
        lyric = f.read()
        return lyric
