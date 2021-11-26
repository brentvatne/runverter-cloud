#!/bin/sh

set -e

/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

brew install node@16
brew install yarn
brew install cocoapods

cd $CI_WORKSPACE && yarn
cd $CI_WORKSPACE/ios && pod install