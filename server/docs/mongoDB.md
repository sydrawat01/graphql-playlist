# MongoDB

## Installing on MacOS

Few simple steps to get mongodb up and running on your MacOS.

### Prerequisites

#### Install XCode

Apple's Xcode includes command line tools that are required by _brew_. It is available on the app store. If you don't want to install XCode itself, you can install the command line tools using the following command:

`xcode-select --install`

In case you get an error, or a message something similar to the one described here : `xcode-select: error: command line tools are already installed, use "Software Update" to install updates`, you can remove all the files and start fresh:

- `sudo rm -rf \$(xcode-select -print-path)` # Enter root password. No output is normal.

- `sudo rm -rf /Library/Developer/CommandLineTools` # Enter root password.

- `xcode-select --install`

#### Homebrew

Make sure you have `homebrew` installed on your MacOS.

If you don't have `homebrew` installed, you can do so by running the command:

`/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"`

#### Tap the MongoDB Homebrew Tap

Issue the following command from the terminal:

`brew tap mongodb/brew`

### Procedure

From the terminal, issue the following command:

`brew install mongodb-community`

> If you have previously installed an older version of the formula, you may encounter a ChecksumMismatchError. To resolve, see [Troubleshooting ChecksumMismatchError](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/#troubleshooting-checksumerror).

## Run MongoDB Community Edition

These instructions assume that you are using the default settings.

It is recommended to run MongoDB as a macOS service, as doing so sets the correct system ulimit values automatically (see [ulimit settings](https://docs.mongodb.com/manual/reference/ulimit/#ulimit-settings) for more information).

- To run MongoDb (i.e, the [mongod](https://docs.mongodb.com/manual/reference/program/mongod/#bin.mongod) process) **as a macOS service**, issue the following command:

  `brew services start mongodb-community`

- To stop it, use the following command:

  `brew services stop mongodb-community`

- To verify that MongoDB is running, search for **mongod** in your running processes:
  `ps aux | grep -v grep | grep mongod`

  > You can also view the log file to see the current status of your mongod process: /usr/local/var/log/mongodb/mongo.log.

## Connect and Use MongoDB

To begin using MongoDB, connect a mongo shell to the running instance. From a new terminal, issue the following:
`mongo`

For any doubts regarding the installation, visit the [mongo website](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-os-x/).
