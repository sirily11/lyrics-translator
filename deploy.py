import subprocess
import time


commit_msg = input("Enter your commit message here: ")
start_time = time.time()
print (*range(20))
print("start upload the python serverless code")
output_from_chalice = subprocess.check_output('cd translator-python-server && pipenv run chalice deploy',shell=True)
print("Finished upload the python serverless code")
print (*range(20))
output_from_git = subprocess.check_output('git add .&&git commit -m "{}" &&git push &&{}&&{}'.
                                            format(commit_msg,github_username,github_password),
                                            shell=True)
print (*range(20))
print("Output from chalice: {}".format(output_from_chalice))
print (*range(20))
print("Output from git:{}".format(output_from_git))
print (*range(20))
print("Total time:{}".format(time.time()- start_time))