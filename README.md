# uqlibrary-training

[![Codeship Status for uqlibrary/uqlibrary-mylibrary](https://codeship.com/projects/f0334440-bdaa-0133-87bd-2a1d867cc1c8/status?branch=master)](https://codeship.com/projects/f0334440-bdaa-0133-87bd-2a1d867cc1c8)
[![Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-training.svg)](https://david-dm.org/uqlibrary/uqlibrary-training.svg)
[![Dev Dependency Status](https://david-dm.org/uqlibrary/uqlibrary-training/dev-status.svg)](https://david-dm.org/uqlibrary/uqlibrary-training?type=dev)

uqlibrary-training is a simple list view showing training links for the Library at the University of Queensland.

Full documentation can be found at [GitHub Pages](http://uqlibrary.github.io/uqlibrary-training).

### Getting Started
Install Node.JS and run the following oneliner in the project directory:
```sh
npm install -g bower && bower install
```

### Running with live data locally
Add dev-app.library.uq.edu.au to your /etc/hosts or equivalent file

```
gulp live
```

This comments out the calls to create the Mock cookies in index.html.  Note the browser often caches the html so 
check the source for the calls and do a hard refresh if they aren't commented out.

If you still have the mock cookies in your browser, delete them via your browser.

Use the Masquerading function at app.library.uq.edu.au/v1/home to masquerade as a user with data you are interested in.

Return to your demo page, refresh and you should be getting live data.

### Developing
- Please adhere to the Polymer code style guide provided at [Style Guide](http://polymerelements.github.io/style-guide/). 
- Colors and common styles are imported (bower install) from [uqlibrary-styles](http://github.com/uqlibrary/uqlibrary-styles).
- GitHub pages should be updated after every commit to Master by running the "generate-gh-pages.sh" in the /bin/ directory

### Testing
Tests are run using the Web Component Tester. Either navigate to /tests/index.html in a browser or using the command line:
```sh
wct --local all
```

