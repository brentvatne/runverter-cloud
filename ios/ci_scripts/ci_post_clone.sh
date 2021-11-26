#!/bin/sh

set -e

mkdir homebrew && curl -L https://github.com/Homebrew/brew/tarball/master | tar xz --strip 1 -C homebrew
export PATH=$PATH:$(pwd)/homebrew

brew install node@16
brew install yarn
brew install cocoapods

cd $CI_WORKSPACE && yarn
cd $CI_WORKSPACE/ios && pod install