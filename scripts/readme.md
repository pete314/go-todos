# Introduction
The scripts in this folder are helping to setup the development and runtime environment for the current repository.

## Dependencies
The scripts requires the following application to be installed in order to run:
* git: git should be installed with ssh configured (if not please change 'git clone ' to https instead git@...) - [GIT download](https://git-scm.com/downloads) and [Setup ssh for git](https://help.github.com/articles/generating-an-ssh-key/)

* nodejs: required for running the UI - [NodeJS download](https://nodejs.org/en/download/)

* npm: node package manager is required in order to get 'http-server' package - [Install package manager NPM](https://docs.npmjs.com/getting-started/installing-node)

* http-server: grab the package with 'npm install http-server' - [Install http-server](https://www.npmjs.com/package/http-server)

## Script execution

_Windows_ :
1. Open command prompt in the location where project should be saved
2. execute "start create_dev_structure.bat"

_nix*_:
1. Open shell in directory where the porject should be saved
2. execute "sudo chmod +x create_dev_structure.sh && sudo sh create_dev_structure.sh"
