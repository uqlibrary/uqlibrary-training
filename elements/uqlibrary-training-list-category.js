(function () {
  Polymer({
    is: 'uqlibrary-training-list-category',
    properties: {
      gaAppName: {
        type: String
      },
      filterCriteria: {
        type: Object
      },
      category: {
        type: Object
      }
    },

    filterEventsByKeyword: function(filterCriteria) {
      return function(trainingEvent) {
        if (!filterCriteria)
          return true;

          var fitsCriteria =  trainingEvent.name.toLowerCase().indexOf(filterCriteria) >= 0
              || trainingEvent.details.toLowerCase().indexOf(filterCriteria) >= 0;

        return fitsCriteria;
      };
    },

    filterEvents: function(keyword, month, campus) {
      return function(trainingEvent) {

        return (!keyword || trainingEvent.name.toLowerCase().indexOf(keyword) >= 0 || trainingEvent.details.toLowerCase().indexOf(keyword) >= 0)
            && (!month || moment(trainingEvent.start).format("MMMM").toLowerCase().indexOf(month.toLowerCase()) >= 0)
            && (!campus || trainingEvent.categories.campus.join(',').toLowerCase().indexOf(campus.toLowerCase()) >= 0);
      };
    },

    _formatDate: function(date) {
      return moment(date).format("ddd D MMM YYYY");
    },

    toggle: function(event) {
      var toggleId = 'collapse' + event.model.trainingEvent.entityId;
      var paperItemId = 'item' + event.model.trainingEvent.entityId;

      //close all other toggles
      var openedItems = this.querySelectorAll('.iron-collapse-opened');
      for(var index = 0; index < openedItems.length; index++) {
        var item = openedItems[index];
        var currentPaperItemId = 'item' + item.getAttribute('data-id');

        //do not toggle current item
        if (item.id.indexOf(toggleId) < 0) {
          item.toggle();
          this.querySelector('#' + currentPaperItemId + ' .up').toggleClass('hidden');
          this.querySelector('#' + currentPaperItemId + ' .down').toggleClass('hidden');
        }
      }

      this.querySelector('#' + toggleId).toggle();
      this.querySelector('#' + paperItemId + ' .up').toggleClass('hidden');
      this.querySelector('#' + paperItemId + ' .down').toggleClass('hidden');
    }

  });
})();
