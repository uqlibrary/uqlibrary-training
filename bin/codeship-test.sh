#!/bin/bash

if [ {$CI_BRANCH} != 'gh-pages' ]; then
    echo "Testing branch: ${CI_BRANCH}"

    bower install
    wct
fi