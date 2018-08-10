import subprocess
import time
import boto3
import os

current_folder = os.getcwd()
if(os.path.basename(current_folder) != "lyrics-translator"):
    print("Please put this file in to the lyrcis-translator folder")
    k=input("press close to exit") 
    exit()

s3 = boto3.resource('s3')
BUCKET_NAME = "lyrics-translation-tool"
NUM_OF_STAR = 50

commit_msg = input("Enter your commit message here: ")
selection = input('Select the part you want to deploy seperatly [default is all][server,s3,github] ')

start_time = time.time()

def uploadS3():
    upload_list = ['index.html','editing-page.html','style-bundle.js','bundle.css','app.css','app.scss','bundle.js','translation.js']
    for item in upload_list:
        print("Start upload {} to s3".format(item))
        s3.Object(BUCKET_NAME,item).put(Body=open(item,'rb'))

def print_line(number):
    line = ""
    for i in range(number):
        line += '*'
    print(line)

try:
    if selection == "server" or "":
        #Upload the severless code
        print_line(NUM_OF_STAR)
        print("start upload the python serverless code")
        output_from_chalice = subprocess.check_output('cd translator-python-server && pipenv run chalice deploy',shell=True)
        print("Finished upload the python serverless code")

    #build the website
    print_line(NUM_OF_STAR)
    print("Start building the website")
    output_from_compile = subprocess.check_output('npm run-script build',shell=True)

    if selection == "github" or "":
        #git
        print_line(NUM_OF_STAR)
        output_from_commit = subprocess.check_output('git add . && git commit -m "{}"'.format(commit_msg),shell=True)
        output_from_push = subprocess.check_output("git push",shell=True)

    if selection == "s3" or "":
        #uoload the file to s3
        print_line(NUM_OF_STAR)
        uploadS3()

    #print the output before
    print_line(NUM_OF_STAR)
    print("Output from chalice: {}".format(output_from_chalice))

    print_line(NUM_OF_STAR)
    print("Output from git:{}".format(output_from_commit))
    print("Output from git:{}".format(output_from_push))

    print_line(NUM_OF_STAR)
    print("Total time:{}".format(time.time()- start_time))
    k=input("press close to exit")
except Exception as e:
    print(e)
    input("press close to exit")