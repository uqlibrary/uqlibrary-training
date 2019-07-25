# uqlibrary-training

[![Codeship Status for uqlibrary/uqlibrary-mylibrary](https://codeship.com/projects/f0334440-bdaa-0133-87bd-2a1d867cc1c8/status?branch=master)](https://codeship.com/projects/136640)
[![Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-training.svg)](https://david-dm.org/uqlibrary/uqlibrary-training)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-training/dev-status.svg)](https://david-dm.org/uqlibrary/uqlibrary-training?type=dev)

uqlibrary-training is a simple list view showing training links for the Library at the University of Queensland.

Full documentation and demo can be found at [GitHub Pages](http://uqlibrary.github.io/uqlibrary-training/uqlibrary-training/).

## Getting Started

Install Node.JS and run the following oneliner in the project directory:

```sh
npm install -g bower gulp-cli web-component-tester polymer-cli
npm install
bower install
```

## Running with live data locally

Add `dev-app.library.uq.edu.au` to your `/etc/hosts` or equivalent file

```sh
gulp live
```

This comments out the calls to create the Mock cookies in `index.html`. Note the browser often caches the html so check the source for the calls and do a hard refresh if they aren't commented out.

If you still have the mock cookies in your browser, delete them via your browser.

Return to your demo page, refresh and you should be getting live data.

## Developing

* Please adhere to the Polymer code style guide provided at [Style Guide](http://polymerelements.github.io/style-guide/).
* Colors and common styles are imported (bower install) from [uqlibrary-styles](http://github.com/uqlibrary/uqlibrary-styles).
* A preview of the component can be viewed locally by running `npm start`. Use the second URL from the command output.
* GitHub pages should be updated after every commit to `polymer1.0` branch by running `bin/generate-gh-pages.sh`

## Testing

Tests are run using the Web Component Tester.

```sh
npm test
```

### UA testing

We have a testing branch on Drupal at <https://library.stage.drupal.uq.edu.au/library-services/training>

If you:

* Commit your desired change to master branch of `uqlibrary-training`
* Make a new release on github for repo `uqlibrary-training`
* Edit baseApiUrl on uqlibrary-api.html in repo uqlibrary-api to point to https://api.library.uq.edu.au/staging, commit and make a release
* Push branch `master` of repo `uqlibrary-reusable-components` on codeship (usually re-run the last successful build on codeship)
* Wait for the invalidation on AWS

then you will be able to preview a change on this page of drupal.

(Remember to revert uqlibrary-api when you finish!!!)

Bear in mind master branches of all of uqlibrary-api and uqlibrary-training and uqlibrary-reusable-components must be considered 'locked' until these changes are approved or rolledback as any pushes from master to prod of reusable will take the changes you are testing live :( (If this becomes an ongoing problem we can define a different branch of reusable as staging and ask ITS to change the branch they use on Drupal)
