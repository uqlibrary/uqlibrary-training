#!/bin/bash

if [ {$CI_BRANCH} != 'gh-pages' ]; then
    echo "Testing branch: ${CI_BRANCH}"

    bower install

    # this error is being produced for wct v6:
#    Error:
#The web-component-tester Bower package is not installed as a dependency of this project (uqlibrary-training).
#
#Please run this command to install:
#bower install --save-dev web-component-tester
#
#Web Component Tester >=6.0 requires that support files needed in the browser are installed as part of the project's dependencies or dev-dependencies. This is to give projects greater control over the versions that are served, while also making Web Component Tester's behavior easier to understand.
#
#Expected to find a package.json or bower.json or .bower.json at: /home/rof/src/github.com/uqlibrary/uqlibrary-training/bower_components/web-component-tester/

    # this kludge creates a symlinked copy of wct in the required place

    echo "make ${PWD}/bower_components/web-component-tester reference original files at ${PWD}/../web-component-tester "
    mkdir ${PWD}/bower_components/
    ln -sf "${PWD}/../web-component-tester" "${PWD}/bower_components/web-component-tester"

    wct
fi