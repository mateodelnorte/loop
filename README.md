# loop-things

loop-things expands commands to work simultaneously against any number of subdirectories in your current working path. Want to perform a `git status` on 15 projects at once? With loop-things, you can do it!

## Installation

`npm install -g loop-things`

## Basic Usage

loop-things installs a `loop` command which you can leverage from the command line, in your package.json scripts, etc. The syntax is super simple. Just `loop [your command]`. If the command you wish to run consists of multiple words, place the command in quotes: `loop "your --you | really -R | long -o | command"`. 

In a folder with the following structure: 
```
./git
./bin
./lib
./node_modules
./test
./index.js
./package.json
```

executing `loop pwd` yields the following results: 
```
➜  nycnode-site git:(master) loop pwd

.git
/Users/mateodelnorte/development/nycnode/nycnode-site/.git

lib
/Users/mateodelnorte/development/nycnode/nycnode-site/lib

node_modules
/Users/mateodelnorte/development/nycnode/nycnode-site/node_modules

test
/Users/mateodelnorte/development/nycnode/nycnode-site/test
```

## .looprc

loop can use a `.looprc` file to customize how loop behaves in a particular folder. Installing a `.looprc` file to a folder is simple: 

`loop --init` results in the following file being created: 

```
{
  "ignore": [ ".git", ".vagrant", ".vscode", "node_modules" ]
}
```

Now, when we perform the same command we did previously `loop pwd`, `loop` will recognize the `.looprc` file and see the `.git` folder is ignored - excluding it from the results: 
```
➜  nycnode-site git:(master) loop pwd

lib
/Users/mateodelnorte/development/nycnode/nycnode-site/lib

node_modules
/Users/mateodelnorte/development/nycnode/nycnode-site/node_modules

test
/Users/mateodelnorte/development/nycnode/nycnode-site/test
```

## On to the Fun Stuff

Neat, so now we can ignore folders that we don't work with directly. Imagine having a folder that contains all your project repositories for work. Wish you could find out how many files are in each? 
```
➜  nycnode git:(master) ✗ loop "find . -path ./node_modules -prune -o -type f  | wc -l"

nycnode-denormalizer
125

nycnode-meetup-ingestor
148

nycnode-site
1106

nycnode-user-ingestor
103

nycnode-youtube-ingestor
81
```

Better yet, what if you're starting a new feature that spans a distributed system composed of many microservices and a site or two? 

```
➜  nycnode git:(master) ✗ loop "git checkout master"

nycnode-denormalizer
Already on 'master'

nycnode-meetup-ingestor
Already on 'master'

nycnode-site
Already on 'master'

nycnode-user-ingestor
Already on 'master'

nycnode-youtube-ingestor
Already on 'master'

➜  nycnode git:(master) ✗ loop "git pull origin master"

nycnode-denormalizer
From github.com:mateodelnorte/nycnode-denormalizer
 * branch            master     -> FETCH_HEAD

nycnode-meetup-ingestor
From github.com:mateodelnorte/nycnode-meetup-ingestor
 * branch            master     -> FETCH_HEAD

nycnode-site
From github.com:mateodelnorte/nycnode-site
 * branch            master     -> FETCH_HEAD

nycnode-user-ingestor
From github.com:mateodelnorte/nycnode-user-ingestor
 * branch            master     -> FETCH_HEAD

nycnode-youtube-ingestor
From github.com:mateodelnorte/nycnode-youtube-ingestor
 * branch            master     -> FETCH_HEAD
 
➜  nycnode git:(master) ✗ loop "git checkout -b feature/my-new-feature"

nycnode-denormalizer
Switched to a new branch 'feature/my-new-feature'

nycnode-meetup-ingestor
Switched to a new branch 'feature/my-new-feature'

nycnode-site
Switched to a new branch 'feature/my-new-feature'

nycnode-user-ingestor
Switched to a new branch 'feature/my-new-feature'

nycnode-youtube-ingestor
Switched to a new branch 'feature/my-new-feature'
```

Now you're ready to code away across your whole system! `loop "git status"` will show you your status across all repos. `loop "git diff"`, `loop "git push origin feature/my-new-feature"`, and other commands all work like you'd think!

## TODO: 
- plugins
