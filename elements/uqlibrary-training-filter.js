(function () {
  Polymer({

    is: 'uqlibrary-training-filter',

    properties: {

      /**
       * Specifies list of campuses, auto populated from api
       * @type {Array}
       */
      campusList: {
        type: Array
      },

      /**
       * Specifies list of event months, auto populated from api
       * @type {Array}
       */
      monthList : {
        type: Array
      },

      filterCriteria: {
        type: Object,
        value: function () {
          return {
            keyword: '',
            month: '',
            campus: ''
          };
        }
      },

      searchString: {
        type: String,
        observer: "_searchStringChanged"
      },

      searchMonth: {
        type: String,
        observer: "_searchMonthChanged"
      },

      searchCampus: {
        type: String,
        observer: "_searchCampusChanged"
      },

      /**
       * Google Analytics app name of this component
       * @type {String}
       */
      _gaAppName: {
        type: String,
        value: ''
      },

      /**
       * Specifies list of campuses, auto populated from api
       * @type {Array}
       */
      campusList: {
        type: Array
      },

      /**
       * Specifies list of event months, auto populated from api
       * @type {Array}
       */
      monthList : {
        type: Array
      }

    },

    _searchStringChanged: function() {
      this.set('filterCriteria.keyword', this.searchString);
    },

    _searchMonthChanged: function() {
      console.log(this.searchMonth);
      this.set('filterCriteria.month', this.searchMonth);
    },

    _searchCampusChanged: function() {
      this.set('filterCriteria.campus', this.searchCampus);
    },

    ready: function () {

    },

    /**
     * Called when an event is clicked on the list page
     * @param e
     */
    _eventClicked: function (e) {
    }
  });
})();
