import os
import sys
import threading
import subprocess
import time
import pyautogui

class Robot(threading.Thread):
    
    def __init__(self, seedWords, password):
        threading.Thread.__init__(self)
        self.seedWords = seedWords
        self.password = password
 
    def run(self):
        # Enter Seed Words
        pyautogui.typewrite(self.seedWords)
        pyautogui.press('enter')

        # Enter Password
        pyautogui.typewrite(self.password)
        pyautogui.press('enter')

        # Enter Confirm Password
        pyautogui.typewrite(self.password)
        pyautogui.press('enter')

def createWallet(keyfile, password, seedWords):

    # Start a new Subprocess Asynchronously which runs helium-cli
    p = subprocess.Popen(["helium-wallet.exe", "--format", "json", "create", "basic", "--seed", "mobile", "--output", keyfile])

    # Start a New Thread
    # Which will write to console using stdin
    robot = Robot(seedWords, password)
    robot.start()

    # Wait for the sub process to finish
    # Otherwise Main thread will close and wallet will not be created
    p.wait()    

if __name__ == "__main__":

    # Catching Params From PHP Script
    # Also Checking for possible wrong parameters
    argsLen = len(sys.argv)
    keyfile = sys.argv[1]
    password = sys.argv[2]
    seedWords = " ".join(sys.argv[3:])

    if argsLen != 15:
        print("-1")
    if os.path.isfile(keyfile):
        print("-2")
    else:
        # 1st Param = File name
        # 2nd Param = Password
        # 3rd Param = Seed Words
        createWallet(keyfile, password, seedWords)
        print("1")
