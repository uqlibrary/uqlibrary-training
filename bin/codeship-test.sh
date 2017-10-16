#!/bin/bash

if [ {$CI_BRANCH} != 'gh-pages' ]; then
    echo "Testing branch: ${CI_BRANCH}"

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

    # kludge:
    # * create a bower-wct.json which is a bower.json file that tells it how to install wct
    # in test:
    # * run the regular bower.json
    # * delete .bowerrc & rename bower-wct.json to bower.json
    # run (the new) bower.json
    # this will put prod files into the ../ location and wct files into bower_components

    bower install

#    rm bower.json
#    rm .bowerrc
#    mv bower-wct.json bower.json
#    bower install

    wct
fi