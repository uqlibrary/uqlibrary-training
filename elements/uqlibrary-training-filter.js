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

      _selectedCampusIndex: {
        type: Number,
        observer: "_searchCampusChanged"
      },

      _selectedMonthIndex: {
        type: Number,
        observer: "_searchMonthChanged"
      },

      /**
       * Google Analytics app name of this component
       * @type {String}
       */
      gaAppName: {
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

    observers: [
      '_searchKeywordChanged(filterCriteria.keyword)'
    ],

    _searchMonthChanged: function(newValue, oldValue) {
      this.$.ga.addEvent("filter", 'by month');

      if (this._selectedMonthIndex > 0)
        this.set('filterCriteria.month', this.monthList[newValue - 1]);
      else
        this.set('filterCriteria.month', '');
    },

    _searchKeywordChanged: function(newValue, oldValue) {
      if (newValue !== null && typeof(newValue) !== undefined && newValue !== '') {
        this.$.ga.addEvent("filter", 'by keyword');
      }
    },

    _searchCampusChanged: function(newValue, oldValue) {
      this.$.ga.addEvent("filter", 'by campus');

      if (this._selectedCampusIndex > 0)
        this.set('filterCriteria.campus', this.campusList[newValue - 1]);
      else
        this.set('filterCriteria.campus', '');
    },

    _clearFilter: function(event) {
      this.$.ga.addEvent("filter", 'clear filter');

      this.set('filterCriteria.keyword', '');
    },

    ready: function () {
    }

  });
})();
