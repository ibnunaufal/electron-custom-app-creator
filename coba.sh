#/bin/bash

# Check if figlet is installed
if ! command -v figlet &> /dev/null
then
    echo "figlet could not be found, please install it first."
    exit
fi

# Print "HELLO WORLD" in big size
figlet "HELLO WORLD"