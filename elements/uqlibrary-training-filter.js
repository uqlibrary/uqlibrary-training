(function () {
  Polymer({

    is: 'uqlibrary-training-filter',

    properties: {

      filterCriteria: {
        type: Object,
        value: function () {
          return {
            keyword: '',
            week: '',
            campus: ''
          };
        }
      },

      _selectedCampusIndex: {
        type: Number,
        observer: "_searchCampusChanged"
      },

        _selectedWeekIndex: {
        type: Number,
        observer: "_searchWeekChanged"
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
      weekList : {
        type: Array
      },

      quicklinkList: {
            type: Array
      }
    },

    observers: [
      '_searchKeywordChanged(filterCriteria.keyword)'
      ],

      _searchWeekChanged: function(newValue, oldValue) {
      this.$.ga.addEvent("filter", 'by period');
      if (this._selectedWeekIndex > 0)
        this.set('filterCriteria.week', this.weekList[newValue - 1]);
      else
        this.set('filterCriteria.week', '');
    },

    _searchKeywordChanged: function(newValue, oldValue) {
      if (newValue !== null && typeof(newValue) !== undefined && newValue !== '') {
        this.$.ga.addEvent("filter", 'by keyword');
      }
    },

    _quickLinkClicked: function(e) {
      this.$.ga.addEvent("filter", 'quicklink ' + e.model.item.label);

      this.set('filterCriteria.keyword', e.model.item.term);
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
