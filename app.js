'use strict'
/**
* Peak log is the constructor function for user peak logs
* Functions associated with peak log data manipulation will be prototypes.
*/
function PeakLog () {
  this.peaks = []
}

/**
* User peak log is used to store completed peak data for the user.
* Functions associated with peak log data manipulation will be prototypes.
*/
const userPeakLog = new PeakLog()

/**
* Start the app.
* - renderWelcomePage() function is called if local storage is empty
* - renderPhotoList() function is called if data is in local storage
*/
function startApp () {
  if (!localStorage.getItem('userPeakLog')) {
    console.log('no local storage, render welcome page')
    handleLogoClick()
    hideContent()
    renderWelcomePage()
  }
}

/**
* Handle logo click.
* - logo ID: #logo
* - startApp() to decide what to load
*/
function handleLogoClick () {
  $('#logo').on('click', function () {
    startApp()
  })
}

/** Hide content.
* - Hide all content sections
* - Sections class = content
* - Add class = hidden
*/
function hideContent () {
  $('.content').addClass('hidden')
}

/**
* Render welcome page.
* - Hide all sections - hideContent()
* - Remove class = hidden from welcome page section - ID: #welcome-page
* - Handle start tracking button click - handleStartTrackingBtnClick()
*/
function renderWelcomePage () {
  console.log('welcome page rendered')

  $('#welcome-page').removeClass('hidden')
  handleStartTrackingBtnClick()
}

/**
* Handle start tracking button click.
* - Button ID: #start-tracking-btn
* - Render add peak form page - renderAddPeakPage()
*/
function handleStartTrackingBtnClick () {
  $('#start-tracking-btn').on('click', function () {
    console.log('start tracking button clicked')
    renderAddPeakPage()
  })
}

/**
* Render the add peak form page.
* - Hide all sections - hideContent()
* - Populate datalist options - populateDatalist()
* - Show add peak section - ID: #add-peak-page
* - Handle submit button click - handleSubmitForm()
*/
function renderAddPeakPage () {
  console.log('add peak page rendered')
  hideContent()
  populateDatalist()
  $('#add-peak-page').removeClass('hidden')
  handleSubmitForm()
}

/**
* Populate Datalist.
* - Get request to 14er API to get list of all peak names
* - Sort alphabetically in an array
* - For each peak name, add an option in the datalist - ID: #peak-list
*/
function populateDatalist () {

}

/**
* Handle submit form.
* - Form button ID: #submit-form
* - Validate form - validateForm()
* - Prevent default
* - Clear form inputs
* - Add peak to userPeakLog - addPeak()
* - Render list page - renderPeakList()
*/
function handleSubmitForm () {
  $('#submit-form').on('click', function (event) {
    event.preventDefault()

    if (validateForm()) {
      console.log('form submitted')
      $('#peak-climbed').val('')
      $('#date-climbed').val('')
      $('#error-message').html('')
      addPeak()
      renderPeakList()
    }
  })
}

/**
* Validate form.
* - check that all inputs are entered
* - show error message if inputs are missing
*/
function validateForm () {
  $('#error-message').html('')

  let peakName = $('#peak-climbed').val()
  let dateClimbed = $('#date-climbed').val()
  let message = null

  if (!peakName && !dateClimbed) {
    message = 'Please enter peak name and select date climbed.'
  }
  else if (!peakName) {
    message = 'Please enter peak name.'
  }
  else if (!dateClimbed) {
    message = 'Please select date climbed.'
  }

  if (message) {
    $('#error-message').html(`${message}`)
  }
  else {
    return true
  }
}

/**
* Render peak list page.
* - Hide all content sections - hideContent()
* - Show header add peak button - ID: #add-peak-btn
* - Show navigation section - ID: #navigation
* - Show peak list page section - ID: #peak-list-page
* - Populate list content - populatePeakList()
* - Handle navigation map button click - handleNavMapBtnClick()
* - Handle remove peak button click - handleRemovePeakBtnClick()
* - Handle add peak button click - handleAddPeakBtnClick()
* - Handle sort by dropdown click - handleSortByClick()
*/
function renderPeakList () {
  console.log('peak list page rendered')
  hideContent()
  $('#add-peak-btn').removeClass('hidden')
  $('#navigation').removeClass('hidden')
  $('#peak-list-page').removeClass('hidden')
  populatePeakList()
  handleNavMapBtnClick()
  handleRemovePeakBtnClick()
  handleAddPeakBtnClick()
  handleSortByClick()
}

/**
* Populate peak list.
* - Clear out existing peak list section - ID: #peak-list
* - Generate HTML for each peak in userPeakLog
* - Add HTML to peak list section - ID: #peak-list
*/
function populatePeakList () {

}

/**
* Handle sort by click.
* - Find out which option the user selected
* - Call sort function based on selection
* - Re-generate peak list in new order - populatePeakList()
*/
function handleSortByClick () {

}

/**
* Handle add peak button click.
* - Render add peak form page - renderAddPeakPage()
*/
function handleAddPeakBtnClick () {

}

/**
* Handle navigation map button click.
* - Render peak map page - renderPeakMapPage()
*/
function handleNavMapBtnClick () {

}

/**
* Render peak map page.
* - Hide all content sections - hideContent()
* - Show header add peak button - ID: #add-peak-btn
* - Show navigation - ID: #navigation
* - Toggle selected class from #list-btn to #map-btn
* - Show peak map section - ID: #peak-map
* - Render map with pins at peaks - renderMap()
* - Handle navigation list button click - handleNavListBtnClick()
* - Handle add peak button click - handleAddPeakBtnClick()
*/
function renderPeakMapPage () {

}

/**
* Handle navigation list button click.
* - Render list page - renderPeakList()
*/
function handleNavListBtnClick () {

}

/**
* Handle remove peak button click.
* - find out neam of peak being removed - class: .caption-header
* - remove peak from user log - removePeak()
* - update peak list - populatePeakList()
*/
function handleRemovePeakBtnClick () {

}

/**
* Add peak prototype function.
* - Get peak data from 14er API using peak name user selected - datalist ID: #peak-list
* - Add peak data to userPeakLog
* - Get peak photo from flickr API using lat and long from userPeakLog
* - Assign peak photo alt using peak name
* - Add peak photo and alt to userPeakLog
* - Update local storage
*/
function addPeak (peakName) {

}

/**
* Get peak data.
* - Get request to 14er API for data on peak by peakName
*/
function getPeakData (peakName) {

}

/**
* Get peak photo.
* - Get request to flikr API for photo of peak using lat and long
*/
function getPeakPhoto (lat, long) {

}

/**
* Remove peak prototype function.
* - Remove peak from userPeakLog
* - Update local storage
*/
function removePeak (peakName) {

}

/**
* Sort by date completed prototype function.
* - Sort userPeakLog by date completed
*/
function sortByDateCompleted () {

}

/**
* Sort by peak rank prototype function.
* - Sort userPeakLog by rank
*/
function sortByRank () {

}

/**
* Soft by peak name prototype function.
* - Sort userPeakLog by peak name
*/
function sortByPeakName () {

}

/**
* Render map.
* - Use Google maps API to render map of CO
* - Display pins at each completed peak using lat and long from userPeakLog
* - Enable info pop-up on click for pins
*/
function renderMap () {

}

$(startApp)
