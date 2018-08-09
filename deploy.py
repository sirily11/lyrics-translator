import subprocess
import time


commit_msg = input("Enter your commit message here: ")
start_time = time.time()
print ("*********************************************")
print("start upload the python serverless code")
output_from_chalice = subprocess.check_output('cd translator-python-server && pipenv run chalice deploy',shell=True)
print("Finished upload the python serverless code")
print ("*********************************************")
output_from_commit = subprocess.check_output('git add . && git commit -m "{}"'.format(commit_msg),shell=True)
output_from_push = subprocess.check_output("git push",shell=True)
print ("*********************************************")
print("Output from chalice: {}".format(output_from_chalice))
print ("*********************************************")
print("Output from git:{}".format(output_from_commit))
print("Output from git:{}".format(output_from_push))
print ("*********************************************")
print("Total time:{}".format(time.time()- start_time))