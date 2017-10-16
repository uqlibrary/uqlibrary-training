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
    # create a bower-wct.json which is a bower.json file that tells it how to install wct
    # then run bower on the polymer development, using .bowerrc to put it at ../
    # then overwrite those bower files and run bower again for wct
    # This will put prod files into the ../ location and wct files into bower_components

    if [ ! -f .bowerrc ] ; then
        echo "error in ./bin/codeship-test.sh: .bowerrc is missing.\nRan ./bin/codeship-test.sh with a problem perhaps, so the replace didnt happen? Replace it from github"
        exit 1
    fi

    if [ ! -f bower.json ] ; then
        echo "error in ./bin/codeship-test.sh: bower.json is missing.\nRan ./bin/codeship-test.sh with a problem perhaps, so the replace didnt happen? Replace it from github"
        exit 1
    fi

    # back up the files for later replacement
    cp -v bower.json bower.json.orig
    cp -v .bowerrc .bowerrc.orig

    echo "do initial bower install"
    bower install

    # now that bower has installed for the main components, remove them and copy in the wct bower.json file
    echo "replace build bower.json file"
    rm bower.json
    rm .bowerrc
    mv -v bower-wct.json bower.json
    echo "do bower install for testing"
    bower install

    # bower install of web-components-tester complete - replace files (for development)
    echo "replace original bower json"
    mv -v bower.json bower-wct.json
    mv -v bower.json.orig bower.json
    mv -v .bowerrc.orig .bowerrc
    rm bower.json.orig
    rm .bowerrc.orig

    wct
fi