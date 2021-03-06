var DateFormat = require('dateutils').DateFormat
var DateParse = require('dateutils').DateParse
var toggle = require('./util').toggle

module.exports = function(container, calendarBody, executeCallback, locale, params, getElemDate, popupBehavior, startDate, setStartField) {
  return {
    showInitialSelection: showInitialSelection,
    initEvents          : initEvents,
    addRangeLengthLabel : function () { },
    addEndDateLabel     : function () { },
    addDateClearingLabel: addDateClearingLabel,
    setSelection        : setSelection,
    performTrigger      : performTrigger
  }

  function showInitialSelection() {
    if(startDate) {
      setFieldValues(startDate)
      var clearDates = container.querySelector('.clearDates')
      if(clearDates) toggle(clearDates, true)
    }
  }

  function initEvents() {
    initSingleDateCalendarEvents()
    setSelection(fieldDate(params.startField) || startDate)
  }

  function fieldDate(field) { return field && field.value && field.value.length > 0 ? DateParse.parse(field.value, locale) : null }

  function setSelection(date) {
    var selectedDateKey = date && DateFormat.format(date, 'Ymd', locale)
    if(selectedDateKey in calendarBody.dateCellMap) {
      setSelectedDate(date, calendarBody.getDateCell(calendarBody.dateCellMap[selectedDateKey]))
    }
  }

  function setSelectedDate(date, cell) {
    var selectedElem = container.querySelector('td.selected')
    selectedElem && selectedElem.classList.remove('selected')
    cell.classList.add('selected')
    setFieldValues(date)
  }

  function setFieldValues(date) {
    container.calendarRange = date
    setStartField(date)
    setDateLabel(DateFormat.format(date, locale.weekDateFormat, locale))
  }

  function addDateClearingLabel() {
    if(params.allowClearDates) {
      container.querySelector('.continuousCalendar').insertAdjacentHTML('beforeend', '<div class="label clearLabel">' +
        '<span class="clearDates clickable" style="display: none">' + locale.clearDateLabel + '</span></div>')
    }
  }

  function performTrigger() {
    container.calendarRange = startDate
    executeCallback(container, startDate, params)
  }

  function initSingleDateCalendarEvents() {
    container.addEventListener('click', function(e) {
      var dateCell = e.target.tagName === 'DIV' ? e.target.parentNode : e.target
      if (dateCell.classList.contains('date') && !dateCell.classList.contains('disabled')) {
        var selectedDate = getElemDate(dateCell)
        setSelectedDate(selectedDate, dateCell)
        popupBehavior.close()
        executeCallback(container, selectedDate, params)
      }
    })
    var clearDates = container.querySelector('.clearDates')
    if(clearDates) clearDates.addEventListener('click', clickClearDate)
  }

  function setDateLabel(val) {
    container.querySelector('span.startDateLabel').innerText = val
    if(params.allowClearDates) {
      toggle(container.querySelector('.clearDates'), val !== '')
    }
  }

  function clickClearDate() {
    container.querySelector('td.selected').classList.remove('selected')
    params.startField.value = ''
    setDateLabel('')
  }
}
