with open('test.txt','r') as f:
    lines = f.readlines()
    with open('process.txt','w') as f1:
        returnStr = ""
        for line in lines:
            returnStr += line + "*newline*"
        f1.write(returnStr)


